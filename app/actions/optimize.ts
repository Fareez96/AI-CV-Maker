"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

interface OptimizationResult {
  optimizedCV: string;
  atsScore: number;
  keywords: string[];
  suggestions: string[];
  improvements: string[];
}

export async function optimizeCV(
  cvContent: string,
  jobDescription: string,
  template: string
): Promise<OptimizationResult> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Step 1: Analyze job description for keywords
    const jobAnalysis = await model.generateContent(`
Extract the top 15 key technical skills, responsibilities, and requirements from this job description:

${jobDescription}

Format as JSON with arrays for: skills, responsibilities, tools, seniority_level
`);

    const jobData = JSON.parse(jobAnalysis.response.text());

    // Step 2: Tailor CV to job requirements
    const optimizedResponse = await model.generateContent(`
You are an expert CV optimizer. Rewrite this CV to be optimized for the following job:

JOB DESCRIPTION:
${jobDescription}

ORIGINAL CV:
${cvContent}

REQUIREMENTS:
1. Match the CV to the job requirements while keeping it truthful
2. Use active verbs and quantifiable metrics
3. Highlight relevant skills prominently
4. Reorganize content to show best fit first
5. Keep it in ${template} format
6. Aim for ATS compliance with proper formatting

Output ONLY the optimized CV text, nothing else.
`);

    const optimizedCV = optimizedResponse.response.text();

    // Step 3: Score ATS compatibility
    const atsResponse = await model.generateContent(`
Score this CV for ATS (Applicant Tracking System) compatibility on a scale of 0-100.

CV:
${optimizedCV}

JOB REQUIREMENTS:
${JSON.stringify(jobData)}

Provide response in this exact JSON format:
{
  "score": number (0-100),
  "keywords_matched": number,
  "keywords_missing": number,
  "improvements": ["improvement 1", "improvement 2", "improvement 3"]
}
`);

    const atsData = JSON.parse(atsResponse.response.text());

    return {
      optimizedCV,
      atsScore: atsData.score,
      keywords: jobData.skills || [],
      suggestions: jobData.responsibilities || [],
      improvements: atsData.improvements || [],
    };
  } catch (error) {
    console.error("[v0] Optimization error:", error);
    throw new Error("Failed to optimize CV. Please try again.");
  }
}
