import { createBrowserClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

// Client-side Supabase client for components
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Alternative direct client (if needed)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Helper functions for common operations
export const auth = {
  signUp: async (email: string, password: string, fullName?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    return { data, error };
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  getUser: async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    return { user, error };
  },

  getSession: async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    return { session, error };
  },
};

// Database helpers
export const db = {
  // Get user profile
  getProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    return { data, error };
  },

  // Update user profile
  updateProfile: async (userId: string, updates: any) => {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();
    return { data, error };
  },

  // Create analysis
  createAnalysis: async (analysis: any) => {
    const { data, error } = await supabase
      .from("analyses")
      .insert(analysis)
      .select()
      .single();
    return { data, error };
  },

  // Get user analyses
  getUserAnalyses: async (userId: string) => {
    const { data, error } = await supabase
      .from("analyses")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    return { data, error };
  },

  // Get analysis by ID
  getAnalysis: async (id: string) => {
    const { data, error } = await supabase
      .from("analyses")
      .select("*")
      .eq("id", id)
      .single();
    return { data, error };
  },

  // Update analysis
  updateAnalysis: async (id: string, updates: any) => {
    const { data, error } = await supabase
      .from("analyses")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  },
};
