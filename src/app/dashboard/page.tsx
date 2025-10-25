"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sparkles,
  FileText,
  TrendingUp,
  Clock,
  ArrowRight,
  Zap,
  User,
  LogOut,
  Plus,
  Target,
  Award,
  BarChart3,
} from "lucide-react";

interface Analysis {
  id: string;
  created_at: string;
  overall_score: number;
  ats_score: number;
  keyword_score: number;
  job_description: string;
}

interface Profile {
  full_name: string;
  email: string;
  credits: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/signin");
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("full_name, email, credits")
        .eq("id", user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      }

      const { data: analysesData } = await supabase
        .from("analyses")
        .select(
          "id, created_at, overall_score, ats_score, keyword_score, job_description"
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (analysesData) {
        setAnalyses(analysesData);
      }

      setLoading(false);
    };

    checkAuth();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-amber-400";
    return "text-rose-400";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-emerald-500/10 border-emerald-500/30";
    if (score >= 60) return "bg-amber-500/10 border-amber-500/30";
    return "bg-rose-500/10 border-rose-500/30";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          <div className="text-slate-400 text-sm">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent mb-2">
              Welcome back, {profile?.full_name?.split(" ")[0] || "User"}
            </h1>
            <p className="text-slate-400">
              Transform your resume into an interview magnet
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative flex items-center gap-3 px-5 py-3 bg-slate-900 rounded-xl border border-slate-800">
                <Zap className="w-5 h-5 text-blue-400" />
                <div>
                  <div className="text-2xl font-bold text-white">
                    {profile?.credits || 0}
                  </div>
                  <div className="text-xs text-slate-400">credits left</div>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <Card className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800/50 border-slate-700/50 hover:border-blue-500/30 transition-all group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-500/10 rounded-xl">
                  <FileText className="w-6 h-6 text-blue-400" />
                </div>
                <BarChart3 className="w-4 h-4 text-slate-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white mb-1">
                  {analyses.length}
                </p>
                <p className="text-slate-400 text-sm">Total Analyses</p>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800/50 border-slate-700/50 hover:border-emerald-500/30 transition-all group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-emerald-500/10 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-emerald-400" />
                </div>
                <BarChart3 className="w-4 h-4 text-slate-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white mb-1">
                  {analyses.length > 0
                    ? Math.round(
                        analyses.reduce((acc, a) => acc + a.overall_score, 0) /
                          analyses.length
                      )
                    : 0}
                </p>
                <p className="text-slate-400 text-sm">Average Score</p>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800/50 border-slate-700/50 hover:border-violet-500/30 transition-all group">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-violet-500/10 rounded-xl">
                  <Award className="w-6 h-6 text-violet-400" />
                </div>
                <BarChart3 className="w-4 h-4 text-slate-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white mb-1">
                  {analyses.filter((a) => a.overall_score >= 80).length}
                </p>
                <p className="text-slate-400 text-sm">High Scores</p>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800/50 border-slate-700/50 hover:border-amber-500/30 transition-all group">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-amber-500/10 rounded-xl">
                  <Sparkles className="w-6 h-6 text-amber-400" />
                </div>
                <BarChart3 className="w-4 h-4 text-slate-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white mb-1">
                  {profile?.credits || 0}
                </p>
                <p className="text-slate-400 text-sm">Credits Remaining</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <Link href="/analyze">
            <div className="relative group cursor-pointer h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-violet-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
              <Card className="relative bg-gradient-to-r from-blue-600 to-violet-600 border-0 h-full">
                <CardContent className="p-8">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        Analyze New Resume
                      </h3>
                      <p className="text-blue-100 mb-4">
                        Upload your resume and get AI-powered insights in
                        seconds
                      </p>
                      <div className="flex items-center gap-2 text-white/80 text-sm">
                        <Sparkles className="w-4 h-4" />
                        <span>1 credit per analysis</span>
                      </div>
                    </div>
                    <div className="p-4 bg-white/20 backdrop-blur-sm rounded-xl group-hover:scale-110 transition-transform">
                      <Plus className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Link>

