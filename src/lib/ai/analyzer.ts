import groq, { DEFAULT_MODEL } from "./groq";
import type { AnalysisResult, Suggestion } from "@/types/";

export interface AnalyzeResumeParams {
  resumeText: string;
  jobDescription?: string;
}

export async function analyzeResume({
  resumeText,
  jobDescription,
}: AnalyzeResumeParams): Promise<AnalysisResult> {
  try {
    const systemPrompt = `You are an expert ATS (Applicant Tracking System) resume analyzer and career advisor. Your role is to:
1. Analyze resumes for ATS compatibility
2. Identify missing keywords and gaps
3. Provide actionable improvement suggestions
4. Generate an improved version of the resume

Return ONLY valid JSON with this exact structure:
{
  "overallScore": number (0-100),
  "atsScore": number (0-100),
  "keywordScore": number (0-100),
  "formattingScore": number (0-100),
  "missingKeywords": string[],
  "matchedKeywords": string[],
  "suggestions": [
    {
      "id": string,
      "title": string,
      "description": string,
      "priority": "high" | "medium" | "low",
      "category": string
    }
  ],
  "atsIssues": string[],
  "improvedText": string
}`;

    const userPrompt = jobDescription
      ? `Analyze this resume against the job description and provide detailed feedback.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Provide a comprehensive analysis with:
- Overall compatibility score (0-100)
- ATS compatibility score
- Keyword match score
- Formatting score
- Missing keywords from job description
- Matched keywords
- Specific actionable suggestions (prioritized)
- ATS compatibility issues
- An improved version of the resume optimized for this job`
      : `Analyze this resume and provide detailed feedback for ATS optimization.

RESUME:
${resumeText}

Provide a comprehensive analysis with:
- Overall quality score (0-100)
- ATS compatibility score
- General keyword assessment
- Formatting score
- Suggested keywords to add
- Current strong keywords
- Specific actionable suggestions (prioritized)
- ATS compatibility issues
- An improved version of the resume with better ATS optimization`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      model: DEFAULT_MODEL,
      temperature: 0.3,
      max_tokens: 4096,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from AI");
    }

    const result = JSON.parse(content);

    // Validate and transform the response
    return {
      id: crypto.randomUUID(),
      userId: null,
      resumeText,
      jobDescription: jobDescription || null,
      overallScore: result.overallScore || 0,
      atsScore: result.atsScore || 0,
      keywordScore: result.keywordScore || 0,
      formattingScore: result.formattingScore || 0,
      missingKeywords: result.missingKeywords || [],
      matchedKeywords: result.matchedKeywords || [],
      suggestions: result.suggestions || [],
      atsIssues: result.atsIssues || [],
      improvedText: result.improvedText || resumeText,
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("AI Analysis Error:", error);
    throw new Error(
      `Failed to analyze resume: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

// Helper function to extract key skills from resume
export function extractSkills(text: string): string[] {
  const commonSkills = [
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "Python",
    "Java",
    "SQL",
    "AWS",
    "Docker",
    "Kubernetes",
    "Git",
    "Agile",
    "Project Management",
    "Leadership",
    "Communication",
  ];

  return commonSkills.filter((skill) =>
    text.toLowerCase().includes(skill.toLowerCase())
  );
}
