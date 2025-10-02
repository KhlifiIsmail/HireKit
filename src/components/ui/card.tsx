import * as React from "react";
import { cn } from "@/lib/utils/cn";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "glass" | "elevated" | "outline";
    hover?: boolean;
  }
>(({ className, variant = "default", hover = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      // Base styles
      "rounded-2xl transition-all duration-300",

      // Variants
      {
        // Default - Clean white/dark
        "border bg-white text-gray-950 shadow-sm dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50":
          variant === "default",

        // Glass - Glassmorphism effect
        "border border-white/20 bg-white/10 text-gray-950 shadow-xl backdrop-blur-md dark:border-gray-700/30 dark:bg-gray-900/20 dark:text-gray-50":
          variant === "glass",

        // Elevated - Strong shadow
        "border-0 bg-white text-gray-950 shadow-2xl shadow-gray-900/10 dark:bg-gray-950 dark:text-gray-50 dark:shadow-black/20":
          variant === "elevated",

        // Outline - Subtle border
        "border-2 border-gray-200 bg-white text-gray-950 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-50":
          variant === "outline",
      },

      // Hover effects
      hover && "hover:shadow-lg hover:scale-[1.01] cursor-pointer",

      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6 pb-4", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-xl font-semibold leading-none tracking-tight text-gray-900 dark:text-gray-50",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-gray-600 dark:text-gray-400", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
