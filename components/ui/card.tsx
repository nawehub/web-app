import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const cardVariants = cva(
  "rounded-lg border bg-card text-card-foreground transition-all duration-normal",
  {
    variants: {
      variant: {
        default: "shadow-sm",
        elevated: "shadow-md",
        outline: "shadow-none border-2",
        ghost: "border-transparent shadow-none bg-transparent",
      },
      interactive: {
        true: "cursor-pointer hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        false: "",
      },
      selected: {
        true: "border-primary ring-2 ring-primary/20",
        false: "",
      },
      padding: {
        none: "",
        sm: "p-4",
        default: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      interactive: false,
      selected: false,
      padding: "none",
    },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, interactive, selected, padding, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, interactive, selected, padding }), className)}
      tabIndex={interactive ? 0 : undefined}
      role={interactive ? "button" : undefined}
      {...props}
    />
  )
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-xl font-semibold font-display leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground leading-relaxed", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

// Specialized card variants for NaWeHub
export interface StatsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
  label: string
  value: string | number
  trend?: {
    value: number
    isPositive: boolean
  }
}

const StatsCard = React.forwardRef<HTMLDivElement, StatsCardProps>(
  ({ className, icon, label, value, trend, ...props }, ref) => (
    <Card ref={ref} className={cn("p-4 sm:p-6", className)} {...props}>
      <div className="flex items-start justify-between">
        {icon && (
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            {icon}
          </div>
        )}
        {trend && (
          <span
            className={cn(
              "text-xs font-medium px-2 py-0.5 rounded-full",
              trend.isPositive
                ? "bg-success/10 text-success"
                : "bg-error/10 text-error"
            )}
          >
            {trend.isPositive ? "+" : ""}{trend.value}%
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold font-display mt-1">{value}</p>
      </div>
    </Card>
  )
)
StatsCard.displayName = "StatsCard"

export interface FundingCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  provider?: string
  amountRange?: string
  deadline?: string
  tags?: string[]
  isFeatured?: boolean
  onApply?: () => void
}

const FundingCard = React.forwardRef<HTMLDivElement, FundingCardProps>(
  ({ className, title, provider, amountRange, deadline, tags, isFeatured, onApply, ...props }, ref) => (
    <Card 
      ref={ref} 
      interactive={!!onApply}
      onClick={onApply}
      className={cn("overflow-hidden", className)} 
      {...props}
    >
      {isFeatured && (
        <div className="bg-gradient-to-r from-primary to-primary-600 px-4 py-1.5">
          <span className="text-xs font-medium text-white">Featured Opportunity</span>
        </div>
      )}
      <div className="p-4 sm:p-6">
        <h4 className="font-semibold font-display text-lg line-clamp-2">{title}</h4>
        {provider && (
          <p className="text-sm text-muted-foreground mt-1">{provider}</p>
        )}
        <div className="mt-4 space-y-2">
          {amountRange && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-primary font-medium">{amountRange}</span>
            </div>
          )}
          {deadline && (
            <p className="text-sm text-muted-foreground">
              Apply by: <span className="text-foreground">{deadline}</span>
            </p>
          )}
        </div>
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
)
FundingCard.displayName = "FundingCard"

export { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent,
  StatsCard,
  FundingCard,
  cardVariants
}
