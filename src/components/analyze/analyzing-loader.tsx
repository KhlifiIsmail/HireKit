"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  FileSearch,
  Target,
  Sparkles,
  CheckCircle,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface AnalyzingLoaderProps {
  className?: string;
}

export function AnalyzingLoader({ className }: AnalyzingLoaderProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = [
    {
      icon: FileSearch,
      title: "Parsing Resume",
      description: "Extracting and cleaning text content",
      duration: 2000,
    },
    {
      icon: Target,
      title: "ATS Analysis",
      description: "Checking compatibility with tracking systems",
      duration: 3000,
    },
    {
      icon: Brain,
      title: "AI Processing",
      description: "Generating personalized suggestions",
      duration: 4000,
    },
    {
      icon: Sparkles,
      title: "Optimization",
      description: "Creating improved version",
      duration: 2000,
    },
  ];

  useEffect(() => {
    let timeouts: NodeJS.Timeout[] = [];
    let totalDuration = 0;

    steps.forEach((step, index) => {
      const timeout = setTimeout(() => {
        setCurrentStep(index);
      }, totalDuration);

      timeouts.push(timeout);
      totalDuration += step.duration;
    });

    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, totalDuration / 100);

    return () => {
      timeouts.forEach(clearTimeout);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className={cn("w-full max-w-2xl mx-auto", className)}>
      <Card className="relative overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 animate-pulse" />

        <CardContent className="p-8 relative">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center mb-4 animate-pulse">
              <Zap className="h-8 w-8 text-white" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Analyzing Your Resume
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Our AI is working its magic to optimize your resume
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <Progress
              value={progress}
              className="h-3 mb-2"
              variant="gradient"
              animated
            />
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>{progress}% Complete</span>
              <span>
                ~{Math.max(0, Math.ceil((100 - progress) * 0.15))}s remaining
              </span>
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              const isPending = index > currentStep;

              return (
                <div
                  key={index}
                  className={cn(
                    "flex items-center space-x-4 p-4 rounded-xl transition-all duration-500",
                    isActive && "bg-blue-100 dark:bg-blue-900/20 scale-105",
                    isCompleted && "bg-green-100 dark:bg-green-900/20",
                    isPending && "bg-gray-100 dark:bg-gray-800/50"
                  )}
                >
                  {/* Icon */}
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300",
                      isActive &&
                        "bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse",
                      isCompleted && "bg-green-600",
                      isPending && "bg-gray-400"
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-6 w-6 text-white" />
                    ) : (
                      <Icon
                        className={cn(
                          "h-6 w-6 text-white",
                          isActive && "animate-bounce"
                        )}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3
                        className={cn(
                          "font-semibold transition-colors",
                          isActive && "text-blue-700 dark:text-blue-400",
                          isCompleted && "text-green-700 dark:text-green-400",
                          isPending && "text-gray-600 dark:text-gray-400"
                        )}
                      >
                        {step.title}
                      </h3>

                      {isActive && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                        >
                          Processing
                        </Badge>
                      )}

                      {isCompleted && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-green-50 text-green-700 border-green-200"
                        >
                          Complete
                        </Badge>
                      )}
                    </div>

                    <p
                      className={cn(
                        "text-sm transition-colors",
                        isActive && "text-blue-600 dark:text-blue-400",
                        isCompleted && "text-green-600 dark:text-green-400",
                        isPending && "text-gray-500 dark:text-gray-500"
                      )}
                    >
                      {step.description}
                    </p>
                  </div>

                  {/* Loading indicator for active step */}
                  {isActive && (
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Fun Facts */}
          <div className="mt-8 p-4 bg-white/80 dark:bg-gray-800/80 rounded-xl backdrop-blur-sm">
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Did you know?
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Over 94% of large companies use ATS systems to filter resumes. Our
              optimization ensures your resume gets past these filters.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
