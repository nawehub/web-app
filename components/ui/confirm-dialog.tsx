"use client";

import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./alert-dialog";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { AlertTriangle, Trash2, LogOut, XCircle, CheckCircle, HelpCircle, LucideIcon } from "lucide-react";

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  variant?: "default" | "destructive" | "warning" | "success";
  icon?: LucideIcon;
  isLoading?: boolean;
}

const variantConfig = {
  default: {
    icon: HelpCircle,
    iconClass: "text-primary bg-primary/10",
    buttonVariant: "default" as const,
  },
  destructive: {
    icon: Trash2,
    iconClass: "text-destructive bg-destructive/10",
    buttonVariant: "destructive" as const,
  },
  warning: {
    icon: AlertTriangle,
    iconClass: "text-warning bg-warning/10",
    buttonVariant: "warning" as const,
  },
  success: {
    icon: CheckCircle,
    iconClass: "text-success bg-success/10",
    buttonVariant: "success" as const,
  },
};

function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  variant = "default",
  icon,
  isLoading = false,
}: ConfirmDialogProps) {
  const config = variantConfig[variant];
  const Icon = icon || config.icon;

  const handleConfirm = async () => {
    await onConfirm();
    if (!isLoading) {
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-start gap-4">
            <div
              className={cn(
                "flex items-center justify-center w-12 h-12 rounded-full shrink-0",
                config.iconClass
              )}
            >
              <Icon className="w-6 h-6" />
            </div>
            <div className="flex-1 pt-1">
              <AlertDialogTitle className="text-lg font-semibold">
                {title}
              </AlertDialogTitle>
              {description && (
                <AlertDialogDescription className="mt-2 text-sm text-muted-foreground">
                  {description}
                </AlertDialogDescription>
              )}
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-6 flex-col-reverse sm:flex-row gap-2">
          <AlertDialogCancel asChild>
            <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
              {cancelLabel}
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant={config.buttonVariant}
              onClick={handleConfirm}
              isLoading={isLoading}
              loadingText="Processing..."
            >
              {confirmLabel}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Pre-built confirm dialog variants for common actions

interface DeleteConfirmDialogProps extends Omit<ConfirmDialogProps, "variant" | "title" | "description" | "confirmLabel"> {
  itemName?: string;
}

function DeleteConfirmDialog({
  itemName = "this item",
  ...props
}: DeleteConfirmDialogProps) {
  return (
    <ConfirmDialog
      {...props}
      variant="destructive"
      title={`Delete ${itemName}?`}
      description={`This action cannot be undone. ${itemName.charAt(0).toUpperCase() + itemName.slice(1)} will be permanently removed.`}
      confirmLabel="Delete"
      icon={Trash2}
    />
  );
}

interface LogoutConfirmDialogProps extends Omit<ConfirmDialogProps, "variant" | "title" | "description" | "confirmLabel"> {}

function LogoutConfirmDialog(props: LogoutConfirmDialogProps) {
  return (
    <ConfirmDialog
      {...props}
      variant="warning"
      title="Sign out?"
      description="You will need to sign in again to access your account."
      confirmLabel="Sign Out"
      icon={LogOut}
    />
  );
}

interface CancelConfirmDialogProps extends Omit<ConfirmDialogProps, "variant" | "title" | "description" | "confirmLabel"> {
  actionName?: string;
}

function CancelConfirmDialog({
  actionName = "this action",
  ...props
}: CancelConfirmDialogProps) {
  return (
    <ConfirmDialog
      {...props}
      variant="warning"
      title={`Cancel ${actionName}?`}
      description="Your progress will be lost and you'll need to start over."
      confirmLabel="Yes, Cancel"
      icon={XCircle}
    />
  );
}

// Hook for easier dialog management
export function useConfirmDialog() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const confirm = async (action: () => void | Promise<void>) => {
    setIsLoading(true);
    try {
      await action();
    } finally {
      setIsLoading(false);
      close();
    }
  };

  return {
    isOpen,
    isLoading,
    open,
    close,
    setIsOpen,
    confirm,
  };
}

export {
  ConfirmDialog,
  DeleteConfirmDialog,
  LogoutConfirmDialog,
  CancelConfirmDialog,
};

