"use client";

import { useState, useCallback } from "react";
import { validateFile, getFileInfo } from "@/lib/parsers/";

export interface UploadedFileData {
  text: string;
  filename: string;
  fileType: string;
  fileSize: number;
  quality: {
    score: number;
    issues: string[];
    recommendations: string[];
  };
  wordCount: number;
  characterCount: number;
}

export interface UseFileUploadReturn {
  uploadFile: (file: File) => Promise<UploadedFileData>;
  isUploading: boolean;
  error: string | null;
  clearError: () => void;
  validateFileClient: (file: File) => { isValid: boolean; error?: string };
}

export function useFileUpload(): UseFileUploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const validateFileClient = useCallback((file: File) => {
    return validateFile(file);
  }, []);

  const uploadFile = useCallback(
    async (file: File): Promise<UploadedFileData> => {
      setIsUploading(true);
      setError(null);

      try {
        // Client-side validation first
        const validation = validateFile(file);
        if (!validation.isValid) {
          throw new Error(validation.error);
        }

        // Create form data
        const formData = new FormData();
        formData.append("file", file);

        // Upload file
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Upload failed");
        }

        if (!result.success) {
          throw new Error(result.error || "Upload failed");
        }

        return result.data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Upload failed";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsUploading(false);
      }
    },
    []
  );

  return {
    uploadFile,
    isUploading,
    error,
    clearError,
    validateFileClient,
  };
}
