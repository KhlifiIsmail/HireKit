/**
 * Clean and normalize text extracted from documents
 */
export function cleanText(text: string): string {
  return text
    .replace(/\s+/g, " ") // Replace multiple spaces with single space
    .replace(/\n+/g, "\n") // Replace multiple newlines with single newline
    .replace(/[^\w\s\n.,!?;:()\-@]/g, "") // Remove special characters except common punctuation
    .trim();
}

/**
 * Extract keywords from text
 */
export function extractKeywords(text: string): string[] {
  const commonWords = new Set([
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "with",
    "by",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "being",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "will",
    "would",
    "could",
    "should",
    "may",
    "might",
    "must",
    "can",
    "this",
    "that",
    "these",
    "those",
  ]);

  return text
    .toLowerCase()
    .split(/\W+/)
    .filter((word) => word.length > 2 && !commonWords.has(word))
    .filter((word, index, array) => array.indexOf(word) === index); // Remove duplicates
}

/**
 * Calculate keyword match percentage between resume and job description
 */
export function calculateKeywordMatch(
  resumeText: string,
  jobDescription: string
): number {
  const resumeKeywords = new Set(extractKeywords(resumeText));
  const jobKeywords = extractKeywords(jobDescription);

  if (jobKeywords.length === 0) return 0;

  const matches = jobKeywords.filter((keyword) => resumeKeywords.has(keyword));
  return Math.round((matches.length / jobKeywords.length) * 100);
}

/**
 * Find missing keywords from job description
 */
export function findMissingKeywords(
  resumeText: string,
  jobDescription: string
): string[] {
  const resumeKeywords = new Set(extractKeywords(resumeText));
  const jobKeywords = extractKeywords(jobDescription);

  return jobKeywords.filter((keyword) => !resumeKeywords.has(keyword));
}

/**
 * Format file size in human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
