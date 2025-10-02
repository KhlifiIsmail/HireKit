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
    const { data: { user } } = await supabase.auth.getUser();

    console.log("Analyzing resume with AI...");
    const analysis = await analyzeResume({
      resumeText,
      jobDescription: jobDescription || undefined,
    });

    if (user) {
      analysis.userId = user.id;
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

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}
