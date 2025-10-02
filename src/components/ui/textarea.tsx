import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: "default" | "glass" | "outline";
  error?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant = "default", error = false, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          // Base styles
          "flex min-h-[120px] w-full rounded-xl px-4 py-3 font-medium transition-all duration-200 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:placeholder:text-gray-400",

          // Variants
          {
            // Default - Clean modern
            "border border-gray-300 bg-white text-gray-900 shadow-sm focus-visible:ring-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-50 dark:focus-visible:ring-blue-400":
              variant === "default",

            // Glass - Glassmorphism
            "border border-white/20 bg-white/10 text-gray-900 shadow-lg backdrop-blur-md focus-visible:ring-blue-500 dark:border-gray-700/30 dark:bg-gray-900/20 dark:text-gray-50":
              variant === "glass",

            // Outline - Strong border
            "border-2 border-gray-300 bg-transparent text-gray-900 focus-visible:border-blue-500 focus-visible:ring-blue-500 dark:border-gray-600 dark:text-gray-50 dark:focus-visible:border-blue-400":
              variant === "outline",
          },

          // Error state
          error &&
            "border-red-500 focus-visible:ring-red-500 dark:border-red-400 dark:focus-visible:ring-red-400",

          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
