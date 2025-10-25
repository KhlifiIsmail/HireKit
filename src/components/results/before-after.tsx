"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ComingSoonModal } from "@/components/ui/coming-soon-modal";
import {
  ArrowRight,
  Copy,
  Check,
  FileText,
  Sparkles,
  TrendingUp,
  Eye,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface BeforeAfterProps {
  originalText: string;
  improvedText: string;
  originalScore: number;
  improvedScore: number;
  className?: string;
}

export function BeforeAfter({
  originalText,
  improvedText,
  originalScore,
  improvedScore,
  className,
}: BeforeAfterProps) {
  const [activeTab, setActiveTab] = useState<
    "side-by-side" | "original" | "improved"
  >("side-by-side");
  const [copiedSection, setCopiedSection] = useState<
    "original" | "improved" | null
  >(null);
  const [showModal, setShowModal] = useState(false);

  const copyToClipboard = async (
    text: string,
    section: "original" | "improved"
  ) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(section);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const scoreImprovement = improvedScore - originalScore;
  const improvementPercentage =
    originalScore > 0
      ? Math.round((scoreImprovement / originalScore) * 100)
      : 0;

  const tabs = [
    { id: "side-by-side", label: "Side by Side", icon: ArrowRight },
    { id: "original", label: "Original", icon: FileText },
    { id: "improved", label: "Improved", icon: Sparkles },
  ];

  return (
    <>
      <div className={cn("space-y-6", className)}>
        {/* Improvement Summary */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Resume Improvement Summary
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  See how AI optimization improved your resume
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2 mb-2">
                  <Badge
                    variant="outline"
                    className="bg-white dark:bg-gray-800"
                  >
                    {originalScore}%
                  </Badge>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                  <Badge variant="success" className="bg-green-600 text-white">
                    {improvedScore}%
                  </Badge>
                </div>
                <div className="flex items-center text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="font-semibold">
                    +{scoreImprovement} points{" "}
                    {improvementPercentage > 0 &&
                      `(+${improvementPercentage}%)`}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* View Toggle */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Eye className="h-6 w-6 mr-2 text-purple-600" />
                Resume Comparison
              </CardTitle>
              <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={cn(
                        "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        activeTab === tab.id
                          ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {/* Side by Side View */}
            {activeTab === "side-by-side" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Original */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-900 dark:text-white flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-gray-600" />
                      Original Resume
                    </h4>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{originalScore}%</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(originalText, "original")
                        }
                      >
                        {copiedSection === "original" ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 h-96 overflow-y-auto border border-gray-200 dark:border-gray-700">
                    <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans leading-relaxed">
                      {originalText}
                    </pre>
                  </div>
                </div>

                {/* Improved */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-900 dark:text-white flex items-center">
                      <Sparkles className="h-4 w-4 mr-2 text-purple-600" />
                      Improved Resume
                    </h4>
                    <div className="flex items-center space-x-2">
                      <Badge variant="success">{improvedScore}%</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(improvedText, "improved")
                        }
                      >
                        {copiedSection === "improved" ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-4 h-96 overflow-y-auto border border-green-200 dark:border-green-800">
                    <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans leading-relaxed">
                      {improvedText}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* Original Only View */}
            {activeTab === "original" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900 dark:text-white flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-gray-600" />
                    Original Resume
                  </h4>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{originalScore}%</Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(originalText, "original")}
                    >
                      {copiedSection === "original" ? (
                        <>
                          <Check className="h-4 w-4 mr-1 text-green-600" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 min-h-96 border border-gray-200 dark:border-gray-700">
                  <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans leading-relaxed">
                    {originalText}
                  </pre>
                </div>
              </div>
            )}

            {/* Improved Only View */}
            {activeTab === "improved" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900 dark:text-white flex items-center">
                    <Sparkles className="h-4 w-4 mr-2 text-purple-600" />
                    AI-Improved Resume
                  </h4>
                  <div className="flex items-center space-x-2">
                    <Badge variant="success">{improvedScore}%</Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(improvedText, "improved")}
                    >
                      {copiedSection === "improved" ? (
                        <>
                          <Check className="h-4 w-4 mr-1 text-green-600" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowModal(true)}
                      className="opacity-70 hover:opacity-100"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
                <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-6 min-h-96 border border-green-200 dark:border-green-800">
                  <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans leading-relaxed">
                    {improvedText}
                  </pre>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <Button
                variant="outline"
                onClick={() => copyToClipboard(improvedText, "improved")}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Improved Resume
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowModal(true)}
                className="opacity-70 hover:opacity-100"
              >
                <Download className="h-4 w-4 mr-2" />
                Download as PDF
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Key Improvements */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-6 w-6 mr-2 text-green-600" />
              Key Improvements Made
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  +{scoreImprovement}
                </div>
                <p className="text-sm text-green-800 dark:text-green-400">
                  Points Improved
                </p>
              </div>
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {Math.max(
                    0,
                    improvedText.split(" ").length -
                      originalText.split(" ").length
                  )}
                </div>
                <p className="text-sm text-blue-800 dark:text-blue-400">
                  Words Added
                </p>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {improvedScore}%
                </div>
                <p className="text-sm text-purple-800 dark:text-purple-400">
                  Final Score
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Coming Soon Modal */}
      <ComingSoonModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        feature="PDF Download"
      />
    </>
  );
}
