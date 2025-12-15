"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { ProgressSteps, StepProgress, Step } from "./progress-steps";
import { ChevronLeft, ChevronRight, Check, Loader2 } from "lucide-react";

export interface FormStep {
  id: string;
  title: string;
  description?: string;
  /** Validation function - return true if step is valid */
  validate?: () => boolean | Promise<boolean>;
  /** Optional: content for the step */
  content?: React.ReactNode;
}

export interface MultiStepFormProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: FormStep[];
  currentStep: number;
  onStepChange: (step: number) => void;
  onComplete: () => void | Promise<void>;
  /** Allow navigating to completed steps */
  allowStepNavigation?: boolean;
  /** Show progress bar instead of steps */
  showProgressBar?: boolean;
  /** Loading state for submit */
  isSubmitting?: boolean;
  /** Custom labels */
  labels?: {
    next?: string;
    previous?: string;
    submit?: string;
    submitting?: string;
  };
  /** Disable next button (for external validation) */
  disableNext?: boolean;
  /** Content for each step (alternative to step.content) */
  children?: React.ReactNode;
}

function MultiStepForm({
  steps,
  currentStep,
  onStepChange,
  onComplete,
  allowStepNavigation = true,
  showProgressBar = false,
  isSubmitting = false,
  labels = {},
  disableNext = false,
  children,
  className,
  ...props
}: MultiStepFormProps) {
  const [isValidating, setIsValidating] = React.useState(false);

  const {
    next = "Continue",
    previous = "Back",
    submit = "Submit",
    submitting = "Submitting...",
  } = labels;

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  const currentStepData = steps[currentStep];

  const handleNext = async () => {
    if (isLastStep) {
      await onComplete();
      return;
    }

    // Validate current step before proceeding
    if (currentStepData.validate) {
      setIsValidating(true);
      try {
        const isValid = await currentStepData.validate();
        if (!isValid) {
          setIsValidating(false);
          return;
        }
      } catch {
        setIsValidating(false);
        return;
      }
      setIsValidating(false);
    }

    onStepChange(currentStep + 1);
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      onStepChange(currentStep - 1);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    if (allowStepNavigation && stepIndex < currentStep) {
      onStepChange(stepIndex);
    }
  };

  // Convert FormSteps to ProgressSteps format
  const progressSteps: Step[] = steps.map((step) => ({
    id: step.id,
    title: step.title,
    description: step.description,
  }));

  return (
    <div className={cn("w-full", className)} {...props}>
      {/* Progress Indicator */}
      <div className="mb-6 md:mb-8">
        {showProgressBar ? (
          <StepProgress
            currentStep={currentStep + 1}
            totalSteps={steps.length}
          />
        ) : (
          <ProgressSteps
            steps={progressSteps}
            currentStep={currentStep}
            onStepClick={allowStepNavigation ? handleStepClick : undefined}
          />
        )}
      </div>

      {/* Step Title (Mobile) */}
      <div className="mb-6 md:hidden">
        <h2 className="text-xl font-semibold font-display">
          {currentStepData.title}
        </h2>
        {currentStepData.description && (
          <p className="text-sm text-muted-foreground mt-1">
            {currentStepData.description}
          </p>
        )}
      </div>

      {/* Form Content */}
      <div className="mb-6">
        {currentStepData.content || children}
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 pt-4 border-t">
        {/* Previous Button */}
        <Button
          type="button"
          variant="outline"
          onClick={handlePrevious}
          disabled={isFirstStep || isSubmitting}
          className={cn(isFirstStep && "invisible")}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          {previous}
        </Button>

        {/* Next/Submit Button */}
        <Button
          type="button"
          onClick={handleNext}
          disabled={disableNext || isValidating || isSubmitting}
          isLoading={isSubmitting}
          loadingText={submitting}
          glow={isLastStep}
        >
          {isValidating ? (
            <>
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              Validating...
            </>
          ) : isLastStep ? (
            <>
              <Check className="w-4 h-4 mr-1" />
              {submit}
            </>
          ) : (
            <>
              {next}
              <ChevronRight className="w-4 h-4 ml-1" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

// Hook for managing multi-step form state
export function useMultiStepForm(totalSteps: number) {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [completedSteps, setCompletedSteps] = React.useState<Set<number>>(new Set());

  const goToStep = (step: number) => {
    if (step >= 0 && step < totalSteps) {
      setCurrentStep(step);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCompletedSteps((prev) => new Set([...prev, currentStep]));
      setCurrentStep((prev) => prev + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const reset = () => {
    setCurrentStep(0);
    setCompletedSteps(new Set());
  };

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;
  const isStepCompleted = (step: number) => completedSteps.has(step);

  return {
    currentStep,
    setCurrentStep: goToStep,
    nextStep,
    previousStep,
    reset,
    isFirstStep,
    isLastStep,
    isStepCompleted,
    completedSteps,
  };
}

export { MultiStepForm };

