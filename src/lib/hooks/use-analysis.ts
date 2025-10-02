"use client";

import { useState, useCallback } from "react";

export interface AnalysisResult {
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
}

export interface UseAnalysisReturn {
  analyzeResume: (
    resumeText: string,
    jobDescription?: string,
    filename?: string
  ) => Promise<AnalysisResult>;
  isAnalyzing: boolean;
  error: string | null;
  clearError: () => void;
}

export function useAnalysis(): UseAnalysisReturn {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const analyzeResume = useCallback(
    async (
      resumeText: string,
      jobDescription?: string,
      filename: string = "resume.pdf"
    ): Promise<AnalysisResult> => {
      setIsAnalyzing(true);
      setError(null);

      try {
        if (!resumeText || resumeText.trim().length < 50) {
          throw new Error("Resume text is too short for analysis");
        }

        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            resumeText: resumeText.trim(),
            jobDescription: jobDescription?.trim() || undefined,
            filename,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Analysis failed");
        }

        if (!result.success) {
          throw new Error(result.error || "Analysis failed");
        }

        return result.data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Analysis failed";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsAnalyzing(false);
      }
    },
    []
  );

  return {
    analyzeResume,
    isAnalyzing,
    error,
    clearError,
  };
}