          <Link href="/pricing">
            <div className="relative group cursor-pointer h-full">
              <div className="absolute inset-0 bg-slate-700/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity" />
              <Card className="relative bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700/50 hover:border-slate-600 transition-all h-full">
                <CardContent className="p-8">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        Get More Credits
                      </h3>
                      <p className="text-slate-400 mb-4">
                        Contact our team for additional credits or check out
                        upcoming premium plans
                      </p>
                      <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <Zap className="w-4 h-4" />
                        <span>Payment system coming soon</span>
                      </div>
                    </div>
                    <div className="p-4 bg-slate-700/30 rounded-xl group-hover:scale-110 transition-transform">
                      <Sparkles className="w-8 h-8 text-slate-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Link>
        </div>

        {/* Recent Analyses */}
        <Card className="bg-gradient-to-br from-slate-900 to-slate-800/50 border-slate-700/50">
          <CardHeader className="border-b border-slate-800 px-6 py-5">
            <CardTitle className="text-xl text-white flex items-center gap-3">
              <Clock className="w-5 h-5 text-blue-400" />
              Recent Analyses
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {analyses.length === 0 ? (
              <div className="text-center py-20">
                <div className="inline-flex p-6 bg-slate-800/50 rounded-2xl mb-6">
                  <Target className="w-12 h-12 text-slate-600" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  No analyses yet
                </h3>
                <p className="text-slate-400 mb-6 max-w-md mx-auto">
                  Start by uploading your first resume to get AI-powered
                  insights and recommendations
                </p>
                <Link href="/analyze">
                  <Button className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white px-6 py-3">
                    <Plus className="w-4 h-4 mr-2" />
                    Analyze Your First Resume
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-800">
                {analyses.map((analysis) => (
                  <Link
                    key={analysis.id}
                    href={`/results/${analysis.id}`}
                    className="block hover:bg-slate-800/30 transition-colors group"
                  >
                    <div className="p-6 flex items-center justify-between gap-6">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3">
                          <span
                            className={`px-3 py-1 rounded-lg text-sm font-bold border ${getScoreBg(
                              analysis.overall_score
                            )} ${getScoreColor(analysis.overall_score)}`}
                          >
                            {analysis.overall_score} / 100
                          </span>
                          <span className="text-slate-500 text-sm">
                            {formatDate(analysis.created_at)}
                          </span>
                        </div>
                        <p className="text-white font-medium mb-1">
                          Resume Analysis
                        </p>
                        {analysis.job_description && (
                          <p className="text-slate-400 text-sm truncate max-w-2xl">
                            {analysis.job_description.slice(0, 100)}...
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-slate-500 text-xs mb-1">ATS</p>
                          <p
                            className={`text-lg font-bold ${getScoreColor(
                              analysis.ats_score
                            )}`}
                          >
                            {analysis.ats_score}%
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-slate-500 text-xs mb-1">
                            Keywords
                          </p>
                          <p
                            className={`text-lg font-bold ${getScoreColor(
                              analysis.keyword_score
                            )}`}
                          >
                            {analysis.keyword_score}%
                          </p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Profile Card */}
        <Card className="bg-gradient-to-br from-slate-900 to-slate-800/50 border-slate-700/50 mt-6">
          <CardHeader className="border-b border-slate-800 px-6 py-5">
            <CardTitle className="text-xl text-white flex items-center gap-3">
              <User className="w-5 h-5 text-violet-400" />
              Account Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-slate-400 text-sm mb-2 block">
                  Full Name
                </label>
                <p className="text-white font-medium">{profile?.full_name}</p>
              </div>
              <div>
                <label className="text-slate-400 text-sm mb-2 block">
                  Email Address
                </label>
                <p className="text-white font-medium">{profile?.email}</p>
              </div>
            </div>
            <div className="pt-6 border-t border-slate-800 mt-6">
              <Button
                onClick={handleSignOut}
                variant="outline"
                className="text-rose-400 border-rose-400/20 hover:bg-rose-400/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
