"use client";

import { useState, useEffect } from "react";
import { X, Sparkles, Rocket } from "lucide-react";
import { Button } from "./button";

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature?: string;
}

export function ComingSoonModal({
  isOpen,
  onClose,
  feature = "This feature",
}: ComingSoonModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className={`relative bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50 rounded-3xl shadow-2xl max-w-md w-full pointer-events-auto transform transition-all duration-300 ${
            isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-700/50 transition-colors"
          >
            <X className="w-5 h-5 text-slate-400 hover:text-white" />
          </button>

          {/* Content */}
          <div className="p-8 text-center">
            {/* Animated Icon */}
            <div className="relative inline-block mb-6">
              {/* Pulse rings */}
              <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping" />
              <div className="absolute inset-0 rounded-full bg-violet-500/20 animate-ping animation-delay-150" />

              {/* Icon container */}
              <div className="relative p-6 bg-gradient-to-br from-blue-600 to-violet-600 rounded-full">
                <Rocket className="w-12 h-12 text-white animate-bounce" />
              </div>
            </div>

            {/* Title */}
            <h3 className="text-3xl font-bold text-white mb-3">Coming Soon!</h3>

            {/* Description */}
            <p className="text-slate-300 text-lg mb-2">
              {feature} is currently in development
            </p>
            <p className="text-slate-400 text-sm mb-8">
              We're working hard to bring you this feature. Stay tuned!
            </p>

            {/* Features preview */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 mb-6">
              <div className="flex items-center gap-3 text-left">
                <Sparkles className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium text-sm">
                    Want early access?
                  </p>
                  <p className="text-slate-400 text-xs">
                    Contact us to be notified when it launches
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                Got it
              </Button>
              <a href="mailto:ismail.khliffi@gmail.com" className="flex-1">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white">
                  Contact Us
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes ping {
          75%,
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        .animate-ping {
          animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        .animation-delay-150 {
          animation-delay: 150ms;
        }
      `}</style>
    </>
  );
}
