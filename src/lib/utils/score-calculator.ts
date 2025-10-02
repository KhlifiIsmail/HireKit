/**
 * Calculate overall resume score based on multiple factors
 */
export function calculateOverallScore(
  keywordMatchScore: number,
  atsScore: number,
  contentScore: number = 75 // Default content quality score
): number {
  // Weighted average: keywords (40%), ATS (35%), content (25%)
  const weights = {
    keywords: 0.4,
    ats: 0.35,
    content: 0.25,
  };

  const weightedScore =
    keywordMatchScore * weights.keywords +
    atsScore * weights.ats +
    contentScore * weights.content;

  return Math.round(Math.max(0, Math.min(100, weightedScore)));
}

/**
 * Calculate ATS compatibility score
 */
export function calculateATSScore(resumeText: string): number {
  let score = 100;

  // Check for common ATS issues
  const issues = [
    // Headers and sections
    {
      check: !hasStandardSections(resumeText),
      penalty: 15,
      reason: "Missing standard sections",
    },

    // Formatting issues
    {
      check: hasSpecialCharacters(resumeText),
      penalty: 10,
      reason: "Special characters detected",
    },
    {
      check: hasTables(resumeText),
      penalty: 20,
      reason: "Tables may not parse correctly",
    },

    // Length issues
    { check: resumeText.length < 500, penalty: 25, reason: "Resume too short" },
    { check: resumeText.length > 8000, penalty: 15, reason: "Resume too long" },

    // Contact info
    {
      check: !hasContactInfo(resumeText),
      penalty: 20,
      reason: "Missing contact information",
    },
  ];

  issues.forEach((issue) => {
    if (issue.check) {
      score -= issue.penalty;
    }
  });

  return Math.max(0, Math.min(100, score));
}

/**
 * Check if resume has standard sections
 */
function hasStandardSections(text: string): boolean {
  const sections = [
    "experience",
    "education",
    "skills",
    "summary",
    "objective",
  ];
  const lowerText = text.toLowerCase();

  return sections.some((section) => lowerText.includes(section));
}

/**
 * Check for problematic special characters
 */
function hasSpecialCharacters(text: string): boolean {
  // Check for graphics, symbols, or non-standard characters
  const problematicChars = /[◆●▪◇○▫►▷⊳⊲]/;
  return problematicChars.test(text);
}

/**
 * Detect table-like structures
 */
function hasTables(text: string): boolean {
  // Simple heuristic: multiple tabs or pipe characters in a line
  const lines = text.split("\n");
  return lines.some(
    (line) =>
      (line.match(/\t/g) || []).length > 2 ||
      (line.match(/\|/g) || []).length > 2
  );
}

/**
 * Check for contact information
 */
function hasContactInfo(text: string): boolean {
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;

  return emailRegex.test(text) || phoneRegex.test(text);
}

/**
 * Get score color based on value
 */
export function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-yellow-600";
  if (score >= 40) return "text-orange-600";
  return "text-red-600";
}

/**
 * Get score description
 */
export function getScoreDescription(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 80) return "Very Good";
  if (score >= 70) return "Good";
  if (score >= 60) return "Fair";
  if (score >= 40) return "Needs Improvement";
  return "Poor";
}
