"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, CheckCircle, AlertCircle, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useFileUpload } from "@/lib/hooks/use-file-uplaod";
import { getSupportedFileTypes } from "@/lib/parsers";
import { cn } from "@/lib/utils/cn";

interface FileUploadProps {
  onFileUploaded: (data: any) => void;
  disabled?: boolean;
  className?: string;
}

export function FileUpload({
  onFileUploaded,
  disabled = false,
  className,
}: FileUploadProps) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const { uploadFile, isUploading, error, clearError } = useFileUpload();
  const supportedTypes = getSupportedFileTypes();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      clearError();

      try {
        // Simulate progress for better UX
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 100);

        const result = await uploadFile(file);

        // Complete progress
        clearInterval(progressInterval);
        setUploadProgress(100);

        // Call success callback
        setTimeout(() => {
          onFileUploaded(result);
          setUploadProgress(0);
        }, 500);
      } catch (err) {
        setUploadProgress(0);
        // Error is handled by the hook
      }
    },
    [uploadFile, onFileUploaded, clearError]
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections,
  } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "application/msword": [".doc"],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
    disabled: disabled || isUploading,
  });

  const hasError = error || fileRejections.length > 0;
  const rejectionError = fileRejections[0]?.errors[0]?.message;

  return (
    <div className={cn("w-full", className)}>
      <Card
        className={cn(
          "relative overflow-hidden transition-all duration-300 cursor-pointer group",
          isDragActive &&
            !isDragReject &&
            "border-blue-500 bg-blue-50 dark:bg-blue-950/20",
          isDragReject && "border-red-500 bg-red-50 dark:bg-red-950/20",
          hasError && "border-red-500",
          isUploading && "pointer-events-none",
          disabled && "opacity-50 pointer-events-none"
        )}
        {...getRootProps()}
      >
        <input {...getInputProps()} />

        <CardContent className="p-8 text-center">
          {/* Upload Progress */}
          {isUploading && (
            <div className="absolute inset-0 bg-white/90 dark:bg-gray-950/90 flex items-center justify-center z-10">
              <div className="w-full max-w-xs space-y-4">
                <div className="flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <Upload className="h-6 w-6 text-white animate-pulse" />
                  </div>
                </div>
                <Progress value={uploadProgress} className="w-full" animated />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Processing your resume...
                </p>
              </div>
            </div>
          )}

          {/* Upload Icon */}
          <div
            className={cn(
              "w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 flex items-center justify-center mb-6 transition-all duration-300",
              isDragActive &&
                "scale-110 from-blue-200 to-purple-200 dark:from-blue-800/30 dark:to-purple-800/30",
              hasError &&
                "from-red-100 to-red-200 dark:from-red-900/20 dark:to-red-800/20"
            )}
          >
            {hasError ? (
              <AlertCircle className="h-8 w-8 text-red-600" />
            ) : (
              <Upload
                className={cn(
                  "h-8 w-8 text-blue-600 transition-transform duration-300",
                  isDragActive && "scale-110"
                )}
              />
            )}
          </div>

          {/* Upload Text */}
          <div className="space-y-2 mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {isDragActive
                ? isDragReject
                  ? "File type not supported"
                  : "Drop your resume here"
                : hasError
                ? "Upload failed"
                : "Upload your resume"}
            </h3>

            <p className="text-gray-600 dark:text-gray-400">
              {isDragActive
                ? "Release to upload"
                : "Drag and drop your file here, or click to browse"}
            </p>
          </div>

          {/* Error Message */}
          {hasError && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-200 dark:border-red-800">
              <div className="flex items-center justify-between">
                <p className="text-red-700 dark:text-red-400 text-sm">
                  {error || rejectionError || "Upload failed"}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearError();
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Browse Button */}
          <Button
            variant="outline"
            className="mb-6 bg-white/80 backdrop-blur-sm hover:bg-gray-50"
            disabled={isUploading || disabled}
          >
            <FileText className="h-4 w-4 mr-2" />
            Browse Files
          </Button>

          {/* Supported Formats */}
          <div className="space-y-4">
            <div className="flex flex-wrap justify-center gap-2">
              {supportedTypes.extensions.map((ext) => (
                <Badge key={ext} variant="secondary" className="text-xs">
                  {ext}
                </Badge>
              ))}
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
              <p>Maximum file size: 5MB</p>
              <p>Supported formats: PDF, DOC, DOCX</p>
            </div>
          </div>

          {/* Features */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="space-y-2">
              <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Secure Processing
              </p>
            </div>
            <div className="space-y-2">
              <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
              <p className="text-xs text-gray-600 dark:text-gray-400">
                ATS Compatible
              </p>
            </div>
            <div className="space-y-2">
              <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Instant Results
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
