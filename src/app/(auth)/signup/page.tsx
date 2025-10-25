"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase/client";
import { UserPlus, Mail, Lock, User, Sparkles, Check } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Password validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        // Redirect to dashboard
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
              <Sparkles className="w-8 h-8 text-purple-300" />
            </div>
          </div>
          <h2 className="text-4xl font-extrabold text-white mb-2">
            Create Your Account
          </h2>
          <p className="text-purple-200">
            Get 10 free resume analyses to start
          </p>
        </div>

        {/* Benefits */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
          <div className="space-y-3">
            {[
              "10 free resume analyses",
              "AI-powered optimization",
              "ATS compatibility check",
              "Export in multiple formats",
            ].map((benefit, i) => (
              <div
                key={i}
                className="flex items-center text-sm text-purple-200"
              >
                <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                {benefit}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
          <form onSubmit={handleSignUp} className="space-y-6">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* Full Name Input */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-purple-200 mb-2"
              >
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300" />
                <Input
                  id="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-11 bg-white/5 border-white/10 text-white placeholder:text-purple-300/50"
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-purple-200 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300" />
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11 bg-white/5 border-white/10 text-white placeholder:text-purple-300/50"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-purple-200 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300" />
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 bg-white/5 border-white/10 text-white placeholder:text-purple-300/50"
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>
              <p className="mt-2 text-xs text-purple-300/70">
                Must be at least 6 characters
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5 mr-2" />
                  Create Account
                </>
              )}
            </Button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-purple-200">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="font-semibold text-purple-300 hover:text-purple-200 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Terms */}
        <p className="text-center text-xs text-purple-300/70">
          By signing up, you agree to our{" "}
          <Link href="/terms" className="underline hover:text-purple-200">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline hover:text-purple-200">
            Privacy Policy
          </Link>
        </p>

        {/* Back to Home */}
        <div className="text-center">
          <Link
            href="/"
            className="text-sm text-purple-300 hover:text-purple-200 transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
