import {
  parsePDF,
  validatePDFFile,
  getPDFQualityScore,
  ParsedPDF,
} from "./pdf-parser";
import {
  parseDOCX,
  validateDOCXFile,
  getDOCXQualityScore,
  ParsedDOCX,
} from "./docx-parser";
import { formatFileSize } from "@/lib/utils/text-processing";

export interface ParsedFile {
  text: string;
  fileType: "pdf" | "docx";
  originalFilename: string;
  fileSize: number;
  quality: {
    score: number;
    issues: string[];
    recommendations: string[];
  };
  metadata?: any;
}

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
  fileType?: "pdf" | "docx";
}

/**
 * Validate uploaded file type and size
 */
export function validateFile(file: File): FileValidationResult {
  // Check if file exists
  if (!file) {
    return { isValid: false, error: "No file provided" };
  }

  // Determine file type
  let fileType: "pdf" | "docx" | undefined;

  if (
    file.type === "application/pdf" ||
    file.name.toLowerCase().endsWith(".pdf")
  ) {
    fileType = "pdf";
    return { ...validatePDFFile(file), fileType };
  }

  if (
    file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.type === "application/msword" ||
    file.name.toLowerCase().endsWith(".docx") ||
    file.name.toLowerCase().endsWith(".doc")
  ) {
    fileType = "docx";
    return { ...validateDOCXFile(file), fileType };
  }

  return {
    isValid: false,
    error:
      "Unsupported file type. Please upload a PDF or Word document (.pdf, .docx, .doc)",
  };
}

/**
 * Parse any supported file type
 */
export async function parseFile(file: File): Promise<ParsedFile> {
  // Validate file first
  const validation = validateFile(file);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  const fileType = validation.fileType!;
  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    let parsedData: any;
    let quality: { score: number; issues: string[]; recommendations: string[] };

    if (fileType === "pdf") {
      parsedData = await parsePDF(buffer);
      quality = getPDFQualityScore(parsedData);
    } else {
      parsedData = await parseDOCX(buffer);
      quality = getDOCXQualityScore(parsedData);
    }

    return {
      text: parsedData.text,
      fileType,
      originalFilename: file.name,
      fileSize: file.size,
      quality,
      metadata: {
        ...parsedData,
        fileSizeFormatted: formatFileSize(file.size),
        uploadedAt: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error(`Error parsing ${fileType.toUpperCase()}:`, error);
    throw new Error(
      `Failed to parse ${fileType.toUpperCase()} file: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
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
 * Extract basic info from file without full parsing
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

// Re-export specific parsers if needed
export { parsePDF, parseDOCX };
export type { ParsedPDF, ParsedDOCX };
