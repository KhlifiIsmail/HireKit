import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient, serverAuth } from "@/lib/supabase/server";
import {
  calculateKeywordMatch,
  findMissingKeywords,
} from "@/lib/utils/text-processing";
import {
  calculateOverallScore,
  calculateATSScore,
} from "@/lib/utils/score-calculator";

interface AnalysisRequest {
  resumeText: string;
  jobDescription?: string;
  filename: string;
}

interface Suggestion {
  id: string;
  type: "high" | "medium" | "low";
  category: string;
  title: string;
  description: string;
  example?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: AnalysisRequest = await request.json();
    const { resumeText, jobDescription, filename } = body;

    if (!resumeText || resumeText.trim().length < 50) {
      return NextResponse.json(
        { error: "Resume text is required and must be substantial" },
        { status: 400 }
      );
    }

    // Get authenticated user (optional - can work without auth)
    let userId: string | null = null;
    try {
      const user = await serverAuth.getUser();
      userId = user.user?.id || null;
    } catch {
      // Allow anonymous usage
    }

    // Calculate scores
    const atsScore = calculateATSScore(resumeText);
    const keywordMatchScore = jobDescription
      ? calculateKeywordMatch(resumeText, jobDescription)
      : 75; // Default score when no job description

    const overallScore = calculateOverallScore(keywordMatchScore, atsScore);

    // Find missing keywords
    const missingKeywords = jobDescription
      ? findMissingKeywords(resumeText, jobDescription)
      : [];

    // Generate AI suggestions (simplified for now - will enhance with Groq later)
    const suggestions = generateSuggestions(
      resumeText,
      jobDescription,
      atsScore,
      keywordMatchScore
    );

    // Identify strengths and weaknesses
    const strengths = identifyStrengths(
      resumeText,
      atsScore,
      keywordMatchScore
    );
    const weaknesses = identifyWeaknesses(
      resumeText,
      atsScore,
      keywordMatchScore,
      missingKeywords
    );

    // Generate improved resume version (basic for now)
    const improvedResumeText = generateImprovedResume(resumeText, suggestions);

    const analysisResult = {
      overall_score: overallScore,
      ats_score: atsScore,
      keyword_match_score: keywordMatchScore,
      suggestions,
      missing_keywords: missingKeywords.slice(0, 10), // Limit to top 10
      strengths,
      weaknesses,
      improved_resume_text: improvedResumeText,
    };

    // Save to database if user is authenticated
    if (userId) {
      try {
        const supabase = createServerSupabaseClient();

        const { data: analysis, error: dbError } = await supabase
          .from("analyses")
          .insert({
            user_id: userId,
            resume_text: resumeText,
            job_description: jobDescription || null,
            original_filename: filename,
            overall_score: overallScore,
            ats_score: atsScore,
            keyword_match_score: keywordMatchScore,
            suggestions: suggestions,
            missing_keywords: missingKeywords,
            strengths,
            weaknesses,
            improved_resume_text: improvedResumeText,
            status: "completed",
          })
          .select()
          .single();

        if (dbError) {
          console.error("Database error:", dbError);
          // Continue without saving - don't fail the analysis
        }

        return NextResponse.json({
          success: true,
          data: {
            id: analysis?.id,
            ...analysisResult,
          },
        });
      } catch (dbError) {
        console.error("Database operation failed:", dbError);
        // Return results without saving
      }
    }

    // Return analysis results (for anonymous users or if DB fails)
    return NextResponse.json({
      success: true,
      data: analysisResult,
    });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Analysis failed. Please try again." },
      { status: 500 }
    );
  }
}

