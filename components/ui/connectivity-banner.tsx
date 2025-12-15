"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useConnectivity } from "@/hooks/use-connectivity";
import { WifiOff, Wifi, X } from "lucide-react";
import { Button } from "./button";

export interface ConnectivityBannerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Show reconnected message */
  showReconnected?: boolean;
  /** Position of the banner */
  position?: "top" | "bottom";
  /** Allow dismissing the banner */
  dismissible?: boolean;
}

function ConnectivityBanner({
  showReconnected = true,
  position = "top",
  dismissible = false,
  className,
  ...props
}: ConnectivityBannerProps) {
  const { isOnline, wasOffline } = useConnectivity();
  const [dismissed, setDismissed] = React.useState(false);

  // Reset dismissed state when going offline
  React.useEffect(() => {
    if (!isOnline) {
      setDismissed(false);
    }
  }, [isOnline]);

  // Don't show if dismissed or online (and not showing reconnected message)
  if (dismissed) return null;
  if (isOnline && (!showReconnected || !wasOffline)) return null;

  const isReconnected = isOnline && wasOffline;

  return (
    <div
      className={cn(
        "fixed left-0 right-0 z-toast flex items-center justify-center px-4 py-2",
        "transition-all duration-normal animate-slide-in-bottom",
        position === "top" ? "top-0 safe-area-top" : "bottom-0 safe-area-bottom",
        isReconnected
          ? "bg-success text-white"
          : "bg-warning text-white",
        className
      )}
      role="alert"
      aria-live="polite"
      {...props}
    >
      <div className="flex items-center gap-3 max-w-lg">
        {isReconnected ? (
          <>
            <Wifi className="w-5 h-5 shrink-0" />
            <span className="text-sm font-medium">You're back online!</span>
          </>
        ) : (
          <>
            <WifiOff className="w-5 h-5 shrink-0" />
            <span className="text-sm font-medium">
              You're offline. Some features may not work.
            </span>
          </>
        )}
        {dismissible && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setDismissed(true)}
            className="shrink-0 text-white hover:bg-white/20"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

// Provider that wraps the app and shows connectivity status
function ConnectivityProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ConnectivityBanner position="bottom" dismissible />
    </>
  );
}

export { ConnectivityBanner, ConnectivityProvider };

