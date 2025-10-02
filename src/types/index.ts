// Core Analysis Types
export interface AnalysisResult {
  id: string;
  userId: string | null;
  resumeText: string;
  jobDescription: string | null;
  overallScore: number;
  atsScore: number;
  keywordScore: number;
  formattingScore: number;
  missingKeywords: string[];
  matchedKeywords: string[];
  suggestions: Suggestion[];
  atsIssues: string[];
  improvedText: string;
  createdAt: string;
}

export interface Suggestion {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  category: string;
  example?: string;
}

// File Upload Types
export interface UploadedFile {
  name: string;
  size: number;
  type: string;
  content: string | ArrayBuffer;
}

export interface ParsedFile {
  text: string;
  metadata?: {
    title?: string;
    author?: string;
    pageCount?: number;
  };
  quality?: {
    score: number;
    issues: string[];
    recommendations: string[];
  };
}

// User Types
export interface User {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  credits: number;
  createdAt: string;
  updatedAt: string;
}

// Analysis History Types
export interface AnalysisHistoryItem {
  id: string;
  userId: string;
  filename: string;
  jobTitle?: string;
  overallScore: number;
  createdAt: string;
  status: "completed" | "failed" | "processing";
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AnalysisResponse extends ApiResponse<AnalysisResult> {}

// Component Props Types
export interface ScoreCardProps {
  score: number;
  label: string;
  description?: string;
  className?: string;
}

export interface SuggestionCardProps {
  suggestion: Suggestion;
  onExpand?: () => void;
}

// Form Types
export interface AnalyzeFormData {
  resumeFile: File | null;
  jobDescription: string;
}

// Error Types
export interface AnalysisError {
  code: string;
  message: string;
  details?: any;
}
