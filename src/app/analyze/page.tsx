"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileUpload } from "@/components/analyze/file-upload";
import { JobDescriptionInput } from "@/components/analyze/job-description-input";
import { AnalyzingLoader } from "@/components/analyze/analyzing-loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAnalysis } from "@/lib/hooks/use-analysis";
import { ArrowRight, Zap, Shield, Clock } from "lucide-react";

interface UploadedFile {
  text: string;
  filename: string;
  fileType: string;
  fileSize: number;
  quality: any;
  wordCount: number;
  characterCount: number;
}

export default function AnalyzePage() {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [showLoader, setShowLoader] = useState(false);

  const { analyzeResume, isAnalyzing, error } = useAnalysis();
  const router = useRouter();

  const handleFileUploaded = (fileData: UploadedFile) => {
    setUploadedFile(fileData);
  };

  const handleAnalyze = async () => {
    if (!uploadedFile) return;

    try {
      setShowLoader(true);

      const result = await analyzeResume(
        uploadedFile.text,
        jobDescription || undefined,
        uploadedFile.filename
      );

      // Navigate to results page
      if (result.id) {
        router.push(`/results/${result.id}`);
      } else {
        // For anonymous users, pass data via sessionStorage
        sessionStorage.setItem("analysisResult", JSON.stringify(result));
        router.push("/results/anonymous");
      }
    } catch (err) {
      setShowLoader(false);
      console.error("Analysis failed:", err);
    }
  };

  if (showLoader) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center p-4">
        <AnalyzingLoader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge
            variant="outline"
            className="mb-4 bg-blue-50 text-blue-700 border-blue-200"
          >
            AI-Powered Analysis
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Optimize Your
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Resume for Success
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Get instant AI-powered feedback, ATS compatibility scores, and
            personalized suggestions to land more interviews.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Upload */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1 - File Upload */}
            <Card className="border-2 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                    1
                  </span>
                  Upload Your Resume
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FileUpload onFileUploaded={handleFileUploaded} />

                {uploadedFile && (
                  <div className="mt-4 p-4 bg-green-50 dark:bg-green-950/20 rounded-xl border border-green-200 dark:border-green-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-green-800 dark:text-green-400">
                          {uploadedFile.filename}
                        </p>
                        <p className="text-sm text-green-600 dark:text-green-500">
                          {uploadedFile.wordCount} words • Quality Score:{" "}
                          {uploadedFile.quality.score}%
                        </p>
                      </div>
                      <Badge variant="success">Uploaded</Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Step 2 - Job Description */}
            <Card
              className={
                uploadedFile
                  ? "border-2 border-purple-200 dark:border-purple-800"
                  : "border border-gray-200 dark:border-gray-700 opacity-50"
              }
            >
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3 ${
                      uploadedFile
                        ? "bg-purple-600 text-white"
                        : "bg-gray-400 text-white"
                    }`}
                  >
                    2
                  </span>
                  Job Description (Optional)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <JobDescriptionInput
                  value={jobDescription}
                  onChange={setJobDescription}
                  disabled={!uploadedFile}
                />
              </CardContent>
            </Card>

            {/* Analyze Button */}
            {uploadedFile && (
              <div className="text-center">
                <Button
                  size="lg"
                  variant="gradient"
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="px-8 py-4 text-lg font-semibold"
                >
                  {isAnalyzing ? "Analyzing..." : "Analyze Resume"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>

                {error && (
                  <p className="mt-4 text-red-600 dark:text-red-400">{error}</p>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Features */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white border-0">
              <CardContent className="p-6">
                <Zap className="h-8 w-8 mb-4" />
                <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
                <p className="text-blue-100">
                  Get comprehensive analysis results in under 30 seconds with
                  our optimized AI processing.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Shield className="h-8 w-8 text-green-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">Secure & Private</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Your resume data is processed securely and never stored or
                  shared with third parties.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Clock className="h-8 w-8 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">Instant Results</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Receive detailed analysis with ATS scores, keyword matching,
                  and actionable improvement suggestions.
                </p>
              </CardContent>
            </Card>

            {/* What You'll Get */}
            <Card className="bg-gray-50 dark:bg-gray-900/50">
              <CardHeader>
                <CardTitle className="text-lg">What You'll Get</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full" />
                  <span className="text-sm">Overall compatibility score</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full" />
                  <span className="text-sm">ATS system compatibility</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full" />
                  <span className="text-sm">Keyword match analysis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full" />
                  <span className="text-sm">Personalized suggestions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full" />
                  <span className="text-sm">Improved resume version</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
