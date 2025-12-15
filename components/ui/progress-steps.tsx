"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

export interface Step {
  id: string
  title: string
  description?: string
}

export interface ProgressStepsProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: Step[]
  currentStep: number
  /** Orientation of the steps */
  orientation?: "horizontal" | "vertical"
  /** Show step numbers instead of dots */
  showNumbers?: boolean
  /** Callback when a completed step is clicked */
  onStepClick?: (stepIndex: number) => void
}

function ProgressSteps({
  steps,
  currentStep,
  orientation = "horizontal",
  showNumbers = false,
  onStepClick,
  className,
  ...props
}: ProgressStepsProps) {
  const isHorizontal = orientation === "horizontal"

  return (
    <div
      className={cn(
        isHorizontal
          ? "flex items-start justify-between"
          : "flex flex-col gap-4",
        className
      )}
      role="navigation"
      aria-label="Progress steps"
      {...props}
    >
      {steps.map((step, index) => {
        const isCompleted = index < currentStep
        const isCurrent = index === currentStep
        const isClickable = isCompleted && onStepClick

        return (
          <React.Fragment key={step.id}>
            <div
              className={cn(
                isHorizontal
                  ? "flex flex-col items-center flex-1"
                  : "flex items-start gap-4",
                isClickable && "cursor-pointer"
              )}
              onClick={() => isClickable && onStepClick(index)}
              role={isClickable ? "button" : undefined}
              tabIndex={isClickable ? 0 : undefined}
              onKeyDown={(e) => {
                if (isClickable && (e.key === "Enter" || e.key === " ")) {
                  e.preventDefault()
                  onStepClick(index)
                }
              }}
            >
              {/* Step indicator */}
              <div
                className={cn(
                  "relative flex items-center justify-center shrink-0",
                  "w-10 h-10 rounded-full border-2 transition-all duration-normal",
                  isCompleted && "bg-primary border-primary text-primary-foreground",
                  isCurrent && "border-primary bg-primary/10 text-primary",
                  !isCompleted && !isCurrent && "border-neutral-300 dark:border-neutral-700 text-muted-foreground"
                )}
                aria-current={isCurrent ? "step" : undefined}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" strokeWidth={3} />
                ) : showNumbers ? (
                  <span className="text-sm font-semibold">{index + 1}</span>
                ) : (
                  <span
                    className={cn(
                      "w-3 h-3 rounded-full",
                      isCurrent ? "bg-primary" : "bg-neutral-300 dark:bg-neutral-700"
                    )}
                  />
                )}
              </div>

              {/* Step content */}
              <div
                className={cn(
                  isHorizontal ? "mt-2 text-center" : "",
                  "transition-opacity duration-normal",
                  !isCompleted && !isCurrent && "opacity-50"
                )}
              >
                <p
                  className={cn(
                    "text-sm font-medium",
                    (isCompleted || isCurrent) && "text-foreground"
                  )}
                >
                  {step.title}
                </p>
                {step.description && (
                  <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">
                    {step.description}
                  </p>
                )}
              </div>
            </div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "shrink-0",
                  isHorizontal
                    ? "flex-1 h-0.5 mt-5 mx-2 sm:mx-4"
                    : "w-0.5 h-6 ml-[18px]",
                  isCompleted
                    ? "bg-primary"
                    : "bg-neutral-200 dark:bg-neutral-800"
                )}
                aria-hidden="true"
              />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

// Simple progress bar variant
export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Current progress value (0-100) */
  value: number
  /** Show percentage text */
  showValue?: boolean
  /** Size variant */
  size?: "sm" | "default" | "lg"
  /** Color variant */
  variant?: "default" | "success" | "warning" | "error"
}

function ProgressBar({
  value,
  showValue = false,
  size = "default",
  variant = "default",
  className,
  ...props
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value))

  const sizeClasses = {
    sm: "h-1",
    default: "h-2",
    lg: "h-3",
  }

  const variantClasses = {
    default: "bg-primary",
    success: "bg-success",
    warning: "bg-warning",
    error: "bg-error",
  }

  return (
    <div className={cn("w-full", className)} {...props}>
      <div
        className={cn(
          "w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden",
          sizeClasses[size]
        )}
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-slow ease-out",
            variantClasses[variant]
          )}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
      {showValue && (
        <p className="text-sm text-muted-foreground mt-1 text-right">
          {Math.round(clampedValue)}%
        </p>
      )}
    </div>
  )
}

// Step progress with text
export interface StepProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  currentStep: number
  totalSteps: number
  stepLabel?: string
}

function StepProgress({
  currentStep,
  totalSteps,
  stepLabel = "Step",
  className,
  ...props
}: StepProgressProps) {
  const progress = (currentStep / totalSteps) * 100

  return (
    <div className={cn("space-y-2", className)} {...props}>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">
          {stepLabel} {currentStep} of {totalSteps}
        </span>
        <span className="text-muted-foreground">
          {Math.round(progress)}%
        </span>
      </div>
      <ProgressBar value={progress} />
    </div>
  )
}

export { ProgressSteps, ProgressBar, StepProgress }

