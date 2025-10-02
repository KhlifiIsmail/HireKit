export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          avatar_url: string | null;
          credits: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          credits?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          credits?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      analyses: {
        Row: {
          id: string;
          user_id: string;
          resume_text: string;
          job_description: string | null;
          original_filename: string;
          overall_score: number | null;
          ats_score: number | null;
          keyword_match_score: number | null;
          suggestions: Json | null;
          missing_keywords: string[] | null;
          strengths: string[] | null;
          weaknesses: string[] | null;
          improved_resume_text: string | null;
          status: string;
          error_message: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          resume_text: string;
          job_description?: string | null;
          original_filename: string;
          overall_score?: number | null;
          ats_score?: number | null;
          keyword_match_score?: number | null;
          suggestions?: Json | null;
          missing_keywords?: string[] | null;
          strengths?: string[] | null;
          weaknesses?: string[] | null;
          improved_resume_text?: string | null;
          status?: string;
          error_message?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          resume_text?: string;
          job_description?: string | null;
          original_filename?: string;
          overall_score?: number | null;
          ats_score?: number | null;
          keyword_match_score?: number | null;
          suggestions?: Json | null;
          missing_keywords?: string[] | null;
          strengths?: string[] | null;
          weaknesses?: string[] | null;
          improved_resume_text?: string | null;
          status?: string;
          error_message?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Functions: {
      decrement_credits: {
        Args: {
          user_id: string;
          amount: number;
        };
        Returns: number;
      };
    };
  };
}
