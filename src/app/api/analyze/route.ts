import { NextRequest, NextResponse } from "next/server";
import { analyzeResume } from "@/lib/ai/analyzer";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { resumeText, jobDescription } = await request.json();

    // Validate input
    if (!resumeText || typeof resumeText !== "string") {
      return NextResponse.json(
        { error: "Resume text is required" },
        { status: 400 }
      );
    }

    if (resumeText.length < 100) {
      return NextResponse.json(
        {
          error: "Resume text is too short. Please provide a complete resume.",
        },
        { status: 400 }
      );
    }

    // Get user from Supabase (optional - for anonymous users)
    const supabase = createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Analyze resume using Groq AI
    console.log("Analyzing resume with AI...");
    const analysis = await analyzeResume({
      resumeText,
      jobDescription: jobDescription || undefined,
    });

    // Add user ID if authenticated
    if (user) {
      analysis.userId = user.id;

      // TODO: Save to database
      // const { error: saveError } = await supabase
      //   .from('analyses')
      //   .insert({
      //     user_id: user.id,
      //     resume_text: resumeText,
      //     job_description: jobDescription,
      //     overall_score: analysis.overallScore,
      //     ats_score: analysis.atsScore,
      //     keyword_score: analysis.keywordScore,
      //     formatting_score: analysis.formattingScore,
      //     missing_keywords: analysis.missingKeywords,
      //     matched_keywords: analysis.matchedKeywords,
      //     suggestions: analysis.suggestions,
      //     ats_issues: analysis.atsIssues,
      //     improved_text: analysis.improvedText,
      //   });

      // if (saveError) {
      //   console.error('Failed to save analysis:', saveError);
      // }

      // TODO: Deduct credit
      // await supabase.rpc('deduct_credit', { user_id: user.id });
    }

    console.log("Analysis complete:", {
      overallScore: analysis.overallScore,
      suggestionsCount: analysis.suggestions.length,
    });

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Analysis error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Failed to analyze resume";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
