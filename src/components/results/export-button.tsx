"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Download,
  Copy,
  Check,
  FileText,
  Share2,
  Mail,
  Printer,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface ExportButtonProps {
  resumeText: string;
  filename?: string;
  className?: string;
}

export function ExportButton({
  resumeText = "",
  filename = "improved-resume",
  className,
}: ExportButtonProps) {
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Handle undefined or empty resumeText
  if (!resumeText || resumeText.trim() === "") {
    return null;
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(resumeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const downloadAsText = () => {
    const blob = new Blob([resumeText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAsPDF = async () => {
    setIsExporting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("PDF generation coming soon! For now, please download as TXT.");
    } catch (error) {
      console.error("PDF export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const shareResume = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Optimized Resume",
          text: resumeText,
        });
      } catch (err) {
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const emailResume = () => {
    const subject = encodeURIComponent("My Optimized Resume");
    const body = encodeURIComponent(resumeText);
    const mailtoLink = `mailto:?subject=${subject}&body=${body}`;
    window.open(mailtoLink);
  };

  const printResume = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Resume</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                line-height: 1.6; 
                margin: 40px; 
                max-width: 800px;
                color: #333;
              }
              pre {
                white-space: pre-wrap;
                font-family: inherit;
              }
            </style>
          </head>
          <body>
            <pre>${resumeText}</pre>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const wordCount = resumeText.split(/\s+/).filter(Boolean).length;

  return (
    <Card className={cn("border-0 shadow-lg", className)}>
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Export Your Optimized Resume
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Download or share your improved resume
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <Button
            variant="outline"
            onClick={copyToClipboard}
            className="h-auto py-4 flex-col space-y-2"
          >
            {copied ? (
              <Check className="h-6 w-6 text-green-600" />
            ) : (
              <Copy className="h-6 w-6" />
            )}
            <span className="text-sm font-medium">
              {copied ? "Copied!" : "Copy Text"}
            </span>
          </Button>

          <Button
            variant="outline"
            onClick={downloadAsText}
            className="h-auto py-4 flex-col space-y-2"
          >
            <FileText className="h-6 w-6" />
            <span className="text-sm font-medium">Download TXT</span>
          </Button>

          <Button
            variant="default"
            onClick={downloadAsPDF}
            disabled={isExporting}
            className="h-auto py-4 flex-col space-y-2 bg-gradient-to-r from-blue-600 to-purple-600"
          >
            <Download className="h-6 w-6" />
            <span className="text-sm font-medium">
              {isExporting ? "Generating..." : "Download PDF"}
            </span>
          </Button>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex justify-center space-x-2">
            <Button variant="ghost" size="sm" onClick={shareResume}>
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
            <Button variant="ghost" size="sm" onClick={emailResume}>
              <Mail className="h-4 w-4 mr-1" />
              Email
            </Button>
            <Button variant="ghost" size="sm" onClick={printResume}>
              <Printer className="h-4 w-4 mr-1" />
              Print
            </Button>
          </div>
        </div>

        <div className="mt-4 text-center">
          <div className="text-xs text-gray-500 dark:text-gray-400 space-x-4">
            <span>Words: {wordCount}</span>
            <span>•</span>
            <span>Characters: {resumeText.length}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
