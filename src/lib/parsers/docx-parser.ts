import mammoth from "mammoth";
import { cleanText } from "@/lib/utils/text-processing";

export interface ParsedDOCX {
  text: string;
  html?: string;
  messages?: any[];
  metadata?: {
    wordCount: number;
    characterCount: number;
    hasImages: boolean;
    hasTables: boolean;
  };
}

/**
 * Parse DOCX file and extract clean text
 */
export async function parseDOCX(buffer: Buffer): Promise<ParsedDOCX> {
  try {
    // Extract plain text
    const textResult = await mammoth.extractRawText({ buffer });

    // Extract HTML for structure analysis (optional)
    const htmlResult = await mammoth.convertToHtml({ buffer });

    // Clean and normalize the extracted text
    const cleanedText = cleanText(textResult.value);

    // Analyze content
    const metadata = analyzeDocxContent(cleanedText, htmlResult.value);

    return {
      text: cleanedText,
      html: htmlResult.value,
      messages: [...textResult.messages, ...htmlResult.messages],
      metadata,
    };
  } catch (error) {
    console.error("DOCX parsing error:", error);
    throw new Error(
      "Failed to parse DOCX file. Please ensure the file is not corrupted or password-protected."
    );
  }
}

/**
 * Validate DOCX file before parsing
 */
export function validateDOCXFile(file: File): {
  isValid: boolean;
  error?: string;
} {
  // Check file type
  const validTypes = [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
  ];

  const isValidType =
    validTypes.includes(file.type) ||
    file.name.toLowerCase().endsWith(".docx") ||
    file.name.toLowerCase().endsWith(".doc");

  if (!isValidType) {
    return {
      isValid: false,
      error: "File must be a Word document (.docx or .doc)",
    };
  }

  // Check file size (5MB limit)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return { isValid: false, error: "Word document must be smaller than 5MB" };
  }

  // Check if file is empty
  if (file.size === 0) {
    return { isValid: false, error: "Word document cannot be empty" };
  }

  return { isValid: true };
}

/**
 * Analyze DOCX content for metadata
 */
function analyzeDocxContent(
  text: string,
  html: string
): {
  wordCount: number;
  characterCount: number;
  hasImages: boolean;
  hasTables: boolean;
} {
  const words = text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);

  return {
    wordCount: words.length,
    characterCount: text.length,
    hasImages: html.includes("<img") || html.includes("image"),
    hasTables: html.includes("<table") || html.includes("<td"),
  };
}

/**
 * Extract formatting information from DOCX
 */
export async function extractDOCXFormatting(buffer: Buffer): Promise<{
  hasHeadings: boolean;
  hasBulletPoints: boolean;
  hasNumberedLists: boolean;
  hasHyperlinks: boolean;
  fontInfo: string[];
}> {
  try {
    const result = await mammoth.convertToHtml({ buffer });
    const html = result.value;

    return {
      hasHeadings: /h[1-6]/i.test(html),
      hasBulletPoints: html.includes("<ul>") || html.includes("•"),
      hasNumberedLists: html.includes("<ol>"),
      hasHyperlinks: html.includes("<a href"),
      fontInfo: extractFontInfo(html),
    };
  } catch (error) {
    console.error("DOCX formatting extraction error:", error);
    return {
      hasHeadings: false,
      hasBulletPoints: false,
      hasNumberedLists: false,
      hasHyperlinks: false,
      fontInfo: [],
    };
  }
}

/**
 * Extract font information from HTML
 */
function extractFontInfo(html: string): string[] {
  const fontInfo: string[] = [];

  // Look for font-family styles
  const fontFamilyRegex = /font-family:\s*([^;]+)/gi;
  let match;

  while ((match = fontFamilyRegex.exec(html)) !== null) {
    const fontFamily = match[1].replace(/['"]/g, "").trim();
    if (!fontInfo.includes(fontFamily)) {
      fontInfo.push(fontFamily);
    }
  }

  return fontInfo;
}

/**
 * Check if DOCX is likely a resume
 */
export function isLikelyResumeDocx(text: string, html: string): boolean {
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
  ];

  const lowerText = text.toLowerCase();
  const matchCount = resumeKeywords.filter((keyword) =>
    lowerText.includes(keyword)
  ).length;

  // Additional check for resume structure in HTML
  const hasStructure =
    html.includes("<h") || html.includes("<ul>") || html.includes("<ol>");

  return matchCount >= 3 && hasStructure;
}

/**
 * Get DOCX quality score
 */
export function getDOCXQualityScore(parsedDOCX: ParsedDOCX): {
  score: number;
  issues: string[];
  recommendations: string[];
} {
  const issues: string[] = [];
  const recommendations: string[] = [];
  let score = 100;

  if (!parsedDOCX.metadata) {
    return {
      score: 50,
      issues: ["Unable to analyze document"],
      recommendations: [],
    };
  }

  // Check word count
  if (parsedDOCX.metadata.wordCount < 100) {
    score -= 30;
    issues.push("Very short content detected");
    recommendations.push(
      "Ensure your resume has sufficient content (aim for 200+ words)"
    );
  }

  // Check for images (can cause ATS issues)
  if (parsedDOCX.metadata.hasImages) {
    score -= 10;
    issues.push("Images detected in document");
    recommendations.push("Remove images for better ATS compatibility");
  }

  // Check for tables (can cause parsing issues)
  if (parsedDOCX.metadata.hasTables) {
    score -= 15;
    issues.push("Tables detected in document");
    recommendations.push(
      "Convert tables to simple lists for better ATS parsing"
    );
  }

  // Check if it looks like a resume
  if (!isLikelyResumeDocx(parsedDOCX.text, parsedDOCX.html || "")) {
    score -= 20;
    issues.push("Content may not be a resume");
    recommendations.push("Ensure the uploaded file is actually a resume");
  }

  // Check for parsing messages/warnings
  if (parsedDOCX.messages && parsedDOCX.messages.length > 0) {
    const warningCount = parsedDOCX.messages.filter(
      (msg) => msg.type === "warning"
    ).length;
    if (warningCount > 5) {
      score -= 10;
      issues.push("Document contains complex formatting");
      recommendations.push("Simplify formatting for better compatibility");
    }
  }

  return {
    score: Math.max(0, score),
    issues,
    recommendations,
  };
}
