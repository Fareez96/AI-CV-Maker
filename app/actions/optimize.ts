"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export interface OptimizationResult {
  optimizedCV: string;
  atsScore: number;
  keywords: string[];
  improvements: string[];
}

export async function optimizeCV(
  cvContent: string,
  jobDescription: string
): Promise<OptimizationResult> {
  if (!cvContent || !jobDescription) {
    throw new Error("CV and job description required");
  }

  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY not configured");
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Step 1: Extract keywords from job description
    const keywordResponse = await model.generateContent(`
Extract 30+ critical keywords, skills, and phrases from this job description:
${jobDescription}

Response format ONLY:
{"keywords": ["keyword1", "keyword2", ...], "must_haves": ["skill1", "skill2", ...]}
`);

    let jobData = { keywords: [], must_haves: [] };
    try {
      jobData = JSON.parse(keywordResponse.response.text());
    } catch {
      jobData = { keywords: [], must_haves: [] };
    }

    // Step 2: Optimize CV for 95%+ ATS
    const optimizedResponse = await model.generateContent(`
Rewrite this CV for MAXIMUM 95%+ ATS compatibility:

ORIGINAL CV:
${cvContent}

JOB DESCRIPTION:
${jobDescription}

REQUIRED KEYWORDS (use naturally):
${JSON.stringify(jobData.keywords)}

ATS RULES:
1. Include ALL keywords naturally
2. Use plain text only - NO special chars
3. Standard sections: Summary, Skills, Experience, Education
4. Action verbs + metrics everywhere
5. Reverse chronological order
6. 15-20 skills listed

OUTPUT ONLY optimized CV text, NO explanations.
`);

    const optimizedCV = optimizedResponse.response.text();

    // Step 3: Score ATS compatibility
    const scoreResponse = await model.generateContent(`
Score this CV for ATS (0-100, be strict):
${optimizedCV}

Respond ONLY with JSON:
{"score": number, "improvements": ["fix1", "fix2"]}
`);

    let scoreData = { score: 80, improvements: [] };
    try {
      scoreData = JSON.parse(scoreResponse.response.text());
    } catch {
      scoreData = { score: 80, improvements: [] };
    }

    return {
      optimizedCV,
      atsScore: Math.min(Math.max(scoreData.score || 80, 0), 100),
      keywords: jobData.keywords || [],
      improvements: scoreData.improvements || [],
    };
  } catch (error) {
    console.error("Optimization error:", error);
    throw new Error("CV optimization failed. Please try again.");
  }
}

