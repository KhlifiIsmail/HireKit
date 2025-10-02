import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HireKit - AI-Powered Resume Optimization",
  description:
    "Transform your resume with AI-powered analysis. Get ATS-compatible resumes with personalized suggestions in seconds.",
  keywords: [
    "resume",
    "cv",
    "ats",
    "job search",
    "ai",
    "optimization",
    "career",
  ],
  authors: [{ name: "HireKit Team" }],
  creator: "HireKit",
  publisher: "HireKit",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  openGraph: {
    title: "HireKit - AI-Powered Resume Optimization",
    description:
      "Transform your resume with AI-powered analysis. Get ATS-compatible resumes with personalized suggestions in seconds.",
    url: "/",
    siteName: "HireKit",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "HireKit - AI-Powered Resume Optimization",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HireKit - AI-Powered Resume Optimization",
    description:
      "Transform your resume with AI-powered analysis. Get ATS-compatible resumes with personalized suggestions in seconds.",
    images: ["/images/og-image.png"],
    creator: "@hirekit",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col ">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
