import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const inputVariants = cva(
  // Base styles - mobile-first with 44px min touch target
  "flex w-full rounded-md border bg-background text-base ring-offset-background transition-colors duration-fast file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-neutral-100 dark:disabled:bg-neutral-800",
  {
    variants: {
      variant: {
        default: "border-input focus-visible:border-primary",
        error: "border-error focus-visible:ring-error/50 bg-error/5",
        success: "border-success focus-visible:ring-success/50 bg-success/5",
      },
      inputSize: {
        sm: "h-9 px-3 text-sm",
        default: "h-11 px-4 text-base md:text-sm", // 44px touch target
        lg: "h-[52px] px-4 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",
    },
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  /** Error message to display */
  error?: string
  /** Success message to display */
  success?: string
  /** Helper text below the input */
  helperText?: string
  /** Left icon/addon */
  leftIcon?: React.ReactNode
  /** Right icon/addon */
  rightIcon?: React.ReactNode
  /** Input label */
  label?: string
  /** Is field required */
  required?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type, 
    variant,
    inputSize,
    error,
    success,
    helperText,
    leftIcon,
    rightIcon,
    label,
    required,
    id,
    ...props 
  }, ref) => {
    // Determine variant based on error/success state
    const computedVariant = error ? "error" : success ? "success" : variant

    // Generate ID if not provided
    const inputId = id || `input-${React.useId()}`

    // If we have a label, wrap in a field group
    if (label || helperText || error || success) {
      return (
        <div className="space-y-1.5">
          {label && (
            <label 
              htmlFor={inputId}
              className={cn(
                "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                error && "text-error",
                success && "text-success"
              )}
            >
              {label}
              {required && <span className="text-error ml-0.5">*</span>}
            </label>
          )}
          <div className="relative">
            {leftIcon && (
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {leftIcon}
              </div>
            )}
            <input
              id={inputId}
              type={type}
              className={cn(
                inputVariants({ variant: computedVariant, inputSize }),
                leftIcon && "pl-10",
                rightIcon && "pr-10",
                className
              )}
              ref={ref}
              aria-invalid={!!error}
              aria-describedby={error || success || helperText ? `${inputId}-helper` : undefined}
              {...props}
            />
            {rightIcon && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {rightIcon}
              </div>
            )}
          </div>
          {(error || success || helperText) && (
            <p 
              id={`${inputId}-helper`}
              className={cn(
                "text-sm",
                error && "text-error",
                success && "text-success",
                !error && !success && "text-muted-foreground"
              )}
            >
              {error || success || helperText}
            </p>
          )}
        </div>
      )
    }

    // Simple input without wrapper
    return (
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          type={type}
          className={cn(
            inputVariants({ variant: computedVariant, inputSize }),
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            className
          )}
          ref={ref}
          aria-invalid={!!error}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {rightIcon}
          </div>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input, inputVariants }
