import Link from "next/link";
import { Zap, Twitter, Github, Linkedin, Mail } from "lucide-react";

export function Footer() {
  const footerSections = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "/#features" },
        { label: "How it Works", href: "/#how-it-works" },
        { label: "Pricing", href: "/#pricing" },
        { label: "Examples", href: "/examples" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Blog", href: "/blog" },
        { label: "Careers", href: "/careers" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Help Center", href: "/help" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Cookie Policy", href: "/cookies" },
      ],
    },
  ];

  const socialLinks = [
    { icon: Twitter, href: "https://twitter.com/hirekit", label: "Twitter" },
    { icon: Github, href: "https://github.com/hirekit", label: "GitHub" },
    {
      icon: Linkedin,
      href: "https://linkedin.com/company/hirekit",
      label: "LinkedIn",
    },
    { icon: Mail, href: "mailto:hello@hirekit.ai", label: "Email" },
  ];

  return (
    <footer className="bg-gray-50 border-t border-gray-200 dark:bg-gray-900 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 group mb-4">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white group-hover:scale-105 transition-transform duration-200">
                <Zap className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                HireKit
              </span>
            </Link>

            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
              AI-powered resume optimization that helps you land your dream job.
              Get ATS-compatible resumes with personalized suggestions in
              seconds.
            </p>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 dark:hover:bg-blue-900/20"
                    aria-label={social.label}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-gray-900 dark:text-gray-50 mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-gray-600 hover:text-blue-600 transition-colors duration-200 dark:text-gray-400 dark:hover:text-blue-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-600 dark:text-gray-400 text-sm">
              © {new Date().getFullYear()} HireKit. All rights reserved.
            </div>

            <div className="flex items-center space-x-6 text-sm">
              <Link
                href="/privacy"
                className="text-gray-600 hover:text-blue-600 transition-colors duration-200 dark:text-gray-400 dark:hover:text-blue-400"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-gray-600 hover:text-blue-600 transition-colors duration-200 dark:text-gray-400 dark:hover:text-blue-400"
              >
                Terms
              </Link>
              <span className="text-gray-300 dark:text-gray-600">•</span>
              <span className="text-gray-600 dark:text-gray-400">
                Made with ❤️ for job seekers
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
