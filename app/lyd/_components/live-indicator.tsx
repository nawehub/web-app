"use client";

import { cn } from "@/lib/utils";

interface LiveIndicatorProps {
  isLive: boolean;
  hasError: boolean;
  className?: string;
}

export function LiveIndicator({ isLive, hasError, className }: LiveIndicatorProps) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <span
        className={cn(
          "relative flex h-2 w-2",
          isLive && !hasError && "animate-none"
        )}
      >
        {isLive && !hasError && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        )}
        <span
          className={cn(
            "relative inline-flex rounded-full h-2 w-2",
            isLive && !hasError ? "bg-emerald-500" : hasError ? "bg-amber-400" : "bg-zinc-400"
          )}
        />
      </span>
      <span
        className={cn(
          "text-xs font-medium",
          isLive && !hasError
            ? "text-emerald-600 dark:text-emerald-400"
            : hasError
            ? "text-amber-600 dark:text-amber-400"
            : "text-zinc-500 dark:text-zinc-400"
        )}
      >
        {isLive && !hasError ? "Live" : hasError ? "Reconnecting" : "Connecting…"}
      </span>
    </div>
  );
}
