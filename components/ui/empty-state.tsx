"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { LucideIcon, FileQuestion, FolderOpen, Search, Users, Briefcase, Heart, FileText, Calendar } from "lucide-react"
import { Button } from "./button"

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Icon to display */
  icon?: LucideIcon
  /** Title text */
  title: string
  /** Description text */
  description?: string
  /** Primary action button */
  action?: {
    label: string
    onClick: () => void
    icon?: LucideIcon
  }
  /** Secondary action */
  secondaryAction?: {
    label: string
    onClick: () => void
  }
  /** Size variant */
  size?: "sm" | "default" | "lg"
}

function EmptyState({
  icon: Icon = FileQuestion,
  title,
  description,
  action,
  secondaryAction,
  size = "default",
  className,
  ...props
}: EmptyStateProps) {
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
      {...props}
    >
      {/* Icon with decorative background */}
      <div
        className={cn(
          "flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 mb-4",
          sizes.iconWrapper
        )}
      >
        <Icon
          className={cn("text-muted-foreground", sizes.icon)}
          strokeWidth={1.5}
        />
      </div>

      {/* Title */}
      <h3
        className={cn(
          "font-semibold font-display text-foreground",
          sizes.title
        )}
      >
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p
          className={cn(
            "text-muted-foreground mt-2 max-w-sm",
            sizes.description
          )}
        >
          {description}
        </p>
      )}

      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          {action && (
            <Button onClick={action.onClick} className="min-w-[140px]">
              {action.icon && <action.icon className="mr-2 h-4 w-4" />}
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              variant="outline"
              onClick={secondaryAction.onClick}
              className="min-w-[140px]"
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

// Pre-built empty state variants for common NaWeHub scenarios

function EmptyBusinesses({ onRegister }: { onRegister?: () => void }) {
  return (
    <EmptyState
      icon={Briefcase}
      title="No businesses yet"
      description="Register your first business to unlock funding opportunities and grow your presence."
      action={
        onRegister
          ? {
              label: "Register Business",
              onClick: onRegister,
            }
          : undefined
      }
    />
  )
}

function EmptyFunding({ onExplore }: { onExplore?: () => void }) {
  return (
    <EmptyState
      icon={Search}
      title="No funding opportunities found"
      description="Check back later or adjust your search filters to find opportunities that match your needs."
      action={
        onExplore
          ? {
              label: "Clear Filters",
              onClick: onExplore,
            }
          : undefined
      }
    />
  )
}

function EmptyDonations({ onDonate }: { onDonate?: () => void }) {
  return (
    <EmptyState
      icon={Heart}
      title="No donations yet"
      description="Make your first contribution to support community development in your district."
      action={
        onDonate
          ? {
              label: "Donate Now",
              onClick: onDonate,
            }
          : undefined
      }
    />
  )
}

function EmptyResources({ onUpload }: { onUpload?: () => void }) {
  return (
    <EmptyState
      icon={FileText}
      title="No resources available"
      description="Upload helpful resources to share with the NaWeHub community."
      action={
        onUpload
          ? {
              label: "Upload Resource",
              onClick: onUpload,
            }
          : undefined
      }
    />
  )
}

function EmptyEvents({ onCreate }: { onCreate?: () => void }) {
  return (
    <EmptyState
      icon={Calendar}
      title="No upcoming events"
      description="There are no events scheduled at the moment. Check back soon or create your own event."
      action={
        onCreate
          ? {
              label: "Create Event",
              onClick: onCreate,
            }
          : undefined
      }
    />
  )
}

function EmptySearch({ query, onClear }: { query?: string; onClear?: () => void }) {
  return (
    <EmptyState
      icon={Search}
      title={query ? `No results for "${query}"` : "No results found"}
      description="Try adjusting your search terms or filters to find what you're looking for."
      action={
        onClear
          ? {
              label: "Clear Search",
              onClick: onClear,
            }
          : undefined
      }
    />
  )
}

function EmptyFolder() {
  return (
    <EmptyState
      icon={FolderOpen}
      title="This folder is empty"
      description="Add files to this folder to keep your resources organized."
      size="sm"
    />
  )
}

function EmptyUsers({ onInvite }: { onInvite?: () => void }) {
  return (
    <EmptyState
      icon={Users}
      title="No users found"
      description="Invite team members to collaborate on your platform."
      action={
        onInvite
          ? {
              label: "Invite User",
              onClick: onInvite,
            }
          : undefined
      }
    />
  )
}

export {
  EmptyState,
  EmptyBusinesses,
  EmptyFunding,
  EmptyDonations,
  EmptyResources,
  EmptyEvents,
  EmptySearch,
  EmptyFolder,
  EmptyUsers,
}

