import { parsePDF, validatePDF, ParsedPDF } from "./pdf-parser";
import { parseDOCX, ParsedDOCX } from "./docx-parser";

export interface ParsedFile {
  text: string;
  metadata?: {
    title?: string;
    author?: string;
    pageCount?: number;
  };
}

/**
 * Universal file parser - handles PDF and DOCX files
 */
export async function parseFile(file: File): Promise<ParsedFile> {
  const fileType = getFileType(file);

  if (fileType === "pdf") {
    const validation = validatePDF(file);
    if (!validation.isValid) {
      throw new Error(validation.error || "Invalid PDF file");
    }

    const result = await parsePDF(file);
    return {
      text: result.text,
      metadata: {
        ...result.metadata,
        pageCount: result.numPages,
      },
    };
  }

  if (fileType === "docx") {
    const result = await parseDOCX(file);
    return {
      text: result.text,
      metadata: result.metadata,
    };
  }

  throw new Error(`Unsupported file type: ${file.type}`);
}

/**
 * Validate any supported file
 */
export function validateFile(file: File): {
  isValid: boolean;
  error?: string;
} {
  // Check file size (5MB max)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: "File size exceeds 5MB limit",
    };
  }

  // Check file type
  const fileType = getFileType(file);
  if (fileType === "unknown") {
    return {
      isValid: false,
      error: "Unsupported file type. Please upload PDF or DOCX files.",
    };
  }

  return { isValid: true };
}

/**
 * Get file type from file
 */
export function getFileType(file: File): "pdf" | "docx" | "unknown" {
  if (
    file.type === "application/pdf" ||
    file.name.toLowerCase().endsWith(".pdf")
  ) {
    return "pdf";
  }

  if (
    file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.type === "application/msword" ||
    file.name.toLowerCase().endsWith(".docx") ||
    file.name.toLowerCase().endsWith(".doc")
  ) {
    return "docx";
  }

  return "unknown";
}

/**
 * Format file size to human-readable string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

/**
 * Get supported file types for file input
 */
export function getSupportedFileTypes(): {
  accept: string;
  description: string;
  extensions: string[];
} {
  return {
    accept:
      ".pdf,.doc,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword",
    description: "PDF or Word documents",
    extensions: [".pdf", ".doc", ".docx"],
  };
}

/**
 * Check if file type is supported
 */
export function isSupportedFileType(file: File): boolean {
  const validation = validateFile(file);
  return validation.isValid;
}

/**
 * Get basic file info without parsing
 */
export function getFileInfo(file: File): {
  name: string;
  size: string;
  type: string;
  lastModified: Date;
  isSupported: boolean;
} {
  return {
    name: file.name,
    size: formatFileSize(file.size),
    type: getFileType(file),
    lastModified: new Date(file.lastModified),
    isSupported: isSupportedFileType(file),
  };
}

// Re-export types
export type { ParsedPDF, ParsedDOCX };
