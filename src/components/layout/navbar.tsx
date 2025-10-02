"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Zap, User, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white group-hover:scale-105 transition-transform duration-200">
              <Zap className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              HireKit
            </span>
          </Link>

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

          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <div className="flex items-center space-x-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-xl text-sm font-medium dark:bg-blue-900/20 dark:text-blue-400">
                  <CreditCard className="h-4 w-4" />
                  <span>{userCredits} credits</span>
                </div>
                <Link href="/dashboard">
                  <Button variant="outline">
                    <User className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Link href="/analyze">
                  <Button>Analyze Resume</Button>
                </Link>
              </>
            ) : (
              <>
                <Button variant="outline">Sign In</Button>
                <Link href="/analyze">
                  <Button variant="gradient">Get Started Free</Button>
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium px-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              {isLoggedIn ? (
                <>
                  <div className="flex items-center space-x-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-xl text-sm font-medium dark:bg-blue-900/20 dark:text-blue-400">
                    <CreditCard className="h-4 w-4" />
                    <span>{userCredits} credits remaining</span>
                  </div>
                  <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      <User className="h-4 w-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                  <Link href="/analyze" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full">Analyze Resume</Button>
                  </Link>
                </>
              ) : (
                <>
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                  <Link href="/analyze" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="gradient" className="w-full">
                      Get Started Free
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
