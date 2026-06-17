"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Timeout handler for high-traffic
const withTimeout = async <T,>(
  promise: Promise<T>,
  timeoutMs: number = 30000
): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Request timeout")), timeoutMs)
    ),
  ]);
};

// Retry with exponential backoff
const withRetry = async <T,>(
  fn: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> => {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      const delay = Math.pow(2, attempt) * 1000;
      if (attempt < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError || new Error("All retries failed");
};

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
  // Validate inputs
  if (!cvContent || !jobDescription) {
    throw new Error("CV content and job description are required");
  }

  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY environment variable is not set");
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Step 1: Analyze job description with timeout and retry
    const jobAnalysis = await withRetry(async () =>
      withTimeout(
        model.generateContent(`
CRITICAL: Extract ALL important keywords, skills, tools, and exact phrases from this job description.
You MUST extract at least 25 key terms that should appear in the optimized CV.

${jobDescription}

Format as JSON with:
- skills: [list of 10+ technical skills with exact names]
- tools: [specific tools, platforms, frameworks mentioned]
- soft_skills: [leadership, communication, etc]
- responsibilities: [key verbs and actions]
- keywords: [complete list of 25+ important terms to include]
- must_have: [critical requirements that must appear in CV]
`),
        25000
      )
    );

    let jobData;
    try {
      jobData = JSON.parse(jobAnalysis.response.text());
    } catch {
      jobData = {
        skills: [],
        keywords: [],
        must_have: [],
        responsibilities: [],
      };
    }

    // Step 2: Aggressive ATS-optimized CV rewrite
    const optimizedResponse = await withRetry(async () =>
      withTimeout(
        model.generateContent(`
You are an ATS optimization expert. Rewrite this CV for MAXIMUM ATS compatibility targeting 95%+ score.

ORIGINAL CV:
${cvContent}

TARGET JOB:
${jobDescription}

REQUIRED KEYWORDS TO INCLUDE (CRITICAL):
${JSON.stringify(jobData.keywords || [])}

STRICT OPTIMIZATION RULES FOR 95%+ ATS SCORE:
1. INCLUDE ALL critical keywords naturally throughout the CV
2. Use EXACT terminology from the job description
3. REMOVE all special characters, symbols, graphics
4. Use ONLY plain text, numbers, hyphens, and periods
5. Organize sections: Summary, Skills, Experience, Education
6. Put MOST RELEVANT skills first
7. Use action verbs: Implemented, Developed, Led, Managed
8. Add quantifiable metrics to EVERY achievement
9. Reverse chronological order for experience
10. Ensure skills section has 15-20 relevant keywords
11. Match job seniority level exactly
12. NO fancy formatting, NO tables, NO graphics
13. Standard margins (0.5-1 inch)
14. Keep truthful but maximize relevance

OUTPUT ONLY the optimized CV text with NO explanations.
`),
        30000
      )
    );

    const optimizedCV = optimizedResponse.response.text();

    // Step 3: ATS scoring
    const atsResponse = await withRetry(async () =>
      withTimeout(
        model.generateContent(`
Score this CV for ATS compatibility on a strict scale of 0-100.
Target: 95%+

CV:
${optimizedCV}

JOB REQUIREMENTS:
${JSON.stringify(jobData)}

STRICT CRITERIA:
- Keyword match rate (90%+ required): 30 points
- Formatting compliance: 20 points
- Skills section: 15 points
- Experience relevance: 15 points
- Seniority alignment: 10 points
- Action verbs & metrics: 10 points

Response format ONLY (JSON):
{"score": number, "keyword_match_percentage": number, "keywords_matched": number, "improvements": []}
`),
        25000
      )
    );

    let atsData;
    try {
      atsData = JSON.parse(atsResponse.response.text());
    } catch {
      atsData = {
        score: 75,
        keyword_match_percentage: 75,
        improvements: ["Ensure all keywords are present"],
      };
    }

    const finalScore = Math.min(Math.max(atsData.score || 75, 0), 100);

    return {
      optimizedCV,
      atsScore: finalScore,
      keywords: jobData.keywords || jobData.skills || [],
      suggestions: jobData.must_have || jobData.responsibilities || [],
      improvements: atsData.improvements || [],
    };
  } catch (error) {
    console.error("[v0] Optimization error:", error);

    // Graceful fallback
    if (
      error instanceof Error &&
      error.message.includes("API key")
    ) {
      throw new Error(
        "API configuration error. Please check your GEMINI_API_KEY."
      );
    }

    throw new Error(
      error instanceof Error
        ? `Optimization failed: ${error.message}`
        : "Failed to optimize CV. Please try again."
    );
  }
}

