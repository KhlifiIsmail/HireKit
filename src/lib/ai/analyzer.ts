import groq, { DEFAULT_MODEL } from "./groq";
import type { AnalysisResult } from "@/types/";

export interface AnalyzeResumeParams {
  resumeText: string;
  jobDescription?: string;
}

/**
 * Extract technical skills, tools, and important keywords from text
 */
function extractKeywords(text: string): string[] {
  const technicalPatterns = [
    // Programming languages
    /\b(JavaScript|TypeScript|Python|Java|C\+\+|C#|Ruby|PHP|Go|Rust|Swift|Kotlin|Scala)\b/gi,
    // Frameworks & Libraries
    /\b(React|Angular|Vue|Next\.js|Django|Flask|Express|Node\.js|Spring|Laravel|Rails)\b/gi,
    // Databases
    /\b(PostgreSQL|MySQL|MongoDB|Redis|DynamoDB|Cassandra|Oracle|SQL Server)\b/gi,
    // Cloud & DevOps
    /\b(AWS|Azure|GCP|Docker|Kubernetes|Jenkins|GitLab|CircleCI|Terraform)\b/gi,
    // Tools & Methodologies
    /\b(Git|Agile|Scrum|CI\/CD|REST|GraphQL|Microservices|API|TDD|Linux)\b/gi,
    // AI/ML
    /\b(TensorFlow|PyTorch|Scikit-learn|Machine Learning|Deep Learning|NLP|Computer Vision)\b/gi,
    // Soft skills & business terms
    /\b(Leadership|Management|Communication|Problem[- ]solving|Team[- ]work|Project Management)\b/gi,
  ];

  const keywords = new Set<string>();

  technicalPatterns.forEach((pattern) => {
    const matches = text.match(pattern) || [];
    matches.forEach((match) => keywords.add(match.trim()));
  });

  // Also extract any capitalized multi-word terms (likely important concepts)
  const capitalizedTerms =
    text.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+\b/g) || [];
  capitalizedTerms.forEach((term) => {
    if (term.split(/\s+/).length <= 3) {
      // Only 2-3 word phrases
      keywords.add(term);
    }
  });

  return Array.from(keywords);
}

/**
 * Compare resume keywords against job description keywords
 */
function compareKeywords(resumeText: string, jobDescription: string) {
  const resumeKeywords = new Set(
    extractKeywords(resumeText).map((k) => k.toLowerCase())
  );
  const jobKeywords = extractKeywords(jobDescription);

  const matched: string[] = [];
  const missing: string[] = [];

  jobKeywords.forEach((keyword) => {
    if (resumeKeywords.has(keyword.toLowerCase())) {
      matched.push(keyword);
    } else {
      missing.push(keyword);
    }
  });

  return { matched, missing };
}

export async function analyzeResume({
  resumeText,
  jobDescription,
}: AnalyzeResumeParams): Promise<AnalysisResult> {
  try {
    // Pre-process keywords BEFORE sending to AI
    let precomputedKeywords = {
      matched: [] as string[],
      missing: [] as string[],
    };

    if (jobDescription) {
      precomputedKeywords = compareKeywords(resumeText, jobDescription);
    } else {
      // No job description - extract resume keywords as "matched"
      precomputedKeywords.matched = extractKeywords(resumeText);
    }

    const systemPrompt = `You are an expert ATS (Applicant Tracking System) resume analyzer and career advisor.

Your role is to:
1. Analyze resumes for ATS compatibility
2. Provide actionable improvement suggestions  
3. Generate an improved version of the resume
4. Assess formatting and structure

IMPORTANT: I will provide you with pre-analyzed keywords. Use them in your response.

Return ONLY valid JSON with this exact structure:
{
  "overallScore": number (0-100),
  "atsScore": number (0-100),
  "keywordScore": number (0-100),
  "formattingScore": number (0-100),
  "suggestions": [
    {
      "id": "unique-id-1",
      "title": "Clear actionable title",
      "description": "Detailed explanation of what to improve",
      "priority": "high" | "medium" | "low",
      "category": "Keywords" | "Formatting" | "Content" | "ATS"
    }
  ],
  "atsIssues": ["issue 1", "issue 2"],
  "improvedText": "full improved resume text here"
}`;

    const userPrompt = jobDescription
      ? `Analyze this resume against the job description.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

KEYWORD ANALYSIS (pre-computed):
- Missing keywords from job description: ${
          precomputedKeywords.missing.join(", ") || "None"
        }
- Matched keywords: ${precomputedKeywords.matched.join(", ") || "None"}

Provide:
- Overall compatibility score (0-100)
- ATS compatibility score  
- Keyword match score (base it on: ${
          precomputedKeywords.matched.length
        } matched out of ${
          precomputedKeywords.matched.length +
          precomputedKeywords.missing.length
        } total)
- Formatting score
- Specific actionable suggestions prioritized by impact
- ATS compatibility issues
- An improved version of the resume optimized for this job (incorporate missing keywords naturally)`
      : `Analyze this resume for general ATS optimization.

RESUME:
${resumeText}

IDENTIFIED SKILLS & KEYWORDS:
${precomputedKeywords.matched.join(", ")}

Provide:
- Overall quality score (0-100)
- ATS compatibility score
- Keyword optimization score
- Formatting score
- Specific actionable suggestions for improvement
- ATS compatibility issues  
- An improved version of the resume with better ATS optimization`;

    console.log("🔍 Sending to Groq with keywords:", {
      matched: precomputedKeywords.matched.length,
      missing: precomputedKeywords.missing.length,
    });

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

    // Calculate keyword score if not provided
    let keywordScore = result.keywordScore || 0;
    if (
      jobDescription &&
      precomputedKeywords.matched.length + precomputedKeywords.missing.length >
        0
    ) {
      keywordScore = Math.round(
        (precomputedKeywords.matched.length /
          (precomputedKeywords.matched.length +
            precomputedKeywords.missing.length)) *
          100
      );
    }

    console.log("✅ Analysis complete:", {
      overallScore: result.overallScore,
      keywordScore,
      matchedCount: precomputedKeywords.matched.length,
      missingCount: precomputedKeywords.missing.length,
    });

    // Validate and transform the response
    return {
      id: crypto.randomUUID(),
      userId: null,
      resumeText,
      jobDescription: jobDescription || null,
      overallScore: result.overallScore || 0,
      atsScore: result.atsScore || 0,
      keywordScore, // Use our calculated score
      formattingScore: result.formattingScore || 0,
      missingKeywords: precomputedKeywords.missing, // Use pre-computed
      matchedKeywords: precomputedKeywords.matched, // Use pre-computed
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
