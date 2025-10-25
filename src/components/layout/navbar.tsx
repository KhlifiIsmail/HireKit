"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, CreditCard, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import logo from "public/logo.png";
import { supabase } from "@/lib/supabase/client";

export function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [credits, setCredits] = useState(10);
  const [loading, setLoading] = useState(true);

  // Fetch user and credits on mount
  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);

        if (user) {
          // Fetch credits from profiles table
          const { data: profile } = await supabase
            .from("profiles")
            .select("credits")
            .eq("id", user.id)
            .single();

          if (profile) {
            setCredits(profile.credits);
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        setCredits(10);
      } else {
        // Refetch credits when user logs in
        supabase
          .from("profiles")
          .select("credits")
          .eq("id", session.user.id)
          .single()
          .then(({ data }) => {
            if (data) setCredits(data.credits);
          });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCredits(10);
    router.push("/");
    router.refresh();
  };

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
            <Image
              src={logo}
              alt="HireKit Logo"
              className="h-14 w-36 rounded-2xl hover:scale-105 transition-all ease-in"
            />
          </Link>

          {/* Desktop Nav Items */}
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

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {!loading && (
              <>
                {user ? (
                  // Logged in state
                  <>
                    <div className="flex items-center space-x-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-xl text-sm font-medium dark:bg-blue-900/20 dark:text-blue-400">
                      <CreditCard className="h-4 w-4" />
                      <span>{credits} credits</span>
                    </div>
                    <Link href="/dashboard">
                      <Button variant="outline">
                        <User className="h-4 w-4 mr-2" />
                        Dashboard
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      onClick={handleSignOut}
                      className="text-gray-600 hover:text-red-600"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  // Logged out state
                  <>
                    <Link href="/signin">
                      <Button variant="outline">Sign In</Button>
                    </Link>
                    <Link href="/signup">
                      <Button variant="gradient">Get Started Free</Button>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
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

        {/* Mobile Menu */}
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

              {!loading && (
                <>
                  {user ? (
                    // Mobile - Logged in
                    <>
                      <div className="flex items-center space-x-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-xl text-sm font-medium dark:bg-blue-900/20 dark:text-blue-400">
                        <CreditCard className="h-4 w-4" />
                        <span>{credits} credits remaining</span>
                      </div>
                      <Link
                        href="/dashboard"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Button variant="outline" className="w-full">
                          <User className="h-4 w-4 mr-2" />
                          Dashboard
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          handleSignOut();
                          setIsMenuOpen(false);
                        }}
                        className="w-full text-red-600 hover:text-red-700"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    // Mobile - Logged out
                    <>
                      <Link href="/signin" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="outline" className="w-full">
                          Sign In
                        </Button>
                      </Link>
                      <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="gradient" className="w-full">
                          Get Started Free
                        </Button>
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
