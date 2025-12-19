"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { 
  AlertTriangle, 
  WifiOff, 
  ServerCrash, 
  FileX, 
  ShieldX, 
  RefreshCw,
  Home,
  LucideIcon 
} from "lucide-react"
import { Button } from "./button"

export interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Type of error to display appropriate messaging */
  type?: "generic" | "network" | "server" | "notFound" | "forbidden"
  /** Custom icon */
  icon?: LucideIcon
  /** Custom title */
  title?: string
  /** Custom description */
  description?: string
  /** Retry action */
  onRetry?: () => void
  /** Go home action */
  onGoHome?: () => void
  /** Is retry in progress */
  isRetrying?: boolean
  /** Size variant */
  size?: "sm" | "default" | "lg"
  /** Additional details (e.g., error code) */
  details?: string
}

const errorConfigs = {
  generic: {
    icon: AlertTriangle,
    title: "Something went wrong",
    description: "We encountered an unexpected error. Please try again.",
  },
  network: {
    icon: WifiOff,
    title: "Connection problem",
    description: "Please check your internet connection and try again.",
  },
  server: {
    icon: ServerCrash,
    title: "Service unavailable",
    description: "We're having trouble connecting to our servers. This usually resolves quickly.",
  },
  notFound: {
    icon: FileX,
    title: "Page not found",
    description: "We can't find the page you're looking for. It may have been moved or deleted.",
  },
  forbidden: {
    icon: ShieldX,
    title: "Access denied",
    description: "You don't have permission to access this resource.",
  },
}

function ErrorState({
  type = "generic",
  icon,
  title,
  description,
  onRetry,
  onGoHome,
  isRetrying = false,
  size = "default",
  details,
  className,
  ...props
}: ErrorStateProps) {
  const config = errorConfigs[type]
  const Icon = icon || config.icon

  const sizeClasses = {
    sm: {
      container: "py-8 px-4",
      icon: "h-10 w-10",
      iconWrapper: "w-16 h-16",
      title: "text-base",
      description: "text-sm",
    },
    default: {
      container: "py-12 px-6",
      icon: "h-12 w-12",
      iconWrapper: "w-20 h-20",
      title: "text-lg",
      description: "text-sm",
    },
    lg: {
      container: "py-16 px-8",
      icon: "h-16 w-16",
      iconWrapper: "w-24 h-24",
      title: "text-xl",
      description: "text-base",
    },
  }

  const sizes = sizeClasses[size]

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        sizes.container,
        className
      )}
      role="alert"
      {...props}
    >
      {/* Icon with error styling */}
      <div
        className={cn(
          "flex items-center justify-center rounded-full bg-error/10 mb-4",
          sizes.iconWrapper
        )}
      >
        <Icon className={cn("text-error", sizes.icon)} strokeWidth={1.5} />
      </div>

      {/* Title */}
      <h3
        className={cn(
          "font-semibold font-display text-foreground",
          sizes.title
        )}
      >
        {title || config.title}
      </h3>

      {/* Description */}
      <p
        className={cn(
          "text-muted-foreground mt-2 max-w-sm",
          sizes.description
        )}
      >
        {description || config.description}
      </p>

      {/* Error details */}
      {details && (
        <p className="text-xs text-muted-foreground mt-2 font-mono bg-muted px-2 py-1 rounded">
          {details}
        </p>
      )}

      {/* Actions */}
      {(onRetry || onGoHome) && (
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          {onRetry && (
            <Button
              onClick={onRetry}
              isLoading={isRetrying}
              loadingText="Retrying..."
              className="min-w-[140px]"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          )}
          {onGoHome && (
            <Button
              variant="outline"
              onClick={onGoHome}
              className="min-w-[140px]"
            >
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

// Inline error message for forms
export interface InlineErrorProps extends React.HTMLAttributes<HTMLDivElement> {
  message: string
}

function InlineError({ message, className, ...props }: InlineErrorProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 text-sm text-error bg-error/10 px-3 py-2 rounded-md",
        className
      )}
      role="alert"
      {...props}
    >
      <AlertTriangle className="h-4 w-4 shrink-0" />
      <span>{message}</span>
    </div>
  )
}

// Banner error for page-level notifications
export interface ErrorBannerProps extends React.HTMLAttributes<HTMLDivElement> {
  message: string
  onDismiss?: () => void
  onRetry?: () => void
}

function ErrorBanner({ 
  message, 
  onDismiss, 
  onRetry, 
  className, 
  ...props 
}: ErrorBannerProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 bg-error text-white px-4 py-3 rounded-lg",
        className
      )}
      role="alert"
      {...props}
    >
      <div className="flex items-center gap-3">
        <AlertTriangle className="h-5 w-5 shrink-0" />
        <p className="text-sm font-medium">{message}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-white/80 hover:text-white text-sm font-medium underline underline-offset-2"
          >
            Retry
          </button>
        )}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-white/80 hover:text-white p-1"
            aria-label="Dismiss"
          >
            <span className="sr-only">Dismiss</span>
            ×
          </button>
        )}
      </div>
    </div>
  )
}

// Offline indicator
function OfflineIndicator({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2 bg-warning text-white px-4 py-2 text-sm font-medium",
        className
      )}
      role="status"
      {...props}
    >
      <WifiOff className="h-4 w-4" />
      <span>You're offline. Some features may be limited.</span>
    </div>
  )
}

export { 
  ErrorState, 
  InlineError, 
  ErrorBanner, 
  OfflineIndicator 
}

