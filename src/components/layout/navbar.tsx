"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Zap, User, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // TODO: Replace with actual auth state
  const isLoggedIn = false;
  const userCredits = 5;

  const navItems = [
    { href: "/#features", label: "Features" },
    { href: "/#how-it-works", label: "How it Works" },
    { href: "/#pricing", label: "Pricing" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50 dark:bg-gray-950/80 dark:border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white group-hover:scale-105 transition-transform duration-200">
              <Zap className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              HireKit
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                {/* Credits Display */}
                <div className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium dark:bg-blue-900/20 dark:text-blue-400">
                  <CreditCard className="h-4 w-4" />
                  <span>{userCredits} credits</span>
                </div>

                {/* Dashboard Link */}
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard">
                    <User className="h-4 w-4 mr-2" />
                    Dashboard
                  </Link>
                </Button>

                {/* Analyze Button */}
                <Button size="sm" asChild>
                  <Link href="/analyze">Analyze Resume</Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
                <Button size="sm" variant="gradient">
                  Get Started Free
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200/50 bg-white/95 backdrop-blur-md dark:bg-gray-950/95 dark:border-gray-800/50">
          <div className="px-4 py-4 space-y-4">
            {/* Mobile Nav Items */}
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            {/* Mobile Auth */}
            <div className="pt-4 border-t border-gray-200/50 space-y-3">
              {isLoggedIn ? (
                <>
                  <div className="flex items-center space-x-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-xl text-sm font-medium dark:bg-blue-900/20 dark:text-blue-400">
                    <CreditCard className="h-4 w-4" />
                    <span>{userCredits} credits remaining</span>
                  </div>

                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/dashboard">
                      <User className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                  </Button>

                  <Button className="w-full" asChild>
                    <Link href="/analyze">Analyze Resume</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                  <Button variant="gradient" className="w-full">
                    Get Started Free
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
