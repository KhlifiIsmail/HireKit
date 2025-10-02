"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Upload, Sparkles, TrendingUp, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  const [isHovered, setIsHovered] = useState(false);

  const stats = [
    { label: "Resumes Analyzed", value: "50K+" },
    { label: "Success Rate", value: "94%" },
    { label: "Average Score Boost", value: "+35%" },
  ];

  const features = [
    { icon: Upload, text: "Upload in seconds" },
    { icon: Sparkles, text: "AI-powered analysis" },
    { icon: TrendingUp, text: "Instant improvements" },
  ];

  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-purple-950/20">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="mb-8 flex justify-center">
            <Badge
              variant="outline"
              className="px-4 py-2 bg-white/80 backdrop-blur-sm border-blue-200 text-blue-700 dark:bg-gray-900/80 dark:border-blue-800 dark:text-blue-400"
            >
              <Star className="h-4 w-4 mr-2 fill-current" />
              #1 AI Resume Optimizer
            </Badge>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            <span className="block">Land Your</span>
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Dream Job
            </span>
            <span className="block">with AI</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Transform your resume in seconds with AI-powered optimization. Beat
            ATS systems, get more interviews, and land the job you deserve.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              size="lg"
              variant="gradient"
              className="text-lg px-8 py-4 h-auto  "
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              asChild
            >
              <Link href="/analyze" className="flex ">
                Start Free Analysis
                <ArrowRight
                  className={`ml-2 h-5 w-5 transition-transform duration-200 mt-1 ${
                    isHovered ? "translate-x-1" : ""
                  }`}
                />
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-4 h-auto bg-white/80 backdrop-blur-sm"
              asChild
            >
              <Link href="/#demo">Watch Demo</Link>
            </Button>
          </div>

          {/* Quick Features */}
          <div className="flex flex-wrap justify-center gap-6 mb-16">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-gray-200/50 dark:bg-gray-800/60 dark:border-gray-700/50"
                >
                  <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    {feature.text}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:bg-gray-800/60 dark:border-gray-700/50"
              >
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent dark:from-gray-950" />
    </section>
  );
}
