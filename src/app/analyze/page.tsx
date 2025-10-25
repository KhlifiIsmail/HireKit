"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileUpload } from "@/components/analyze/file-upload";
import { JobDescriptionInput } from "@/components/analyze/job-description-input";
import { AnalyzingLoader } from "@/components/analyze/analyzing-loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, ArrowRight, CheckCircle } from "lucide-react";

export default function AnalyzePage() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError("Please upload a resume first");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // Step 1: Upload and parse file
      const formData = new FormData();
      formData.append("file", selectedFile);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadResult = await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(uploadResult.error || "Failed to upload file");
      }

      const resumeText = uploadResult.data.text;

      // Step 2: Analyze resume with AI
      const analyzeResponse = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeText,
          jobDescription: jobDescription || undefined,
        }),
      });

      const analyzeResult = await analyzeResponse.json();

      if (!analyzeResponse.ok) {
        throw new Error(analyzeResult.error || "Failed to analyze resume");
      }

      // Save to sessionStorage for anonymous users
      sessionStorage.setItem("analysisResult", JSON.stringify(analyzeResult));

      // Redirect to results page with real DB ID
      if (analyzeResult.id) {
        router.push(`/results/${analyzeResult.id}`);
      } else {
        router.push("/results/anonymous");
      }
    } catch (err) {
      console.error("Analysis error:", err);
      setError(err instanceof Error ? err.message : "Failed to analyze resume");
      setIsAnalyzing(false);
    }
  };

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-12 px-4 pt-28">
        <AnalyzingLoader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-12 pt-28 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Analyze Your Resume
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Upload your resume and let our AI provide instant feedback and
            optimization suggestions
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Step 1: Upload Resume */}
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                  1
                </span>
                Upload Your Resume
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FileUpload
                onFileSelect={setSelectedFile}
                onFileRemove={() => setSelectedFile(null)}
              />
            </CardContent>
          </Card>

          {/* Step 2: Job Description (Optional) */}
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">
                  2
                </span>
                Add Job Description (Optional)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <JobDescriptionInput
                value={jobDescription}
                onChange={setJobDescription}
              />
            </CardContent>
          </Card>

          {/* Error Display */}
          {error && (
            <Card className="border-2 border-red-500 bg-red-50 dark:bg-red-950/20">
              <CardContent className="p-6">
                <p className="text-red-600 dark:text-red-400">{error}</p>
              </CardContent>
            </Card>
          )}

          {/* Analyze Button */}
          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={handleAnalyze}
              disabled={!selectedFile || isAnalyzing}
              className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isAnalyzing ? (
                "Analyzing..."
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  Analyze Resume
                  <ArrowRight className="h-5 w-5 ml-2" />
                </>
              )}
            </Button>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 pt-8">
            {[
              {
                icon: CheckCircle,
                title: "ATS Compatible",
                description: "Optimized for applicant tracking systems",
              },
              {
                icon: Sparkles,
                title: "AI-Powered",
                description: "Smart suggestions from advanced AI",
              },
              {
                icon: ArrowRight,
                title: "Instant Results",
                description: "Get feedback in seconds",
              },
            ].map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg text-center p-6">
                <feature.icon className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
