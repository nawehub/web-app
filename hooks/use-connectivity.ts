"use client";

import { useState, useEffect, useCallback } from "react";

export interface ConnectivityState {
  isOnline: boolean;
  wasOffline: boolean;
  connectionType?: string;
}

/**
 * Hook to track network connectivity status
 * Returns current online status and provides reconnection detection
 */
export function useConnectivity(): ConnectivityState {
  const [isOnline, setIsOnline] = useState(true);
  const [wasOffline, setWasOffline] = useState(false);
  const [connectionType, setConnectionType] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Set initial state from navigator
    if (typeof navigator !== "undefined") {
      setIsOnline(navigator.onLine);
      
      // Get connection type if available
      const connection = (navigator as any).connection || 
                        (navigator as any).mozConnection || 
                        (navigator as any).webkitConnection;
      if (connection) {
        setConnectionType(connection.effectiveType);
      }
    }

    const handleOnline = () => {
      setIsOnline(true);
      // Track that we were offline (for showing "back online" message)
      if (!isOnline) {
        setWasOffline(true);
        // Clear the "was offline" state after 5 seconds
        setTimeout(() => setWasOffline(false), 5000);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    const handleConnectionChange = () => {
      const connection = (navigator as any).connection;
      if (connection) {
        setConnectionType(connection.effectiveType);
      }
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Listen for connection changes
    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener("change", handleConnectionChange);
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      if (connection) {
        connection.removeEventListener("change", handleConnectionChange);
      }
    };
  }, [isOnline]);

  return { isOnline, wasOffline, connectionType };
}

/**
 * Hook for retry logic with exponential backoff
 */
export function useRetry() {
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const retry = useCallback(async <T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> => {
    setIsRetrying(true);
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        setRetryCount(attempt);
        const result = await fn();
        setIsRetrying(false);
        setRetryCount(0);
        return result;
      } catch (error) {
        lastError = error as Error;
        if (attempt < maxRetries) {
          // Exponential backoff
          const delay = baseDelay * Math.pow(2, attempt);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    setIsRetrying(false);
    throw lastError;
  }, []);

  const reset = useCallback(() => {
    setRetryCount(0);
    setIsRetrying(false);
  }, []);

  return { retry, retryCount, isRetrying, reset };
}

