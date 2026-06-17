"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { cvs } from "@/lib/db/schema";
import { v4 as uuid } from "uuid";

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");
  return session.user.id;
}

async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const pdfParse = require("pdf-parse");
    const data = await pdfParse(buffer);
    return data.text || "";
  } catch (error) {
    console.error("[v0] PDF parsing error:", error);
    return "";
  }
}

async function extractTextFromDocx(buffer: Buffer): Promise<string> {
  try {
    const mammoth = require("mammoth");
    const result = await mammoth.extractRawText({ buffer });
    return result.value || "";
  } catch (error) {
    console.error("[v0] DOCX parsing error:", error);
    return "";
  }
}

export async function processAndUploadFile(
  fileName: string,
  fileContent: Buffer,
  fileType: string
): Promise<{ id: string; title: string; content: string }> {
  try {
    const userId = await getUserId();
    let extractedText = "";

    if (fileType === "application/pdf") {
      extractedText = await extractTextFromPDF(fileContent);
    } else if (
      fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      fileType === "application/msword"
    ) {
      extractedText = await extractTextFromDocx(fileContent);
    } else if (fileType === "text/plain") {
      extractedText = fileContent.toString("utf-8");
    } else {
      throw new Error("Unsupported file type");
    }

    if (!extractedText.trim()) {
      throw new Error("No text content found in file");
    }

    const id = uuid();
    const title = fileName.replace(/\.[^/.]+$/, "");

    await db.insert(cvs).values({
      id,
      userId,
      title,
      originalContent: extractedText,
      fileType,
    });

    return { id, title, content: extractedText };
  } catch (error) {
    console.error("[v0] File upload error:", error);
    throw error instanceof Error ? error : new Error("Failed to process file");
  }
}
