"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Check, Zap, Mail, Sparkles, Crown } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

export default function PricingPage() {
  const [user, setUser] = useState<any>(null);
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("credits")
          .eq("id", user.id)
          .single();

        if (profile) {
          setCredits(profile.credits);
        }
      }
      setLoading(false);
    };

    getUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] pt-24 pb-16 px-4 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 text-sm font-medium">
              {user ? "Your Plan" : "Simple Pricing"}
            </span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent mb-4">
            {user
              ? "Manage Your Subscription"
              : "Start Free, Scale as You Grow"}
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            {user
              ? `You have ${credits} credits remaining`
              : "Get started with 10 free credits. Need more? We're building something special."}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Free Plan */}
          {user ? (
            /* Logged In - Current Plan */
            <Card className="relative bg-gradient-to-br from-slate-900 to-slate-800/50 border-blue-500/50 ring-2 ring-blue-500/50">
              <div className="absolute top-4 right-4 px-3 py-1 bg-blue-500 rounded-full">
                <span className="text-white text-xs font-semibold flex items-center gap-1">
                  <Crown className="w-3 h-3" />
                  Current Plan
                </span>
              </div>
              <CardHeader className="border-b border-slate-800 p-8">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Free Forever
                  </h3>
                  <p className="text-slate-400">Your active plan</p>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-white">$0</span>
                  <span className="text-slate-400">/month</span>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-slate-400 text-sm">
                          Credits Remaining
                        </span>
                        <p className="text-white font-bold text-3xl mt-1">
                          {credits}
                        </p>
                      </div>
                      <Zap className="w-12 h-12 text-blue-400" />
                    </div>
                  </div>

                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300">
                        AI-powered resume analysis
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300">
                        ATS compatibility check
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300">
                        Keyword optimization
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300">
                        Actionable suggestions
                      </span>
                    </li>
                  </ul>

                  <Link href="/dashboard">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white">
                      Go to Dashboard
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Logged Out */
            <Card className="relative bg-gradient-to-br from-slate-900 to-slate-800/50 border-slate-700/50">
              <CardHeader className="border-b border-slate-800 p-8">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Free Forever
                  </h3>
                  <p className="text-slate-400">
                    Perfect for trying out HireKit
                  </p>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-white">$0</span>
                  <span className="text-slate-400">/month</span>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300">
                      10 free credits on signup
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300">
                      AI-powered resume analysis
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300">
                      ATS compatibility check
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300">Keyword optimization</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300">
                      Actionable suggestions
                    </span>
                  </li>
                </ul>
                <Link href="/signup">
                  <Button className="w-full bg-slate-700 hover:bg-slate-600 text-white">
                    Get Started Free
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Premium Coming Soon - ALWAYS SHOW */}
          <Card className="relative bg-gradient-to-br from-blue-900/50 to-violet-900/50 border-blue-500/30 overflow-hidden">
            <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full">
              <span className="text-white text-xs font-semibold">
                Coming Soon
              </span>
            </div>
            <CardHeader className="border-b border-blue-800/30 p-8">
              <div className="mb-4">
                <h3 className="text-2xl font-bold text-white mb-2">Premium</h3>
                <p className="text-blue-200">For power users & job seekers</p>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-white">$9</span>
                <span className="text-blue-200">/month</span>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span className="text-blue-100">Unlimited analyses</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span className="text-blue-100">Priority AI processing</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span className="text-blue-100">Advanced analytics</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span className="text-blue-100">Cover letter generation</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span className="text-blue-100">
                    Interview prep suggestions
                  </span>
                </li>
              </ul>
              <Button
                disabled
                className="w-full bg-slate-700 text-slate-400 cursor-not-allowed"
              >
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Contact Section */}
        <Card className="bg-gradient-to-br from-slate-900 to-slate-800/50 border-slate-700/50">
          <CardContent className="p-12 text-center">
            <div className="inline-flex p-4 bg-blue-500/10 rounded-2xl mb-6">
              <Mail className="w-8 h-8 text-blue-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Need More Credits?
            </h2>
            <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
              We're currently building our payment system. In the meantime,
              contact our team for additional credits or enterprise solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:ismail.khliffi@gmail.com">
                <Button className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white px-8">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Us
                </Button>
              </a>
              {user ? (
                <Link href="/dashboard">
                  <Button
                    variant="outline"
                    className="border-slate-700 text-slate-300 hover:bg-slate-800"
                  >
                    Back to Dashboard
                  </Button>
                </Link>
              ) : (
                <Link href="/signup">
                  <Button
                    variant="outline"
                    className="border-slate-700 text-slate-300 hover:bg-slate-800"
                  >
                    Sign Up Free
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-white mb-8">
            Frequently Asked Questions
          </h3>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-6">
                <h4 className="text-lg font-semibold text-white mb-2">
                  How do credits work?
                </h4>
                <p className="text-slate-400">
                  Each resume analysis uses 1 credit. You get 10 free credits
                  when you sign up.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-6">
                <h4 className="text-lg font-semibold text-white mb-2">
                  When will premium launch?
                </h4>
                <p className="text-slate-400">
                  We're working hard on our premium tier! Contact us to be
                  notified when it launches.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-6">
                <h4 className="text-lg font-semibold text-white mb-2">
                  Can I get more free credits?
                </h4>
                <p className="text-slate-400">
                  Reach out to our team if you need additional credits. We're
                  happy to help genuine users!
                </p>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="p-6">
                <h4 className="text-lg font-semibold text-white mb-2">
                  Is my data secure?
                </h4>
                <p className="text-slate-400">
                  Yes! All data is encrypted and never shared. We take your
                  privacy seriously.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
