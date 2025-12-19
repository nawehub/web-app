"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

export interface BottomNavItem {
  label: string
  href: string
  icon: LucideIcon
  /** Badge count to display */
  badge?: number
  /** Whether this item matches partial paths */
  matchPartial?: boolean
}

export interface BottomNavProps extends React.HTMLAttributes<HTMLElement> {
  items: BottomNavItem[]
}

function BottomNav({ items, className, ...props }: BottomNavProps) {
  const pathname = usePathname()

  const isActive = (item: BottomNavItem) => {
    if (item.matchPartial) {
      return pathname.startsWith(item.href)
    }
    return pathname === item.href
  }

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t",
        "h-16 safe-area-bottom",
        "md:hidden", // Hide on desktop
        className
      )}
      role="navigation"
      aria-label="Main navigation"
      {...props}
    >
      <div className="flex items-center justify-around h-full max-w-lg mx-auto px-2">
        {items.map((item) => {
          const active = isActive(item)
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full min-w-[64px] relative",
                "touch-manipulation transition-colors duration-fast",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-current={active ? "page" : undefined}
            >
              <div className="relative">
                <Icon
                  className={cn(
                    "h-6 w-6 transition-transform duration-fast",
                    active && "scale-110"
                  )}
                  strokeWidth={active ? 2.5 : 2}
                />
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={cn(
                      "absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1",
                      "flex items-center justify-center",
                      "text-[10px] font-bold text-white",
                      "bg-accent rounded-full",
                      "animate-scale-in"
                    )}
                  >
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </div>
              <span
                className={cn(
                  "text-[10px] mt-1 font-medium transition-opacity duration-fast",
                  active ? "opacity-100" : "opacity-70"
                )}
              >
                {item.label}
              </span>
              {/* Active indicator */}
              {active && (
                <span
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full"
                  aria-hidden="true"
                />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

// Spacer to prevent content from being hidden behind bottom nav
function BottomNavSpacer({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("h-16 md:h-0 safe-area-bottom", className)}
      aria-hidden="true"
      {...props}
    />
  )
}

export { BottomNav, BottomNavSpacer }