function generateSuggestions(
  resumeText: string,
  jobDescription?: string,
  atsScore?: number,
  keywordScore?: number
): Suggestion[] {
  const suggestions: Suggestion[] = [];
  const lowerResume = resumeText.toLowerCase();

  // ATS-related suggestions
  if (atsScore && atsScore < 70) {
    suggestions.push({
      id: "ats-headers",
      type: "high",
      category: "ATS Compatibility",
      title: "Use Standard Section Headers",
      description:
        'Replace creative headers with standard ones like "Experience", "Education", "Skills"',
      example: 'Use "Professional Experience" instead of "My Journey"',
    });
  }

  if (
    !lowerResume.includes("experience") &&
    !lowerResume.includes("employment")
  ) {
    suggestions.push({
      id: "add-experience",
      type: "high",
      category: "Content Structure",
      title: "Add Experience Section",
      description:
        "Include a dedicated work experience section with clear job titles and responsibilities",
    });
  }

  if (!lowerResume.includes("education") && !lowerResume.includes("degree")) {
    suggestions.push({
      id: "add-education",
      type: "medium",
      category: "Content Structure",
      title: "Add Education Section",
      description:
        "Include your educational background to provide complete professional context",
    });
  }

  // Keyword optimization suggestions
  if (keywordScore && keywordScore < 60 && jobDescription) {
    suggestions.push({
      id: "keyword-optimization",
      type: "high",
      category: "Keyword Optimization",
      title: "Increase Keyword Match",
      description:
        "Incorporate more relevant keywords from the job description throughout your resume",
      example:
        "Add specific skills and technologies mentioned in the job posting",
    });
  }

  // Content quality suggestions
  if (resumeText.length < 800) {
    suggestions.push({
      id: "expand-content",
      type: "medium",
      category: "Content Quality",
      title: "Expand Content",
      description:
        "Add more detail about your achievements and responsibilities",
      example: "Include specific metrics and outcomes from your work",
    });
  }

  // Contact information
  const hasEmail = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(
    resumeText
  );
  const hasPhone =
    /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(resumeText);

  if (!hasEmail || !hasPhone) {
    suggestions.push({
      id: "contact-info",
      type: "high",
      category: "Contact Information",
      title: "Complete Contact Information",
      description: "Ensure your resume includes both email and phone number",
      example: "john.doe@email.com | (555) 123-4567",
    });
  }

  // Skills section
  if (!lowerResume.includes("skills") && !lowerResume.includes("technical")) {
    suggestions.push({
      id: "add-skills",
      type: "medium",
      category: "Content Structure",
      title: "Add Skills Section",
      description:
        "Include a dedicated skills section highlighting your technical and soft skills",
    });
  }

  return suggestions;
}

function identifyStrengths(
  resumeText: string,
  atsScore: number,
  keywordScore: number
): string[] {
  const strengths: string[] = [];
  const lowerResume = resumeText.toLowerCase();

  if (atsScore >= 80) {
    strengths.push("Excellent ATS compatibility");
  }

  if (keywordScore >= 70) {
    strengths.push("Strong keyword optimization");
  }

  if (resumeText.length > 1000) {
    strengths.push("Comprehensive content coverage");
  }

  if (
    lowerResume.includes("achieved") ||
    lowerResume.includes("increased") ||
    lowerResume.includes("improved")
  ) {
    strengths.push("Achievement-focused language");
  }

  if (
    lowerResume.includes("led") ||
    lowerResume.includes("managed") ||
    lowerResume.includes("directed")
  ) {
    strengths.push("Leadership experience highlighted");
  }

  if (/\d+%|\$\d+|\d+\+/.test(resumeText)) {
    strengths.push("Quantified achievements with metrics");
  }

  return strengths;
}

function identifyWeaknesses(
  resumeText: string,
  atsScore: number,
  keywordScore: number,
  missingKeywords: string[]
): string[] {
  const weaknesses: string[] = [];
  const lowerResume = resumeText.toLowerCase();

  if (atsScore < 60) {
    weaknesses.push("Poor ATS compatibility");
  }

  if (keywordScore < 50) {
    weaknesses.push("Low keyword match with job requirements");
  }

  if (resumeText.length < 500) {
    weaknesses.push("Content too brief");
  }

  if (missingKeywords.length > 10) {
    weaknesses.push("Missing key industry terms");
  }

  if (!lowerResume.includes("experience") && !lowerResume.includes("work")) {
    weaknesses.push("Missing work experience section");
  }

  if (!/\d+%|\$\d+|\d+\+/.test(resumeText)) {
    weaknesses.push("Lacks quantified achievements");
  }

  return weaknesses;
}

function generateImprovedResume(
  resumeText: string,
  suggestions: Suggestion[]
): string {
  // This is a simplified version - in a real implementation,
  // you'd use AI (Groq) to generate actual improvements

  let improved = resumeText;

  // Basic improvements based on suggestions
  suggestions.forEach((suggestion) => {
    switch (suggestion.id) {
      case "contact-info":
        if (!improved.includes("@")) {
          improved =
            "John Doe\nEmail: john.doe@email.com | Phone: (555) 123-4567\n\n" +
            improved;
        }
        break;
      case "add-experience":
        if (!improved.toLowerCase().includes("experience")) {
          improved +=
            "\n\nPROFESSIONAL EXPERIENCE\n[Add your work experience here with job titles, companies, dates, and key achievements]";
        }
        break;
      case "add-education":
        if (!improved.toLowerCase().includes("education")) {
          improved += "\n\nEDUCATION\n[Add your educational background here]";
        }
        break;
      case "add-skills":
        if (!improved.toLowerCase().includes("skills")) {
          improved +=
            "\n\nSKILLS\n[Add relevant technical and soft skills here]";
        }
        break;
    }
  });

  return improved;
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
