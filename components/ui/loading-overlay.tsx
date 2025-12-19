"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface LoadingOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Whether the overlay is visible */
  isLoading: boolean;
  /** Loading message to display */
  message?: string;
  /** Sub-message for additional context */
  subMessage?: string;
  /** Spinner size */
  size?: "sm" | "default" | "lg";
  /** Overlay style */
  variant?: "overlay" | "inline" | "fullscreen";
  /** Background blur */
  blur?: boolean;
}

const sizeClasses = {
  sm: "w-6 h-6",
  default: "w-10 h-10",
  lg: "w-14 h-14",
};

function LoadingOverlay({
  isLoading,
  message = "Loading...",
  subMessage,
  size = "default",
  variant = "overlay",
  blur = true,
  className,
  children,
  ...props
}: LoadingOverlayProps) {
  if (variant === "inline") {
    return (
      <div className={cn("relative", className)} {...props}>
        {children}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
            {message && (
              <p className="mt-4 text-sm font-medium text-muted-foreground">{message}</p>
            )}
            {subMessage && (
              <p className="mt-1 text-xs text-muted-foreground">{subMessage}</p>
            )}
          </div>
        )}
      </div>
    );
  }

  if (variant === "fullscreen") {
    if (!isLoading) return <>{children}</>;

    return (
      <div
        className={cn(
          "fixed inset-0 z-[999] flex flex-col items-center justify-center",
          "bg-background",
          className
        )}
        {...props}
      >
        <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
        {message && (
          <p className="mt-4 text-base font-medium">{message}</p>
        )}
        {subMessage && (
          <p className="mt-2 text-sm text-muted-foreground">{subMessage}</p>
        )}
      </div>
    );
  }

  // Default overlay variant
  return (
    <div className={cn("relative", className)} {...props}>
      {children}
      {isLoading && (
        <div
          className={cn(
            "absolute inset-0 z-50 flex flex-col items-center justify-center",
            "bg-background/80",
            blur && "backdrop-blur-sm"
          )}
        >
          <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
          {message && (
            <p className="mt-4 text-sm font-medium text-muted-foreground">{message}</p>
          )}
          {subMessage && (
            <p className="mt-1 text-xs text-muted-foreground">{subMessage}</p>
          )}
        </div>
      )}
    </div>
  );
}

// Inline spinner for buttons and small loading states
export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "xs" | "sm" | "default" | "lg";
}

function Spinner({ size = "default", className, ...props }: SpinnerProps) {
  const spinnerSizes = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    default: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <div className={cn("animate-spin", spinnerSizes[size], className)} {...props}>
      <Loader2 className="w-full h-full" />
    </div>
  );
}

// Page loading component
function PageLoading({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] py-12">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
      <p className="mt-4 text-muted-foreground">{message}</p>
    </div>
  );
}

// Button loading state helper
function ButtonLoading({ text = "Please wait..." }: { text?: string }) {
  return (
    <>
      <Loader2 className="w-4 h-4 animate-spin mr-2" />
      {text}
    </>
  );
}

export { LoadingOverlay, Spinner, PageLoading, ButtonLoading };

