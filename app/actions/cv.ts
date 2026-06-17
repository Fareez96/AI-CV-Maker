"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { cvs, cvOptimizations } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { headers } from "next/headers";
import { v4 as uuid } from "uuid";
import { GoogleGenerativeAI } from "@google/generative-ai";

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");
  return session.user.id;
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function uploadCV(title: string, content: string, fileType: string) {
  try {
    const userId = await getUserId();
    const cvId = uuid();

    await db.insert(cvs).values({
      id: cvId,
      userId,
      title,
      originalContent: content,
      fileType,
    });

    return { success: true, cvId };
  } catch (error) {
    console.error("[v0] CV upload error:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to upload CV"
    );
  }
}

export async function getCVs() {
  try {
    const userId = await getUserId();
    return await db.select().from(cvs).where(eq(cvs.userId, userId));
  } catch (error) {
    console.error("[v0] Get CVs error:", error);
    return [];
  }
}

async function retryWithBackoff(
  fn: () => Promise<string>,
  retries = 3
): Promise<string> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
  throw new Error("Max retries exceeded");
}

async function analyzeJobDescription(jobDescription: string): Promise<string> {
  return retryWithBackoff(async () => {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(
      `Extract and list the key technical skills, qualifications, and experience required from this job description:\n\n${jobDescription}`
    );
    return result.response.text();
  });
}

async function optimizeCV(cvContent: string, jobDescription: string, jobRequirements: string): Promise<string> {
  return retryWithBackoff(async () => {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(
      `You are an expert CV optimizer. Rewrite this CV to match the job requirements and highlight relevant experience with quantified metrics where possible. 
      
Job Requirements:
${jobRequirements}

Current CV:
${cvContent}

Provide the optimized CV text only, without any additional commentary.`
    );
    return result.response.text();
  });
}

async function scoreATS(optimizedCV: string, jobRequirements: string): Promise<{ score: number; feedback: string }> {
  return retryWithBackoff(async () => {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(
      `Score this CV's ATS (Applicant Tracking System) compatibility on a scale of 0-100. Consider:
1. Presence of required keywords
2. Proper formatting and structure
3. Relevance to job requirements

Job Requirements:
${jobRequirements}

CV:
${optimizedCV}

Response format ONLY:
SCORE: [number]
FEEDBACK: [brief feedback]`
    );
    
    const text = result.response.text();
    const scoreMatch = text.match(/SCORE:\s*(\d+)/);
    const feedbackMatch = text.match(/FEEDBACK:\s*(.+?)(?=$|SCORE:)/s);
    
    return {
      score: scoreMatch ? parseInt(scoreMatch[1], 10) : 0,
      feedback: feedbackMatch ? feedbackMatch[1].trim() : "Unable to generate feedback",
    };
  });
}

export async function optimizeCV_Action(
  cvId: string,
  jobDescription: string
) {
  try {
    const userId = await getUserId();

    // Fetch the CV
    const cvRecord = await db
      .select()
      .from(cvs)
      .where(and(eq(cvs.id, cvId), eq(cvs.userId, userId)))
      .limit(1);

    if (!cvRecord.length) throw new Error("CV not found");

    const cvContent = cvRecord[0].originalContent;

    // Step 1: Analyze job description
    const jobRequirements = await analyzeJobDescription(jobDescription);

    // Step 2: Optimize CV
    const optimizedContent = await optimizeCV(cvContent, jobDescription, jobRequirements);

    // Step 3: Score ATS
    const { score, feedback } = await scoreATS(optimizedContent, jobRequirements);

    // Step 4: Save optimization
    const optimizationId = uuid();
    await db.insert(cvOptimizations).values({
      id: optimizationId,
      userId,
      cvId,
      jobDescription,
      optimizedContent,
      atsScore: score.toString(),
      keywords: jobRequirements,
      suggestions: feedback,
    });

    return {
      success: true,
      optimizationId,
      optimizedContent,
      atsScore: score,
      keywords: jobRequirements,
      suggestions: feedback,
    };
  } catch (error) {
    console.error("[v0] CV optimization error:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to optimize CV"
    );
  }
}

export async function getOptimizations(cvId: string) {
  try {
    const userId = await getUserId();
    return await db
      .select()
      .from(cvOptimizations)
      .where(
        and(
          eq(cvOptimizations.cvId, cvId),
          eq(cvOptimizations.userId, userId)
        )
      );
  } catch (error) {
    console.error("[v0] Get optimizations error:", error);
    return [];
  }
}

export async function deleteCV(cvId: string) {
  try {
    const userId = await getUserId();
    await db
      .delete(cvs)
      .where(and(eq(cvs.id, cvId), eq(cvs.userId, userId)));
    return { success: true };
  } catch (error) {
    console.error("[v0] Delete CV error:", error);
    throw new Error("Failed to delete CV");
  }
}
