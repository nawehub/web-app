"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * VisuallyHidden - Hide content visually but keep it accessible to screen readers
 */
export function VisuallyHidden({
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className="absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0"
      style={{ clip: "rect(0, 0, 0, 0)" }}
      {...props}
    >
      {children}
    </span>
  );
}

/**
 * SkipLink - Allow keyboard users to skip to main content
 */
export interface SkipLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  targetId?: string;
}

export function SkipLink({
  targetId = "main-content",
  children = "Skip to main content",
  className,
  ...props
}: SkipLinkProps) {
  return (
    <a
      href={`#${targetId}`}
      className={cn(
        "fixed top-0 left-0 z-[9999] px-4 py-2",
        "bg-primary text-primary-foreground font-medium",
        "transform -translate-y-full focus:translate-y-0",
        "transition-transform duration-fast",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
}

/**
 * Announcer - Announce messages to screen readers
 * Uses aria-live regions to communicate dynamic changes
 */
export interface AnnouncerProps {
  message: string;
  /** Politeness level for the announcement */
  politeness?: "polite" | "assertive";
  /** Clear the message after announcing */
  clearOnAnnounce?: boolean;
}

export function Announcer({
  message,
  politeness = "polite",
  clearOnAnnounce = true,
}: AnnouncerProps) {
  const [announcement, setAnnouncement] = React.useState("");

  React.useEffect(() => {
    if (message) {
      setAnnouncement(message);
      if (clearOnAnnounce) {
        const timer = setTimeout(() => setAnnouncement(""), 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [message, clearOnAnnounce]);

  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      className="absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0"
      style={{ clip: "rect(0, 0, 0, 0)" }}
    >
      {announcement}
    </div>
  );
}

/**
 * Hook to announce messages to screen readers programmatically
 */
export function useAnnounce() {
  const [message, setMessage] = React.useState("");

  const announce = React.useCallback((text: string) => {
    setMessage("");
    // Small delay to ensure the change is detected
    requestAnimationFrame(() => {
      setMessage(text);
    });
  }, []);

  const clear = React.useCallback(() => {
    setMessage("");
  }, []);

  return { message, announce, clear };
}

/**
 * FocusTrap - Trap focus within a container (for modals, dialogs)
 */
export interface FocusTrapProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Whether the trap is active */
  active?: boolean;
  /** Return focus to the element that triggered the trap when deactivated */
  returnFocus?: boolean;
  /** Initial focus target (selector or element) */
  initialFocus?: string | HTMLElement | null;
}

export function FocusTrap({
  active = true,
  returnFocus = true,
  initialFocus,
  children,
  ...props
}: FocusTrapProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const previousActiveElement = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    if (!active) return;

    // Store the previously focused element
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Focus initial element or first focusable
    const container = containerRef.current;
    if (!container) return;

    const focusFirst = () => {
      if (initialFocus) {
        const element =
          typeof initialFocus === "string"
            ? container.querySelector<HTMLElement>(initialFocus)
            : initialFocus;
        element?.focus();
      } else {
        const focusable = getFocusableElements(container);
        focusable[0]?.focus();
      }
    };

    // Delay to ensure content is rendered
    requestAnimationFrame(focusFirst);

    return () => {
      // Return focus when trap is deactivated
      if (returnFocus && previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [active, initialFocus, returnFocus]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!active || event.key !== "Tab") return;

    const container = containerRef.current;
    if (!container) return;

    const focusable = getFocusableElements(container);
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div ref={containerRef} onKeyDown={handleKeyDown} {...props}>
      {children}
    </div>
  );
}

/**
 * Get all focusable elements within a container
 */
function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const focusableSelectors = [
    "button:not([disabled])",
    "[href]",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
  ].join(", ");

  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelectors)).filter(
    (el) => !el.hasAttribute("disabled") && el.offsetParent !== null
  );
}

/**
 * Hook to detect reduced motion preference
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
}

/**
 * Hook to manage focus on mount/unmount
 */
export function useFocusOnMount(ref: React.RefObject<HTMLElement>, shouldFocus: boolean = true) {
  React.useEffect(() => {
    if (shouldFocus && ref.current) {
      ref.current.focus();
    }
  }, [ref, shouldFocus]);
}

/**
 * Hook to return focus to a specific element
 */
export function useReturnFocus() {
  const previousElement = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    previousElement.current = document.activeElement as HTMLElement;

    return () => {
      previousElement.current?.focus();
    };
  }, []);

  const returnFocus = React.useCallback(() => {
    previousElement.current?.focus();
  }, []);

  return returnFocus;
}

/**
 * Accessible Icon wrapper
 */
export interface AccessibleIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Label for screen readers */
  label: string;
  children: React.ReactNode;
}

export function AccessibleIcon({ label, children, ...props }: AccessibleIconProps) {
  return (
    <span role="img" aria-label={label} {...props}>
      {children}
    </span>
  );
}

/**
 * Decorative Icon wrapper (hidden from screen readers)
 */
export function DecorativeIcon({
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { children: React.ReactNode }) {
  return (
    <span aria-hidden="true" {...props}>
      {children}
    </span>
  );
}

