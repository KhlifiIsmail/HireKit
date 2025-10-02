import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "success"
    | "warning"
    | "info";
  size?: "sm" | "default" | "lg";
}

function Badge({
  className,
  variant = "default",
  size = "default",
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        // Base styles
        "inline-flex items-center rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",

        // Variants
        {
          // Default - Blue
          "bg-blue-600 text-white shadow-sm": variant === "default",

          // Secondary - Gray
          "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50":
            variant === "secondary",

          // Destructive - Red
          "bg-red-600 text-white shadow-sm": variant === "destructive",

          // Outline - Transparent with border
          "border border-gray-300 bg-transparent text-gray-900 dark:border-gray-600 dark:text-gray-50":
            variant === "outline",

          // Success - Green
          "bg-green-600 text-white shadow-sm": variant === "success",

          // Warning - Yellow
          "bg-yellow-500 text-white shadow-sm": variant === "warning",

          // Info - Cyan
          "bg-cyan-600 text-white shadow-sm": variant === "info",
        },

        // Sizes
        {
          "px-2 py-1 text-xs": size === "sm",
          "px-3 py-1 text-sm": size === "default",
          "px-4 py-2 text-base": size === "lg",
        },

        className
      )}
      {...props}
    />
  );
}

export { Badge };
