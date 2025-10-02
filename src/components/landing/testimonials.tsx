import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer",
      company: "Google",
      avatar: "SC",
      rating: 5,
      text: "HireKit transformed my resume and helped me land my dream job at Google. The AI suggestions were spot-on and the ATS optimization was exactly what I needed.",
      result: "Landed job at Google",
      color: "from-blue-500 to-blue-600",
    },
    {
      name: "Marcus Rodriguez",
      role: "Product Manager",
      company: "Meta",
      avatar: "MR",
      rating: 5,
      text: "I went from getting zero responses to having multiple interviews lined up within two weeks. The keyword optimization made all the difference.",
      result: "5x more interviews",
      color: "from-green-500 to-green-600",
    },
    {
      name: "Emily Johnson",
      role: "Data Scientist",
      company: "Microsoft",
      avatar: "EJ",
      rating: 5,
      text: "The detailed analysis helped me understand exactly what recruiters were looking for. My resume score went from 45% to 92% compatibility.",
      result: "92% ATS compatibility",
      color: "from-purple-500 to-purple-600",
    },
    {
      name: "David Kim",
      role: "UX Designer",
      company: "Apple",
      avatar: "DK",
      rating: 5,
      text: "As a career changer, I struggled to highlight transferable skills. HireKit helped me reframe my experience perfectly for design roles.",
      result: "Successful career change",
      color: "from-orange-500 to-orange-600",
    },
    {
      name: "Lisa Thompson",
      role: "Marketing Director",
      company: "Spotify",
      avatar: "LT",
      rating: 5,
      text: "The before and after comparison was incredible. I could see exactly how my resume improved and why it would perform better.",
      result: "Director-level promotion",
      color: "from-pink-500 to-pink-600",
    },
    {
      name: "Alex Chen",
      role: "DevOps Engineer",
      company: "Netflix",
      avatar: "AC",
      rating: 5,
      text: "Lightning fast analysis and incredibly detailed feedback. The job-specific optimization feature is a game-changer for targeting specific roles.",
      result: "Doubled salary offer",
      color: "from-cyan-500 to-cyan-600",
    },
  ];

  const stats = [
    { value: "94%", label: "Success Rate" },
    { value: "50K+", label: "Resumes Optimized" },
    { value: "4.9/5", label: "User Rating" },
  ];

  return (
    <section className="py-24 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <Badge
            variant="outline"
            className="mb-4 bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-800"
          >
            Success Stories
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Loved by
            <span className="block bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              job seekers worldwide
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            See how HireKit has helped thousands of professionals land their
            dream jobs with optimized, ATS-friendly resumes.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
              variant="elevated"
            >
              <CardContent className="p-6">
                {/* Quote Icon */}
                <div className="absolute top-4 right-4 opacity-10">
                  <Quote className="h-12 w-12 text-gray-400" />
                </div>

                {/* Rating */}
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 text-yellow-400 fill-current"
                    />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  "{testimonial.text}"
                </p>

                {/* Result Badge */}
                <div className="mb-6">
                  <Badge
                    variant="outline"
                    className={`bg-gradient-to-r ${testimonial.color} text-white border-0`}
                  >
                    {testimonial.result}
                  </Badge>
                </div>

                {/* Author */}
                <div className="flex items-center">
                  <div
                    className={`w-12 h-12 rounded-full bg-gradient-to-r ${testimonial.color} flex items-center justify-center text-white font-bold mr-4`}
                  >
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Join thousands of successful job seekers
          </p>
          <div className="flex justify-center items-center space-x-2">
            <div className="flex -space-x-2">
              {testimonials.slice(0, 4).map((testimonial, index) => (
                <div
                  key={index}
                  className={`w-10 h-10 rounded-full bg-gradient-to-r ${testimonial.color} flex items-center justify-center text-white text-sm font-bold border-2 border-white dark:border-gray-950`}
                >
                  {testimonial.avatar}
                </div>
              ))}
            </div>
            <span className="text-gray-600 dark:text-gray-400 ml-4">
              and 50,000+ others
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
