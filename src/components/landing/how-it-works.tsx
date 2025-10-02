import { Upload, Brain, Download, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: Upload,
      title: "Upload Your Resume",
      description:
        "Simply drag and drop your resume (PDF or DOCX) or paste the job description you're targeting.",
      details: [
        "Supports PDF and DOCX formats",
        "Secure file processing",
        "No registration required",
      ],
      color: "from-blue-500 to-blue-600",
    },
    {
      number: "02",
      icon: Brain,
      title: "AI Analysis",
      description:
        "Our advanced AI analyzes your resume against ATS requirements and job-specific criteria.",
      details: [
        "ATS compatibility check",
        "Keyword optimization",
        "Industry-specific insights",
      ],
      color: "from-purple-500 to-purple-600",
    },
    {
      number: "03",
      icon: Download,
      title: "Get Optimized Resume",
      description:
        "Receive your improved resume with detailed suggestions and a comprehensive compatibility score.",
      details: [
        "Detailed improvement suggestions",
        "Score breakdown",
        "Download optimized version",
      ],
      color: "from-green-500 to-green-600",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <Badge
            variant="outline"
            className="mb-4 bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-800"
          >
            How It Works
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              3 Simple Steps
            </span>
            <span className="block">to Resume Success</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Transform your resume in minutes with our streamlined AI-powered
            process. No technical skills required.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-8 text-center">
                    {/* Step Number */}
                    <div className="text-6xl font-bold text-gray-100 dark:text-gray-800 mb-4 select-none">
                      {step.number}
                    </div>

                    {/* Icon */}
                    <div
                      className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${step.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="h-8 w-8 text-white" />
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                      {step.description}
                    </p>

                    {/* Details */}
                    <ul className="space-y-2 text-left">
                      {step.details.map((detail, detailIndex) => (
                        <li
                          key={detailIndex}
                          className="flex items-center space-x-3"
                        >
                          <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300 text-sm">
                            {detail}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Arrow for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <div className="w-8 h-8 bg-white dark:bg-gray-950 rounded-full flex items-center justify-center shadow-lg border border-gray-200 dark:border-gray-700">
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to optimize your resume?
            </h3>
            <p className="text-blue-100 mb-8 text-lg max-w-2xl mx-auto">
              Join thousands of job seekers who have successfully landed their
              dream jobs with HireKit.
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-gray-50 font-semibold px-8 py-4 h-auto text-lg"
              asChild
            >
              <Link href="/analyze" className="flex">
                Start Your Free Analysis
                <ArrowRight className="ml-2 h-5 w-5 mt-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
