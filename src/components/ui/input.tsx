import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "glass" | "outline";
  inputSize?: "default" | "sm" | "lg";
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      variant = "default",
      inputSize = "default",
      error = false,
      ...props
    },
    ref
  ) => {
    return (
      <input
        type={type}
        className={cn(
          // Base styles
          "flex w-full rounded-xl font-medium transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:placeholder:text-gray-400",

          // Variants
          {
            // Default - Clean modern
            "border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm focus-visible:ring-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-50 dark:focus-visible:ring-blue-400":
              variant === "default",

            // Glass - Glassmorphism
            "border border-white/20 bg-white/10 px-4 py-2.5 text-gray-900 shadow-lg backdrop-blur-md focus-visible:ring-blue-500 dark:border-gray-700/30 dark:bg-gray-900/20 dark:text-gray-50":
              variant === "glass",

            // Outline - Strong border
            "border-2 border-gray-300 bg-transparent px-4 py-2.5 text-gray-900 focus-visible:border-blue-500 focus-visible:ring-blue-500 dark:border-gray-600 dark:text-gray-50 dark:focus-visible:border-blue-400":
              variant === "outline",
          },

          // Sizes
          {
            "h-10 text-sm": inputSize === "default",
            "h-8 px-3 py-1.5 text-xs": inputSize === "sm",
            "h-12 px-6 py-3 text-base": inputSize === "lg",
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
Input.displayName = "Input";

export { Input };
