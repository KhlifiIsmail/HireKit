import Link from "next/link";
import { ArrowRight, CheckCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function CTA() {
  const benefits = [
    "Free forever - no credit card required",
    "Results in under 30 seconds",
    "ATS-optimized resume guaranteed",
    "Job-specific keyword matching",
    "Professional improvement suggestions",
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/10 to-pink-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-400/5 to-purple-400/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="flex items-center mb-6">
              <Sparkles className="h-6 w-6 text-yellow-400 mr-2" />
              <span className="text-yellow-400 font-semibold">
                Limited Time
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Transform Your Resume
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Get Your Dream Job
              </span>
            </h2>

            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Join thousands of successful job seekers who have optimized their
              resumes with HireKit. Start your career transformation today.
            </p>

            {/* Benefits List */}
            <ul className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <span className="text-blue-100 font-medium">{benefit}</span>
                </li>
              ))}
            </ul>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-white text-blue-900 hover:bg-gray-100 font-semibold px-8 py-4 h-auto text-lg shadow-xl"
                asChild
              >
                <Link href="/analyze" className="flex">
                  Start Free Analysis
                  <ArrowRight className="ml-2 h-5 w-5 mt-1" />
                </Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-8 flex items-center space-x-6 text-blue-200 text-sm">
              <div className="flex items-center space-x-1">
                <span className="font-semibold">50K+</span>
                <span>resumes optimized</span>
              </div>
              <div className="w-1 h-1 bg-blue-300 rounded-full" />
              <div className="flex items-center space-x-1">
                <span className="font-semibold">94%</span>
                <span>success rate</span>
              </div>
              <div className="w-1 h-1 bg-blue-300 rounded-full" />
              <div className="flex items-center space-x-1">
                <span className="font-semibold">4.9/5</span>
                <span>rating</span>
              </div>
            </div>
          </div>

          {/* Right Content - Feature Cards */}
          <div className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-3">⚡ Lightning Fast</h3>
                <p className="text-blue-100">
                  Get your optimized resume in under 30 seconds with our
                  advanced AI processing pipeline.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-3">🎯 Job-Specific</h3>
                <p className="text-blue-100">
                  Tailor your resume for any position with targeted keyword
                  analysis and industry insights.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-3">🔒 Privacy First</h3>
                <p className="text-blue-100">
                  Your resume data is processed securely and never stored or
                  shared with third parties.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="mt-20 text-center">
          <p className="text-blue-200 mb-6">
            Trusted by job seekers at top companies
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-white font-semibold text-lg">Google</div>
            <div className="w-1 h-1 bg-white rounded-full" />
            <div className="text-white font-semibold text-lg">Microsoft</div>
            <div className="w-1 h-1 bg-white rounded-full" />
            <div className="text-white font-semibold text-lg">Apple</div>
            <div className="w-1 h-1 bg-white rounded-full" />
            <div className="text-white font-semibold text-lg">Meta</div>
            <div className="w-1 h-1 bg-white rounded-full" />
            <div className="text-white font-semibold text-lg">Netflix</div>
          </div>
        </div>
      </div>
    </section>
  );
}
