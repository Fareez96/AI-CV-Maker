"use server";

import { getServerSession } from "better-auth/next-js";
import { auth } from "@/lib/auth";

export async function generatePDF(content: string, fileName: string): Promise<Buffer> {
  try {
    const PDFDocument = require("pdfkit");
    
    const doc = new PDFDocument({
      bufferPages: true,
      size: "A4",
      margin: 50,
    });

    const chunks: Buffer[] = [];
    
    await new Promise<void>((resolve, reject) => {
      doc.on("data", (chunk: Buffer) => chunks.push(chunk));
      doc.on("end", resolve);
      doc.on("error", reject);

      // Add title
      doc.fontSize(16).font("Helvetica-Bold").text("CV", { align: "center" });
      doc.moveDown();

      // Add content
      doc.fontSize(11).font("Helvetica");

      const lines = content.split("\n");
      for (const line of lines) {
        doc.text(line || " ", {
          width: doc.page.width - 100,
          align: "left",
        });
      }

      doc.end();
    });

    return Buffer.concat(chunks);
  } catch (error) {
    console.error("[v0] PDF generation error:", error);
    throw new Error("Failed to generate PDF");
  }
}
