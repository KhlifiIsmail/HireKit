import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

// Server-side Supabase client for server components and API routes
export const createServerSupabaseClient = () => {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
};

// Service role client for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Server-side auth helpers
export const serverAuth = {
  getUser: async () => {
    const supabase = createServerSupabaseClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    return { user, error };
  },

  getSession: async () => {
    const supabase = createServerSupabaseClient();
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    return { session, error };
  },

  requireAuth: async () => {
    const { user, error } = await serverAuth.getUser();
    if (error || !user) {
      throw new Error("Authentication required");
    }
    return user;
  },
};

// Admin database operations
export const adminDb = {
  // Create user profile (called from auth webhook)
  createProfile: async (user: any) => {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .insert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name,
        credits: parseInt(process.env.FREE_CREDITS_PER_USER || "5"),
      })
      .select()
      .single();
    return { data, error };
  },

  // Deduct credits (admin operation)
  deductCredits: async (userId: string, amount: number = 1) => {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .update({
        credits: supabaseAdmin.rpc("decrement_credits", {
          user_id: userId,
          amount,
        }),
      })
      .eq("id", userId)
      .select()
      .single();
    return { data, error };
  },

  // Get user with admin privileges
  getUser: async (userId: string) => {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    return { data, error };
  },
};
