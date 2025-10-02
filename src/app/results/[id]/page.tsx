"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ScoreCard } from "@/components/results/score-card";
import { SuggestionsList } from "@/components/results/suggestions-list";
import { KeywordAnalysis } from "@/components/results/keyword-analysis";
import { ATSCompatibility } from "@/components/results/ats-compatibility";
import { BeforeAfter } from "@/components/results/before-after";
import { ExportButton } from "@/components/results/export-button";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Share2, RotateCcw } from "lucide-react";
import Link from "next/link";

interface AnalysisResult {
  id?: string;
  overall_score: number;
  ats_score: number;
  keyword_match_score: number;
  suggestions: Array<{
    id: string;
    type: "high" | "medium" | "low";
    category: string;
    title: string;
    description: string;
    example?: string;
  }>;
  missing_keywords: string[];
  strengths: string[];
  weaknesses: string[];
  improved_resume_text: string;
  original_resume_text?: string;
  filename?: string;
}

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAnalysis = async () => {
      try {
        const id = params.id as string;

        if (id === "anonymous") {
          // Load from sessionStorage for anonymous users
          const stored = sessionStorage.getItem("analysisResult");
          if (stored) {
            const data = JSON.parse(stored);
            setAnalysis(data);
          } else {
            setError("Analysis results not found. Please try analyzing again.");
          }
        } else {
          // Load from database for authenticated users
          const response = await fetch(`/api/analysis/${id}`);
          if (response.ok) {
            const data = await response.json();
            setAnalysis(data.analysis);
          } else {
            setError("Analysis not found.");
          }
        }
      } catch (err) {
        console.error("Error loading analysis:", err);
        setError("Failed to load analysis results.");
      } finally {
        setLoading(false);
      }
    };

    loadAnalysis();
  }, [params.id]);

  const shareResults = async () => {
    if (navigator.share && analysis) {
      try {
        await navigator.share({
          title: "My Resume Analysis Results",
          text: `I scored ${analysis.overall_score}% on my resume analysis with HireKit!`,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Sharing failed:", err);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading your results...
          </p>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Results Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || "The analysis results could not be found."}
          </p>
          <Button asChild>
            <Link href="/analyze">
              <RotateCcw className="h-4 w-4 mr-2" />
              Analyze Another Resume
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/analyze">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Analyze
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Resume Analysis Results
              </h1>
              {analysis.filename && (
                <p className="text-gray-600 dark:text-gray-400">
                  {analysis.filename}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Badge
              variant={
                analysis.overall_score >= 80
                  ? "success"
                  : analysis.overall_score >= 60
                  ? "warning"
                  : "destructive"
              }
              className="text-sm px-3 py-1"
            >
              Overall Score: {analysis.overall_score}%
            </Badge>
            <Button variant="outline" size="sm" onClick={shareResults}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Results Grid */}
        <div className="space-y-8">
          {/* Top Row - Score Card */}
          <div className="max-w-2xl mx-auto">
            <ScoreCard
              overallScore={analysis.overall_score}
              atsScore={analysis.ats_score}
              keywordScore={analysis.keyword_match_score}
            />
          </div>

          {/* Second Row - Two Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <KeywordAnalysis
              keywordScore={analysis.keyword_match_score}
              missingKeywords={analysis.missing_keywords}
              strengths={analysis.strengths}
            />
            <ATSCompatibility
              atsScore={analysis.ats_score}
              weaknesses={analysis.weaknesses}
              strengths={analysis.strengths}
            />
          </div>

          {/* Third Row - Suggestions */}
          <SuggestionsList suggestions={analysis.suggestions} />

          {/* Fourth Row - Before/After Comparison */}
          {analysis.original_resume_text && (
            <BeforeAfter
              originalText={analysis.original_resume_text}
              improvedText={analysis.improved_resume_text}
              originalScore={analysis.overall_score - 15} // Simulate original score
              improvedScore={analysis.overall_score}
            />
          )}

          {/* Fifth Row - Export */}
          <div className="max-w-2xl mx-auto">
            <ExportButton
              resumeText={analysis.improved_resume_text}
              filename={
                analysis.filename?.replace(/\.[^/.]+$/, "") || "improved-resume"
              }
            />
          </div>

          {/* Action Buttons */}
          <div className="text-center space-y-4">
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/analyze">
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Analyze Another Resume
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/dashboard">View Analysis History</Link>
              </Button>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              Want to save your results?{" "}
              <Link href="/signup" className="text-blue-600 hover:underline">
                Create a free account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
