import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  variant?: "default" | "gradient" | "success" | "warning" | "danger";
  size?: "sm" | "default" | "lg";
  showValue?: boolean;
  animated?: boolean;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      className,
      value = 0,
      max = 100,
      variant = "default",
      size = "default",
      showValue = false,
      animated = false,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(Math.max(0, (value / max) * 100), 100);

    return (
      <div className="relative w-full">
        <div
          ref={ref}
          className={cn(
            // Base styles
            "relative w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800",

            // Sizes
            {
              "h-2": size === "sm",
              "h-3": size === "default",
              "h-4": size === "lg",
            },

            className
          )}
          {...props}
        >
          <div
            className={cn(
              // Base bar styles
              "h-full w-full flex-1 transition-all duration-500 ease-out",

              // Variants
              {
                // Default - Blue
                "bg-blue-600 dark:bg-blue-500": variant === "default",

                // Gradient - Blue to purple
                "bg-gradient-to-r from-blue-600 to-purple-600":
                  variant === "gradient",

                // Success - Green
                "bg-green-600 dark:bg-green-500": variant === "success",

                // Warning - Yellow
                "bg-yellow-500 dark:bg-yellow-400": variant === "warning",

                // Danger - Red
                "bg-red-600 dark:bg-red-500": variant === "danger",
              },

              // Animated shine effect
              animated &&
                "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent"
            )}
            style={{
              transform: `translateX(-${100 - percentage}%)`,
            }}
          />
        </div>

        {showValue && (
          <div className="mt-1 flex justify-between text-xs text-gray-600 dark:text-gray-400">
            <span>{Math.round(percentage)}%</span>
            <span>
              {value}/{max}
            </span>
          </div>
        )}
      </div>
    );
  }
);
Progress.displayName = "Progress";

// Circular Progress variant
export interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  variant?: "default" | "gradient" | "success" | "warning" | "danger";
  showValue?: boolean;
  className?: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  variant = "default",
  showValue = true,
  className,
}) => {
  const percentage = Math.min(Math.max(0, (value / max) * 100), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColor = () => {
    switch (variant) {
      case "gradient":
        return "#3B82F6";
      case "success":
        return "#10B981";
      case "warning":
        return "#F59E0B";
      case "danger":
        return "#EF4444";
      default:
        return "#3B82F6";
    }
  };

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center",
        className
      )}
    >
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-200 dark:text-gray-700"
        />

        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor()}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>

      {showValue && (
        <span className="absolute text-xl font-bold text-gray-900 dark:text-gray-50">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
};

export { Progress, CircularProgress };
