"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircularProgress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, Target, Zap } from "lucide-react";
import {
  getScoreColor,
  getScoreDescription,
} from "@/lib/utils/score-calculator";
import { cn } from "@/lib/utils/cn";

interface ScoreCardProps {
  overallScore: number;
  atsScore: number;
  keywordScore: number;
  className?: string;
}

export function ScoreCard({
  overallScore,
  atsScore,
  keywordScore,
  className,
}: ScoreCardProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  // Animate score on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(overallScore);
    }, 300);

    const detailsTimer = setTimeout(() => {
      setShowDetails(true);
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearTimeout(detailsTimer);
    };
  }, [overallScore]);

  const getScoreIcon = (score: number) => {
    if (score >= 80) return TrendingUp;
    if (score >= 60) return Minus;
    return TrendingDown;
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return "from-green-500 to-green-600";
    if (score >= 60) return "from-yellow-500 to-orange-500";
    return "from-red-500 to-red-600";
  };

  const ScoreIcon = getScoreIcon(overallScore);

  const scores = [
    {
      label: "ATS Compatible",
      value: atsScore,
      icon: Target,
      description: "Applicant Tracking System compatibility",
    },
    {
      label: "Keywords",
      value: keywordScore,
      icon: Zap,
      description: "Keyword match with job requirements",
    },
  ];

  return (
    <Card
      className={cn("relative overflow-hidden border-0 shadow-2xl", className)}
    >
      {/* Background gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${getScoreGradient(
          overallScore
        )} opacity-5`}
      />

      <CardHeader className="text-center pb-4">
        <CardTitle className="flex items-center justify-center space-x-2">
          <ScoreIcon
            className={cn(
              "h-6 w-6",
              overallScore >= 80
                ? "text-green-600"
                : overallScore >= 60
                ? "text-yellow-600"
                : "text-red-600"
            )}
          />
          <span>Resume Score</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="text-center space-y-8">
        {/* Main Score Circle */}
        <div className="relative">
          <CircularProgress
            value={animatedScore}
            size={200}
            strokeWidth={12}
            variant={
              overallScore >= 80
                ? "success"
                : overallScore >= 60
                ? "warning"
                : "danger"
            }
            showValue={true}
            className="mx-auto"
          />

          {/* Score Description */}
          <div className="mt-4">
            <Badge
              variant={
                overallScore >= 80
                  ? "success"
                  : overallScore >= 60
                  ? "warning"
                  : "destructive"
              }
              className="text-sm font-medium"
            >
              {getScoreDescription(overallScore)}
            </Badge>
          </div>
        </div>

        {/* Detailed Scores */}
        <div
          className={cn(
            "grid grid-cols-1 sm:grid-cols-2 gap-4 transition-all duration-700",
            showDetails
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          )}
        >
          {scores.map((score, index) => {
            const Icon = score.icon;
            return (
              <Card
                key={index}
                className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50"
              >
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Icon className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {score.label}
                    </span>
                  </div>

                  <div className="text-2xl font-bold mb-1">
                    <span className={getScoreColor(score.value)}>
                      {score.value}%
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {score.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Score Interpretation */}
        <div className="bg-blue-50 dark:bg-blue-950/20 rounded-xl p-4 text-left">
          <h4 className="font-semibold text-blue-900 dark:text-blue-400 mb-2">
            What this means:
          </h4>
          <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
            {overallScore >= 90 && (
              <>
                <li>• Excellent ATS compatibility</li>
                <li>• Strong keyword optimization</li>
                <li>• Ready for job applications</li>
              </>
            )}
            {overallScore >= 70 && overallScore < 90 && (
              <>
                <li>• Good foundation with room for improvement</li>
                <li>• Consider implementing suggested changes</li>
                <li>• Strong potential for better results</li>
              </>
            )}
            {overallScore >= 50 && overallScore < 70 && (
              <>
                <li>• Needs significant optimization</li>
                <li>• Focus on high-priority suggestions</li>
                <li>• May struggle with ATS systems</li>
              </>
            )}
            {overallScore < 50 && (
              <>
                <li>• Requires major improvements</li>
                <li>• High risk of being filtered out</li>
                <li>• Consider professional resume review</li>
              </>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
