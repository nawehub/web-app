import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // Base styles with mobile-first touch targets
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium font-display transition-all duration-fast ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 touch-manipulation active:scale-[0.98]",
  {
    variants: {
      variant: {
        // Primary - Main CTAs (Forest Green)
        default:
          "bg-primary text-primary-foreground hover:bg-primary-600 shadow-sm hover:shadow-primary",
        // Secondary - Secondary actions
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-neutral-200 dark:hover:bg-neutral-700",
        // Tertiary/Ghost - Low-emphasis actions
        ghost: 
          "hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-foreground",
        // Outline - Alternative secondary
        outline:
          "border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-primary-foreground",
        // Destructive - Danger actions
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        // Success - Positive actions
        success:
          "bg-success text-white hover:bg-success/90",
        // Warning - Caution actions  
        warning:
          "bg-warning text-white hover:bg-warning/90",
        // Link - Text only
        link: 
          "text-primary underline-offset-4 hover:underline p-0 h-auto",
        // Accent - Sunset Orange CTAs
        accent:
          "bg-accent text-accent-foreground hover:bg-secondary-600 shadow-sm hover:shadow-secondary",
      },
      size: {
        // xs - 32px height (44px touch with padding)
        xs: "h-8 px-3 text-xs [&_svg]:size-3.5 min-h-[44px] sm:min-h-0",
        // sm - 36px height
        sm: "h-9 px-4 text-sm [&_svg]:size-4 min-h-[44px] sm:min-h-0",
        // default/md - 44px height (optimal touch target)
        default: "h-11 px-5 text-sm [&_svg]:size-4",
        // lg - 52px height
        lg: "h-[52px] px-7 text-base [&_svg]:size-5",
        // xl - 60px height
        xl: "h-[60px] px-8 text-lg [&_svg]:size-6",
        // icon - Square buttons
        icon: "h-11 w-11 [&_svg]:size-5",
        "icon-sm": "h-9 w-9 [&_svg]:size-4",
        "icon-lg": "h-[52px] w-[52px] [&_svg]:size-6",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
      // Glow effect for primary CTAs
      glow: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      // Primary with glow
      {
        variant: "default",
        glow: true,
        className: "shadow-primary hover:shadow-[0_6px_20px_0_rgb(16_185_129_/_0.45)]",
      },
      // Accent with glow
      {
        variant: "accent",
        glow: true,
        className: "shadow-secondary hover:shadow-[0_6px_20px_0_rgb(249_115_22_/_0.45)]",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
      fullWidth: false,
      glow: false,
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
  loadingText?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    fullWidth,
    glow,
    asChild = false, 
    isLoading = false,
    loadingText = "Please wait...",
    children,
    disabled,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, fullWidth, glow, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin" />
            <span>{loadingText}</span>
          </>
        ) : (
          children
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
