"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, FileText, Copy, Check } from "lucide-react";
import { ComingSoonModal } from "@/components/ui/coming-soon-modal";

interface ExportButtonProps {
  resumeText: string;
  filename?: string;
}

export function ExportButton({
  resumeText,
  filename = "improved-resume",
}: ExportButtonProps) {
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(resumeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleDownloadPDF = () => {
    setShowModal(true);
  };

  return (
    <>
      <Card className="bg-gradient-to-br from-slate-900 to-slate-800/50 border-slate-700/50">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-white mb-2">
              Export Your Improved Resume
            </h3>
            <p className="text-slate-400">
              Download or copy your optimized resume
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Download PDF - Coming Soon */}
            <Button
              onClick={handleDownloadPDF}
              className="relative group h-auto py-6 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white border-0 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <div className="relative flex items-center justify-center gap-3">
                <Download className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-semibold">Download as PDF</div>
                  <div className="text-xs opacity-80">Professional format</div>
                </div>
              </div>
            </Button>

            {/* Copy Text */}
            <Button
              onClick={handleCopyText}
              variant="outline"
              className="h-auto py-6 border-slate-700 text-white hover:bg-slate-800 hover:border-slate-600"
            >
              <div className="flex items-center justify-center gap-3">
                {copied ? (
                  <Check className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
                <div className="text-left">
                  <div className="font-semibold">
                    {copied ? "Copied!" : "Copy Text"}
                  </div>
                  <div className="text-xs text-slate-400">Paste anywhere</div>
                </div>
              </div>
            </Button>
          </div>

          {/* Additional options */}
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="text-slate-300 font-medium mb-1">Pro Tip</p>
                <p className="text-slate-400">
                  Copy the improved text and paste it into your preferred
                  document editor for further customization.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Coming Soon Modal */}
      <ComingSoonModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        feature="PDF Export"
      />
    </>
  );
}
