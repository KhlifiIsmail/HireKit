"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Shield,
  CheckCircle,
  AlertTriangle,
  XCircle,
  FileText,
  Search,
  Users,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface ATSCompatibilityProps {
  atsScore: number;
  weaknesses?: string[];
  strengths?: string[];
  className?: string;
}

export function ATSCompatibility({
  atsScore,
  weaknesses = [],
  strengths = [],
  className,
}: ATSCompatibilityProps) {
  const getScoreConfig = (score: number) => {
    if (score >= 80) {
      return {
        color: "text-green-600",
        bgColor: "bg-green-50 dark:bg-green-950/20",
        borderColor: "border-green-200 dark:border-green-800",
        icon: CheckCircle,
        title: "Excellent ATS Compatibility",
        description: "Your resume will pass most ATS systems without issues.",
        variant: "success" as const,
      };
    } else if (score >= 60) {
      return {
        color: "text-yellow-600",
        bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
        borderColor: "border-yellow-200 dark:border-yellow-800",
        icon: AlertTriangle,
        title: "Good ATS Compatibility",
        description:
          "Your resume should pass most ATS systems with minor improvements.",
        variant: "warning" as const,
      };
    } else {
      return {
        color: "text-red-600",
        bgColor: "bg-red-50 dark:bg-red-950/20",
        borderColor: "border-red-200 dark:border-red-800",
        icon: XCircle,
        title: "ATS Compatibility Issues",
        description: "Your resume may be filtered out by ATS systems.",
        variant: "danger" as const,
      };
    }
  };

  const scoreConfig = getScoreConfig(atsScore);
  const ScoreIcon = scoreConfig.icon;

  const atsChecks = [
    {
      icon: FileText,
      title: "Format Compatibility",
      description: "Standard file format and structure",
      status: atsScore >= 70 ? "pass" : "fail",
    },
    {
      icon: Search,
      title: "Keyword Scanning",
      description: "Scannable text and keyword placement",
      status: atsScore >= 60 ? "pass" : "fail",
    },
    {
      icon: Users,
      title: "Section Recognition",
      description: "Standard section headers and organization",
      status: atsScore >= 65 ? "pass" : "fail",
    },
    {
      icon: TrendingUp,
      title: "Content Parsing",
      description: "Clean, parseable content structure",
      status: atsScore >= 55 ? "pass" : "fail",
    },
  ];

  const getCheckStatus = (status: string) => {
    if (status === "pass") {
      return {
        icon: CheckCircle,
        color: "text-green-600",
        bgColor: "bg-green-100 dark:bg-green-900/30",
      };
    } else {
      return {
        icon: XCircle,
        color: "text-red-600",
        bgColor: "bg-red-100 dark:bg-red-900/30",
      };
    }
  };

  return (
    <Card className={cn("border-0 shadow-lg", className)}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="h-6 w-6 mr-2 text-blue-600" />
          ATS Compatibility
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Score Display */}
        <div className="text-center">
          <div className={cn("text-4xl font-bold mb-2", scoreConfig.color)}>
            {atsScore}%
          </div>
          <Badge variant={scoreConfig.variant} className="mb-4">
            {scoreConfig.title}
          </Badge>
          <Progress
            value={atsScore}
            variant={scoreConfig.variant}
            className="max-w-xs mx-auto mb-4"
            animated
          />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {scoreConfig.description}
          </p>
        </div>

        {/* ATS Checks */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
            ATS System Checks
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {atsChecks.map((check, index) => {
              const CheckIcon = check.icon;
              const statusConfig = getCheckStatus(check.status);
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={index}
                  className={cn(
                    "p-4 rounded-lg border",
                    statusConfig.bgColor,
                    check.status === "pass"
                      ? "border-green-200 dark:border-green-800"
                      : "border-red-200 dark:border-red-800"
                  )}
                >
                  <div className="flex items-start space-x-3">
                    <CheckIcon className="h-5 w-5 text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h5 className="font-medium text-gray-900 dark:text-white text-sm">
                          {check.title}
                        </h5>
                        <StatusIcon
                          className={cn("h-4 w-4", statusConfig.color)}
                        />
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {check.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weaknesses */}
        {weaknesses.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-red-800 dark:text-red-400 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2" />
              ATS Issues Found
            </h4>
            <div className="space-y-2">
              {weaknesses.map((weakness, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800"
                >
                  <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-red-800 dark:text-red-300">
                    {weakness}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Strengths */}
        {strengths.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-green-800 dark:text-green-400 flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              ATS Strengths
            </h4>
            <div className="space-y-2">
              {strengths
                .filter(
                  (strength) =>
                    strength.toLowerCase().includes("ats") ||
                    strength.toLowerCase().includes("format") ||
                    strength.toLowerCase().includes("compatible")
                )
                .map((strength, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800"
                  >
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-green-800 dark:text-green-300">
                      {strength}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ATS Tips */}
        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-800">
          <h4 className="font-semibold text-blue-800 dark:text-blue-400 mb-2">
            💡 ATS Optimization Tips
          </h4>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>
              • Use standard section headers (Experience, Education, Skills)
            </li>
            <li>• Avoid images, tables, and complex formatting</li>
            <li>• Include relevant keywords naturally in your content</li>
            <li>• Use standard fonts and clear, simple layouts</li>
            <li>• Save as PDF or Word document (.docx)</li>
          </ul>
        </div>

        {/* What ATS Systems Look For */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <FileText className="h-8 w-8 text-gray-600 mx-auto mb-2" />
            <h5 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
              Clear Structure
            </h5>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Standard sections and hierarchy
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Search className="h-8 w-8 text-gray-600 mx-auto mb-2" />
            <h5 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
              Keywords
            </h5>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Job-relevant terms and skills
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Shield className="h-8 w-8 text-gray-600 mx-auto mb-2" />
            <h5 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
              Format
            </h5>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Simple, scannable layout
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
