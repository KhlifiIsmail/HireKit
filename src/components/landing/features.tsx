import {
  Brain,
  FileCheck,
  Target,
  Zap,
  BarChart3,
  Download,
  CheckCircle,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function Features() {
  const mainFeatures = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description:
        "Advanced machine learning algorithms analyze your resume against industry standards and job requirements.",
      color: "from-blue-500 to-blue-600",
      benefits: [
        "Smart keyword optimization",
        "Industry-specific insights",
        "Real-time suggestions",
      ],
    },
    {
      icon: FileCheck,
      title: "ATS Compatibility",
      description:
        "Ensure your resume passes Applicant Tracking Systems with our comprehensive ATS optimization.",
      color: "from-green-500 to-green-600",
      benefits: [
        "Format optimization",
        "Keyword density analysis",
        "95% ATS pass rate",
      ],
    },
    {
      icon: Target,
      title: "Job-Specific Matching",
      description:
        "Tailor your resume for specific positions with targeted keyword analysis and content suggestions.",
      color: "from-purple-500 to-purple-600",
      benefits: [
        "Job description analysis",
        "Missing keyword detection",
        "Role-specific optimization",
      ],
    },
  ];

  const additionalFeatures = [
    {
      icon: BarChart3,
      title: "Detailed Scoring",
      description:
        "Get comprehensive scores for overall quality, ATS compatibility, and keyword optimization.",
    },
    {
      icon: Download,
      title: "Export Options",
      description:
        "Download your optimized resume in multiple formats including PDF and DOCX.",
    },
    {
      icon: TrendingUp,
      title: "Performance Tracking",
      description:
        "Track your resume improvements over time and monitor success metrics.",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Get results in under 30 seconds with our optimized AI processing pipeline.",
    },
  ];

  return (
    <section id="features" className="py-24 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <Badge
            variant="outline"
            className="mb-4 bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-800"
          >
            Features
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Everything you need to
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ace your application
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Our AI-powered platform provides comprehensive resume optimization
            with features designed to maximize your job search success.
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {mainFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
                variant="elevated"
              >
                <CardHeader className="pb-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    {feature.description}
                  </p>
                  <ul className="space-y-3">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li
                        key={benefitIndex}
                        className="flex items-center space-x-3"
                      >
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                          {benefit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {additionalFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="text-center border border-gray-200 hover:border-blue-300 transition-all duration-300 group dark:border-gray-800 dark:hover:border-blue-700"
                hover
              >
                <CardContent className="pt-6">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
