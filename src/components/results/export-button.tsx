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
  resumeText,
  filename = "improved-resume",
  className,
}: ExportButtonProps) {
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

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
      // This would typically call an API to generate PDF
      // For now, we'll simulate the process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In a real implementation, you'd use a PDF generation service
      // like Puppeteer, jsPDF, or a backend service
      alert(
        "PDF generation coming soon! For now, please copy the text and paste it into a document."
      );
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
        console.error("Sharing failed:", err);
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

  const exportActions = [
    {
      icon: Copy,
      label: copied ? "Copied!" : "Copy Text",
      action: copyToClipboard,
      variant: "outline" as const,
      success: copied,
    },
    {
      icon: FileText,
      label: "Download TXT",
      action: downloadAsText,
      variant: "outline" as const,
    },
    {
      icon: Download,
      label: isExporting ? "Generating..." : "Download PDF",
      action: downloadAsPDF,
      variant: "default" as const,
      disabled: isExporting,
      primary: true,
    },
  ];

  const shareActions = [
    {
      icon: Share2,
      label: "Share",
      action: shareResume,
      variant: "ghost" as const,
    },
    {
      icon: Mail,
      label: "Email",
      action: emailResume,
      variant: "ghost" as const,
    },
    {
      icon: Printer,
      label: "Print",
      action: printResume,
      variant: "ghost" as const,
    },
  ];

  return (
    <Card className={cn("border-0 shadow-lg", className)}>
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Export Your Optimized Resume
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Download or share your improved resume in multiple formats
          </p>
        </div>

        {/* Primary Export Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {exportActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                variant={action.variant}
                onClick={action.action}
                disabled={action.disabled}
                className={cn(
                  "h-auto py-4 flex-col space-y-2",
                  action.primary &&
                    "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700",
                  action.success &&
                    "border-green-500 text-green-600 dark:text-green-400"
                )}
              >
                <Icon
                  className={cn("h-6 w-6", action.success && "text-green-600")}
                />
                <span className="text-sm font-medium">{action.label}</span>
              </Button>
            );
          })}
        </div>

        {/* Secondary Share Actions */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex justify-center space-x-2">
            {shareActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  variant={action.variant}
                  size="sm"
                  onClick={action.action}
                  className="flex items-center space-x-1"
                >
                  <Icon className="h-4 w-4" />
                  <span>{action.label}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Export Tips */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 className="font-semibold text-blue-800 dark:text-blue-400 mb-2">
            💡 Export Tips
          </h4>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>
              • <strong>PDF:</strong> Best for job applications (preserves
              formatting)
            </li>
            <li>
              • <strong>Text:</strong> Easy to edit and customize further
            </li>
            <li>
              • <strong>Copy:</strong> Quick way to paste into online forms
            </li>
            <li>
              • <strong>Print:</strong> Physical copies for interviews
            </li>
          </ul>
        </div>

        {/* File Info */}
        <div className="mt-4 text-center">
          <div className="text-xs text-gray-500 dark:text-gray-400 space-x-4">
            <span>Word count: {resumeText.split(" ").length}</span>
            <span>•</span>
            <span>Characters: {resumeText.length}</span>
            <span>•</span>
            <span>Filename: {filename}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
