import pdf from "pdf-parse";
import { cleanText } from "@/lib/utils/text-processing";

export interface ParsedPDF {
  text: string;
  pages: number;
  info?: {
    title?: string;
    author?: string;
    creator?: string;
    producer?: string;
    creationDate?: Date;
    modificationDate?: Date;
  };
}

/**
 * Parse PDF file and extract clean text
 */
export async function parsePDF(buffer: Buffer): Promise<ParsedPDF> {
  try {
    const data = await pdf(buffer, {
      // Options for better text extraction
      normalizeWhitespace: true,
      disableCombineTextItems: false,
    });

    // Clean and normalize the extracted text
    const cleanedText = cleanText(data.text);

    return {
      text: cleanedText,
      pages: data.numpages,
      info: {
        title: data.info?.Title,
        author: data.info?.Author,
        creator: data.info?.Creator,
        producer: data.info?.Producer,
        creationDate: data.info?.CreationDate,
        modificationDate: data.info?.ModDate,
      },
    };
  } catch (error) {
    console.error("PDF parsing error:", error);
    throw new Error(
      "Failed to parse PDF file. Please ensure the file is not corrupted or password-protected."
    );
  }
}

/**
 * Validate PDF file before parsing
 */
export function validatePDFFile(file: File): {
  isValid: boolean;
  error?: string;
} {
  // Check file type
  if (
    file.type !== "application/pdf" &&
    !file.name.toLowerCase().endsWith(".pdf")
  ) {
    return { isValid: false, error: "File must be a PDF" };
  }

  // Check file size (5MB limit)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return { isValid: false, error: "PDF file must be smaller than 5MB" };
  }

  // Check if file is empty
  if (file.size === 0) {
    return { isValid: false, error: "PDF file cannot be empty" };
  }

  return { isValid: true };
}

/**
 * Extract metadata from PDF buffer
 */
export async function extractPDFMetadata(buffer: Buffer): Promise<any> {
  try {
    const data = await pdf(buffer, {
      pagerender: false, // Don't render pages, just get metadata
      max: 0, // Don't process any pages
    });

    return {
      pages: data.numpages,
      info: data.info,
      metadata: data.metadata,
      version: data.version,
    };
  } catch (error) {
    console.error("PDF metadata extraction error:", error);
    return null;
  }
}

/**
 * Check if PDF is likely a resume based on content
 */
export function isLikelyResume(text: string): boolean {
  const resumeKeywords = [
    "experience",
    "education",
    "skills",
    "resume",
    "cv",
    "curriculum",
    "employment",
    "work",
    "job",
    "career",
    "objective",
    "summary",
    "qualification",
    "achievement",
    "university",
    "college",
    "degree",
    "certification",
  ];

  const lowerText = text.toLowerCase();
  const matchCount = resumeKeywords.filter((keyword) =>
    lowerText.includes(keyword)
  ).length;

  // Consider it a resume if it contains at least 3 resume-related keywords
  return matchCount >= 3;
}

/**
 * Get PDF quality score based on text extraction
 */
export function getPDFQualityScore(parsedPDF: ParsedPDF): {
  score: number;
  issues: string[];
  recommendations: string[];
} {
  const issues: string[] = [];
  const recommendations: string[] = [];
  let score = 100;

  // Check text length
  if (parsedPDF.text.length < 500) {
    score -= 30;
    issues.push("Very short content detected");
    recommendations.push("Ensure your resume has sufficient content");
  }

  // Check for garbled text (high ratio of non-alphanumeric characters)
  const alphaNumericCount = (parsedPDF.text.match(/[a-zA-Z0-9]/g) || []).length;
  const totalCount = parsedPDF.text.length;
  const alphaNumericRatio = alphaNumericCount / totalCount;

  if (alphaNumericRatio < 0.7) {
    score -= 25;
    issues.push("Poor text extraction quality detected");
    recommendations.push(
      "Consider uploading a text-based PDF instead of a scanned image"
    );
  }

  // Check for excessive formatting characters
  const formattingChars = (parsedPDF.text.match(/[•◆●▪◇○▫►▷]/g) || []).length;
  if (formattingChars > 20) {
    score -= 15;
    issues.push("Heavy formatting detected");
    recommendations.push("Simplify formatting for better ATS compatibility");
  }

  // Check if it looks like a resume
  if (!isLikelyResume(parsedPDF.text)) {
    score -= 20;
    issues.push("Content may not be a resume");
    recommendations.push("Ensure the uploaded file is actually a resume");
  }

  return {
    score: Math.max(0, score),
    issues,
    recommendations,
  };
}
