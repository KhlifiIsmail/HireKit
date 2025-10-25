import { NextRequest, NextResponse } from "next/server";
import { analyzeResume } from "@/lib/ai/analyzer";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { resumeText, jobDescription } = await request.json();

    if (!resumeText || typeof resumeText !== "string") {
      return NextResponse.json(
        { error: "Resume text is required" },
        { status: 400 }
      );
    }

    if (resumeText.length < 100) {
      return NextResponse.json(
        { error: "Resume text is too short" },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Check if user is authenticated
    if (!user) {
      return NextResponse.json(
        { error: "You must be logged in to analyze resumes" },
        { status: 401 }
      );
    }

    // Check credits
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("credits")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: "Failed to fetch user profile" },
        { status: 500 }
      );
    }

    if (profile.credits <= 0) {
      return NextResponse.json(
        { error: "Insufficient credits. Please purchase more to continue." },
        { status: 403 }
      );
    }

    console.log("Analyzing resume with AI...");
    const analysis = await analyzeResume({
      resumeText,
      jobDescription: jobDescription || undefined,
    });

    // Deduct 1 credit
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ credits: profile.credits - 1 })
      .eq("id", user.id);

    if (updateError) {
      console.error("Failed to update credits:", updateError);
    }

    // Save analysis to database
    const { data: savedAnalysis, error: saveError } = await supabase
      .from("analyses")
      .insert({
        user_id: user.id,
        resume_text: resumeText,
        job_description: jobDescription || null,
        overall_score: analysis.overallScore,
        ats_score: analysis.atsScore,
        keyword_score: analysis.keywordScore,
        suggestions: analysis.suggestions,
        improved_text: analysis.improvedText,
      })
      .select()
      .single();

    if (saveError) {
      console.error("Failed to save analysis:", saveError);
      return NextResponse.json(
        { error: "Analysis completed but failed to save results" },
        { status: 500 }
      );
    }

    console.log("Analysis complete and saved:", {
      id: savedAnalysis.id,
      overallScore: analysis.overallScore,
      creditsRemaining: profile.credits - 1,
    });

    return NextResponse.json({
      ...analysis,
      id: savedAnalysis.id,
      creditsRemaining: profile.credits - 1,
    });
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
