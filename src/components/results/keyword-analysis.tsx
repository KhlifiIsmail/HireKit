"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Search,
  TrendingUp,
  AlertTriangle,
  Copy,
  Check,
  Target,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface KeywordAnalysisProps {
  keywordScore: number;
  missingKeywords: string[];
  strengths?: string[];
  className?: string;
}

export function KeywordAnalysis({
  keywordScore,
  missingKeywords,
  strengths = [],
  className,
}: KeywordAnalysisProps) {
  const [copiedKeywords, setCopiedKeywords] = useState<Set<string>>(new Set());
  const [showAll, setShowAll] = useState(false);

  const copyKeyword = async (keyword: string) => {
    try {
      await navigator.clipboard.writeText(keyword);
      setCopiedKeywords((prev) => new Set(prev).add(keyword));
      setTimeout(() => {
        setCopiedKeywords((prev) => {
          const newSet = new Set(prev);
          newSet.delete(keyword);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      console.error("Failed to copy keyword:", err);
    }
  };

  const copyAllKeywords = async () => {
    try {
      const keywordText = missingKeywords.join(", ");
      await navigator.clipboard.writeText(keywordText);
      // Mark all as copied temporarily
      setCopiedKeywords(new Set(missingKeywords));
      setTimeout(() => {
        setCopiedKeywords(new Set());
      }, 2000);
    } catch (err) {
      console.error("Failed to copy keywords:", err);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getProgressVariant = (score: number) => {
    if (score >= 80) return "success";
    if (score >= 60) return "warning";
    return "danger";
  };

  const displayKeywords = showAll
    ? missingKeywords
    : missingKeywords.slice(0, 10);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Keyword Score Card */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-6 w-6 mr-2 text-blue-600" />
            Keyword Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Score Display */}
          <div className="text-center">
            <div
              className={cn(
                "text-4xl font-bold mb-2",
                getScoreColor(keywordScore)
              )}
            >
              {keywordScore}%
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Keyword Match Score
            </p>
            <Progress
              value={keywordScore}
              variant={getProgressVariant(keywordScore) as any}
              className="max-w-xs mx-auto"
              animated
            />
          </div>

          {/* Score Interpretation */}
          <div
            className={cn(
              "p-4 rounded-xl",
              keywordScore >= 80
                ? "bg-green-50 dark:bg-green-950/20"
                : keywordScore >= 60
                ? "bg-yellow-50 dark:bg-yellow-950/20"
                : "bg-red-50 dark:bg-red-950/20"
            )}
          >
            <div className="flex items-start space-x-3">
              {keywordScore >= 80 ? (
                <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
              ) : (
                <AlertTriangle
                  className={cn(
                    "h-5 w-5 mt-0.5",
                    keywordScore >= 60 ? "text-yellow-600" : "text-red-600"
                  )}
                />
              )}
              <div>
                <h4
                  className={cn(
                    "font-semibold mb-1",
                    keywordScore >= 80
                      ? "text-green-800 dark:text-green-400"
                      : keywordScore >= 60
                      ? "text-yellow-800 dark:text-yellow-400"
                      : "text-red-800 dark:text-red-400"
                  )}
                >
                  {keywordScore >= 80
                    ? "Excellent Keyword Optimization"
                    : keywordScore >= 60
                    ? "Good Keyword Coverage"
                    : "Keyword Optimization Needed"}
                </h4>
                <p
                  className={cn(
                    "text-sm",
                    keywordScore >= 80
                      ? "text-green-700 dark:text-green-300"
                      : keywordScore >= 60
                      ? "text-yellow-700 dark:text-yellow-300"
                      : "text-red-700 dark:text-red-300"
                  )}
                >
                  {keywordScore >= 80
                    ? "Your resume contains most of the key terms from the job description."
                    : keywordScore >= 60
                    ? "Your resume has good keyword coverage but could be improved."
                    : "Your resume is missing many important keywords from the job description."}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Missing Keywords */}
      {missingKeywords.length > 0 && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Target className="h-6 w-6 mr-2 text-orange-600" />
                Missing Keywords
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-sm">
                  {missingKeywords.length} missing
                </Badge>
                {missingKeywords.length > 0 && (
                  <Button variant="outline" size="sm" onClick={copyAllKeywords}>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy All
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-xl border border-orange-200 dark:border-orange-800">
              <p className="text-sm text-orange-800 dark:text-orange-300">
                <strong>Tip:</strong> Try to naturally incorporate these
                keywords into your resume to improve your match score and ATS
                compatibility.
              </p>
            </div>

            {/* Keywords Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {displayKeywords.map((keyword, index) => (
                <div
                  key={index}
                  className="group flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-900 dark:text-white truncate mr-2">
                    {keyword}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyKeyword(keyword)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto"
                  >
                    {copiedKeywords.has(keyword) ? (
                      <Check className="h-3 w-3 text-green-600" />
                    ) : (
                      <Copy className="h-3 w-3 text-gray-500" />
                    )}
                  </Button>
                </div>
              ))}
            </div>

            {/* Show More/Less Button */}
            {missingKeywords.length > 10 && (
              <div className="text-center">
                <Button variant="outline" onClick={() => setShowAll(!showAll)}>
                  {showAll ? (
                    "Show Less"
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-1" />
                      Show {missingKeywords.length - 10} More Keywords
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Strengths */}
      {strengths.length > 0 && (
        <Card className="border-0 shadow-lg bg-green-50 dark:bg-green-950/20">
          <CardHeader>
            <CardTitle className="flex items-center text-green-800 dark:text-green-400">
              <TrendingUp className="h-6 w-6 mr-2" />
              Keyword Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              {strengths.map((strength, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg"
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                  <span className="text-sm text-green-800 dark:text-green-300">
                    {strength}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Missing Keywords */}
      {missingKeywords.length === 0 && (
        <Card className="border-0 shadow-lg bg-green-50 dark:bg-green-950/20">
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-green-800 dark:text-green-400 mb-2">
              Perfect Keyword Match!
            </h3>
            <p className="text-green-700 dark:text-green-300">
              Your resume contains all the important keywords from the job
              description.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
