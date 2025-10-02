"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Lightbulb,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface Suggestion {
  id: string;
  type: "high" | "medium" | "low";
  category: string;
  title: string;
  description: string;
  example?: string;
}

interface SuggestionsListProps {
  suggestions: Suggestion[];
  className?: string;
}

export function SuggestionsList({
  suggestions,
  className,
}: SuggestionsListProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [selectedPriority, setSelectedPriority] = useState<
    "all" | "high" | "medium" | "low"
  >("all");

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const getPriorityConfig = (type: string) => {
    switch (type) {
      case "high":
        return {
          icon: AlertTriangle,
          color: "text-red-600",
          bgColor: "bg-red-50 dark:bg-red-950/20",
          borderColor: "border-red-200 dark:border-red-800",
          badge: "destructive",
        };
      case "medium":
        return {
          icon: AlertCircle,
          color: "text-yellow-600",
          bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
          borderColor: "border-yellow-200 dark:border-yellow-800",
          badge: "warning",
        };
      case "low":
        return {
          icon: Info,
          color: "text-blue-600",
          bgColor: "bg-blue-50 dark:bg-blue-950/20",
          borderColor: "border-blue-200 dark:border-blue-800",
          badge: "info",
        };
      default:
        return {
          icon: Info,
          color: "text-gray-600",
          bgColor: "bg-gray-50 dark:bg-gray-950/20",
          borderColor: "border-gray-200 dark:border-gray-800",
          badge: "secondary",
        };
    }
  };

  const filteredSuggestions =
    selectedPriority === "all"
      ? suggestions
      : suggestions.filter((s) => s.type === selectedPriority);

  const priorityCounts = {
    high: suggestions.filter((s) => s.type === "high").length,
    medium: suggestions.filter((s) => s.type === "medium").length,
    low: suggestions.filter((s) => s.type === "low").length,
  };

  if (suggestions.length === 0) {
    return (
      <Card className={cn("border-0 shadow-lg", className)}>
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Excellent Resume!
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Your resume looks great! No major improvements needed.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("border-0 shadow-lg", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Lightbulb className="h-6 w-6 mr-2 text-yellow-600" />
            Improvement Suggestions
          </CardTitle>
          <Badge variant="outline" className="text-sm">
            {suggestions.length} items
          </Badge>
        </div>

        {/* Priority Filter */}
        <div className="flex flex-wrap gap-2 pt-4">
          <Button
            variant={selectedPriority === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedPriority("all")}
          >
            All ({suggestions.length})
          </Button>
          {priorityCounts.high > 0 && (
            <Button
              variant={selectedPriority === "high" ? "destructive" : "outline"}
              size="sm"
              onClick={() => setSelectedPriority("high")}
            >
              High Priority ({priorityCounts.high})
            </Button>
          )}
          {priorityCounts.medium > 0 && (
            <Button
              variant={selectedPriority === "medium" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPriority("medium")}
              className={
                selectedPriority === "medium"
                  ? "bg-yellow-600 hover:bg-yellow-700"
                  : ""
              }
            >
              Medium ({priorityCounts.medium})
            </Button>
          )}
          {priorityCounts.low > 0 && (
            <Button
              variant={selectedPriority === "low" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPriority("low")}
              className={
                selectedPriority === "low"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : ""
              }
            >
              Low ({priorityCounts.low})
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {filteredSuggestions.map((suggestion, index) => {
          const config = getPriorityConfig(suggestion.type);
          const Icon = config.icon;
          const isExpanded = expandedItems.has(suggestion.id);

          return (
            <div
              key={suggestion.id}
              className={cn(
                "rounded-xl border p-4 transition-all duration-200 hover:shadow-md",
                config.borderColor,
                config.bgColor
              )}
            >
              <div
                className="flex items-start space-x-3 cursor-pointer"
                onClick={() => toggleExpanded(suggestion.id)}
              >
                {/* Priority Icon */}
                <div
                  className={cn(
                    "p-2 rounded-lg flex-shrink-0 mt-0.5",
                    suggestion.type === "high"
                      ? "bg-red-100 dark:bg-red-900/30"
                      : suggestion.type === "medium"
                      ? "bg-yellow-100 dark:bg-yellow-900/30"
                      : "bg-blue-100 dark:bg-blue-900/30"
                  )}
                >
                  <Icon className={cn("h-4 w-4", config.color)} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {suggestion.title}
                      </h4>
                      <Badge variant={config.badge as any} className="text-xs">
                        {suggestion.type}
                      </Badge>
                    </div>

                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-gray-500 flex-shrink-0" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-500 flex-shrink-0" />
                    )}
                  </div>

                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="h-3 w-3 text-gray-500" />
                    <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                      {suggestion.category}
                    </span>
                  </div>

                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {suggestion.description}
                  </p>

                  {/* Expanded Content */}
                  {isExpanded && suggestion.example && (
                    <div className="mt-4 p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg border border-gray-200/50 dark:border-gray-700/50">
                      <div className="flex items-start space-x-2">
                        <Lightbulb className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-gray-900 dark:text-white mb-1">
                            Example:
                          </p>
                          <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                            {suggestion.example}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filteredSuggestions.length === 0 && (
          <div className="text-center py-8">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-gray-600 dark:text-gray-400">
              No {selectedPriority} priority suggestions found.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
