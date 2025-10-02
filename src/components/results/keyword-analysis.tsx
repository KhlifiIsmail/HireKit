"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface KeywordAnalysisProps {
  missingKeywords: string[];
  matchedKeywords: string[];
  keywordScore: number;
  className?: string;
}

export function KeywordAnalysis({
  missingKeywords = [],
  matchedKeywords = [],
  keywordScore,
  className,
}: KeywordAnalysisProps) {
  const [showAll, setShowAll] = useState(false);
  const [copiedKeyword, setCopiedKeyword] = useState<string | null>(null);

  const copyKeyword = (keyword: string) => {
    navigator.clipboard.writeText(keyword);
    setCopiedKeyword(keyword);
    setTimeout(() => setCopiedKeyword(null), 2000);
  };

  const displayKeywords = showAll
    ? missingKeywords
    : missingKeywords.slice(0, 10);

  return (
    <Card className={cn("border-0 shadow-lg", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Keyword Analysis
            <Badge
              variant={
                keywordScore >= 70
                  ? "success"
                  : keywordScore >= 50
                  ? "warning"
                  : "destructive"
              }
            >
              {keywordScore}% Match
            </Badge>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Missing Keywords */}
        {missingKeywords.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
              Missing Keywords ({missingKeywords.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {displayKeywords.map((keyword, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => copyKeyword(keyword)}
                  className="gap-2"
                >
                  {keyword}
                  {copiedKeyword === keyword ? (
                    <CheckCircle className="h-3 w-3 text-green-600" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              ))}
            </div>
            {missingKeywords.length > 10 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAll(!showAll)}
                className="mt-3"
              >
                {showAll ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-1" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1" />
                    Show {missingKeywords.length - 10} More
                  </>
                )}
              </Button>
            )}
          </div>
        )}

        {/* Matched Keywords */}
        {matchedKeywords.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Matched Keywords ({matchedKeywords.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {matchedKeywords.slice(0, 15).map((keyword, index) => (
                <Badge key={index} variant="success">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
