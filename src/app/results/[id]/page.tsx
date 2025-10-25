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
import type { AnalysisResult } from "@/types";

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

        // Try to load from database first
        if (id && id !== "anonymous") {
          const response = await fetch(`/api/analysis/${id}`);

          if (response.ok) {
            const data = await response.json();

            // Transform snake_case DB fields to camelCase
            const transformedAnalysis: AnalysisResult = {
              id: data.analysis.id,
              userId: data.analysis.user_id,
              resumeText: data.analysis.resume_text,
              jobDescription: data.analysis.job_description,
              overallScore: data.analysis.overall_score || 0,
              atsScore: data.analysis.ats_score || 0,
              keywordScore: data.analysis.keyword_score || 0,
              formattingScore: data.analysis.formatting_score || 0,
              missingKeywords: data.analysis.missing_keywords || [],
              matchedKeywords: data.analysis.matched_keywords || [],
              suggestions: data.analysis.suggestions || [],
              atsIssues: data.analysis.ats_issues || [],
              improvedText:
                data.analysis.improved_text || data.analysis.resume_text,
              createdAt: data.analysis.created_at,
            };

            setAnalysis(transformedAnalysis);
            setLoading(false);
            return;
          }
        }

        // Fallback to sessionStorage for anonymous or if DB fetch fails
        const stored = sessionStorage.getItem("analysisResult");
        if (stored) {
          const data = JSON.parse(stored);
          setAnalysis(data);
        } else {
          setError("Analysis results not found. Please run a new analysis.");
        }
      } catch (err) {
        console.error("Error loading analysis:", err);
        setError("Failed to load analysis results.");
      } finally {
        setLoading(false);
      }
    };

    loadAnalysis();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading results...</div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">{error}</div>
          <Link href="/analyze">
            <Button>Analyze Another Resume</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 py-12 px-4 pt-28">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <Link href="/analyze">
            <Button variant="ghost" className="text-white hover:text-blue-400">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Analyze
            </Button>
          </Link>

          <h1 className="text-3xl font-bold text-white">
            Resume Analysis Results
          </h1>

          <div className="flex items-center gap-2">
            <Badge
              variant={
                analysis.overallScore >= 80
                  ? "success"
                  : analysis.overallScore >= 60
                  ? "warning"
                  : "destructive"
              }
            >
              Overall Score: {analysis.overallScore}%
            </Badge>
          </div>
        </div>

        <div className="space-y-8">
          <div className="max-w-2xl mx-auto">
            <ScoreCard
              overallScore={analysis.overallScore}
              atsScore={analysis.atsScore}
              keywordScore={analysis.keywordScore}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <KeywordAnalysis
              keywordScore={analysis.keywordScore}
              missingKeywords={analysis.missingKeywords}
              matchedKeywords={analysis.matchedKeywords}
            />
            <ATSCompatibility
              atsScore={analysis.atsScore}
              atsIssues={analysis.atsIssues}
            />
          </div>

          <SuggestionsList suggestions={analysis.suggestions} />

          {analysis.resumeText && (
            <BeforeAfter
              originalText={analysis.resumeText}
              improvedText={analysis.improvedText}
              originalScore={Math.max(0, analysis.overallScore - 15)}
              improvedScore={analysis.overallScore}
            />
          )}

          <div className="max-w-2xl mx-auto">
            <ExportButton
              resumeText={analysis.improvedText}
              filename="improved-resume"
            />
          </div>

          <div className="text-center">
            <Link href="/analyze">
              <Button size="lg">
                <RotateCcw className="h-5 w-5 mr-2" />
                Analyze Another Resume
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
