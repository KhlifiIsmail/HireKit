"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, File, X, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  className?: string;
}

export function FileUpload({
  onFileSelect,
  onFileRemove,
  className,
}: FileUploadProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      setError(null);

      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        if (rejection.errors[0]?.code === "file-too-large") {
          setError("File is too large. Maximum size is 5MB.");
        } else if (rejection.errors[0]?.code === "file-invalid-type") {
          setError("Invalid file type. Please upload PDF or DOCX files.");
        } else {
          setError("Failed to upload file. Please try again.");
        }
        return;
      }

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setUploadedFile(file);
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "application/msword": [".doc"],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false,
  });

  const handleRemove = () => {
    setUploadedFile(null);
    setError(null);
    onFileRemove();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className={cn("w-full", className)}>
      {!uploadedFile ? (
        <Card
          {...getRootProps()}
          className={cn(
            "relative overflow-hidden border-2 border-dashed transition-all duration-300 cursor-pointer",
            isDragActive
              ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20 scale-[1.02]"
              : "border-gray-300 dark:border-gray-700 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50",
            error && "border-red-500 bg-red-50 dark:bg-red-950/20"
          )}
        >
          <input {...getInputProps()} />
          <div className="p-12 text-center">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center mb-4">
              <Upload className="h-8 w-8 text-white" />
            </div>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {isDragActive ? "Drop your resume here" : "Upload Your Resume"}
            </h3>

            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Drag and drop your resume or click to browse
            </p>

            <div className="flex justify-center gap-2 text-sm text-gray-500">
              <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
                PDF
              </span>
              <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
                DOC
              </span>
              <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
                DOCX
              </span>
            </div>

            <p className="text-xs text-gray-500 mt-4">Maximum file size: 5MB</p>

            {error && (
              <div className="mt-4 p-3 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center gap-2 text-red-600 dark:text-red-400">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}
          </div>
        </Card>
      ) : (
        <Card className="p-6 border-2 border-green-500 bg-green-50 dark:bg-green-950/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-600 flex items-center justify-center">
                <File className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {uploadedFile.name}
                  </p>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {formatFileSize(uploadedFile.size)}
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleRemove}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Remove
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
