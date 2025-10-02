"use client";

import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Target, Sparkles, Wand2, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function JobDescriptionInput({
  value,
  onChange,
  disabled = false,
  className,
}: JobDescriptionInputProps) {
  const [wordCount, setWordCount] = useState(0);
  const [keywordCount, setKeywordCount] = useState(0);

  // Example job descriptions for quick start
  const exampleJobs = [
    {
      title: "Software Engineer",
      company: "Tech Startup",
      snippet:
        "We're looking for a passionate Software Engineer to join our growing team. You'll work with React, Node.js, and cloud technologies to build scalable applications...",
    },
    {
      title: "Product Manager",
      company: "SaaS Company",
      snippet:
        "Seeking an experienced Product Manager to drive our product strategy. You'll collaborate with engineering, design, and marketing teams to deliver exceptional user experiences...",
    },
    {
      title: "Data Scientist",
      company: "AI Company",
      snippet:
        "Join our data science team to build machine learning models and extract insights from large datasets. Experience with Python, TensorFlow, and SQL required...",
    },
  ];

  useEffect(() => {
    const words = value
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    setWordCount(words.length);

    // Count potential keywords (words longer than 3 characters)
    const keywords = words.filter((word) => word.length > 3);
    setKeywordCount(keywords.length);
  }, [value]);

  const handleExampleClick = (snippet: string) => {
    onChange(snippet);
  };

  const handleClear = () => {
    onChange("");
  };

  const isEmpty = value.trim().length === 0;
  const isOptimal = wordCount >= 50 && wordCount <= 500;

  return (
    <div className={cn("w-full space-y-4", className)}>
      <Card className="border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-lg">
              <Target className="h-5 w-5 mr-2 text-blue-600" />
              Job Description
              <Badge variant="secondary" className="ml-2 text-xs">
                Optional
              </Badge>
            </CardTitle>

            {!isEmpty && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                disabled={disabled}
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400">
            Paste the job description you're applying for to get personalized
            optimization suggestions.
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Textarea */}
          <Textarea
            placeholder="Paste the job description here to get targeted keyword optimization and role-specific suggestions..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className="min-h-[150px] resize-none"
            variant="outline"
          />

          {/* Stats */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <span className="text-gray-600 dark:text-gray-400">
                {wordCount} words
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                ~{keywordCount} keywords
              </span>
            </div>

            {!isEmpty && (
              <Badge
                variant={isOptimal ? "success" : "warning"}
                className="text-xs"
              >
                {isOptimal
                  ? "Optimal length"
                  : wordCount < 50
                  ? "Too short"
                  : "Very long"}
              </Badge>
            )}
          </div>

          {/* Enhancement Notice */}
          {!isEmpty && (
            <div className="flex items-center space-x-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <Sparkles className="h-4 w-4 text-blue-600 flex-shrink-0" />
              <p className="text-xs text-blue-700 dark:text-blue-400">
                Your resume will be optimized specifically for this job
                description with targeted keyword matching.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Examples */}
      {isEmpty && (
        <Card className="bg-gray-50 dark:bg-gray-900/50">
          <CardContent className="p-4">
            <div className="flex items-center mb-3">
              <Wand2 className="h-4 w-4 mr-2 text-purple-600" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Quick Start Examples
              </span>
            </div>

            <div className="space-y-2">
              {exampleJobs.map((job, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(job.snippet)}
                  disabled={disabled}
                  className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-white dark:hover:bg-gray-800 transition-colors group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm text-gray-900 dark:text-white group-hover:text-blue-600">
                      {job.title}
                    </span>
                    <span className="text-xs text-gray-500">{job.company}</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                    {job.snippet}
                  </p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
