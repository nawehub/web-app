"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  Clock,
  Smartphone,
  CreditCard,
  Copy,
  Check,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { usePaymentSse } from "@/hooks/use-sse";
import type { PaymentAttachedPayload, PaymentTerminalPayload } from "@/types/sse";
import { cn } from "@/lib/utils";

type PaymentPhase =
  | "waiting_attachment" // contribution created, waiting for payment provider response
  | "pending"           // PAYMENT_CODE or CHECKOUT_SESSION received
  | "completed"
  | "cancelled"
  | "failed"
  | "expired";

interface PaymentStatusModalProps {
  contributionId: string | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function PaymentStatusModal({
  contributionId,
  open,
  onClose,
  onSuccess,
}: PaymentStatusModalProps) {
  const [phase, setPhase] = useState<PaymentPhase>("waiting_attachment");
  const [attached, setAttached] = useState<PaymentAttachedPayload | null>(null);
  const [terminal, setTerminal] = useState<PaymentTerminalPayload | null>(null);
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  // Reset when a new contribution starts
  useEffect(() => {
    if (open && contributionId) {
      setPhase("waiting_attachment");
      setAttached(null);
      setTerminal(null);
      setCopied(false);
      setCountdown(null);
    }
  }, [open, contributionId]);

  // Countdown timer
  useEffect(() => {
    if (countdown === null || countdown <= 0) return;
    const t = setInterval(() => setCountdown((c) => (c !== null ? c - 1 : null)), 1000);
    return () => clearInterval(t);
  }, [countdown]);

  usePaymentSse({
    contributionId: open ? contributionId : null,
    onAttached: (data) => {
      setAttached(data);
      setPhase("pending");
      setCountdown(data.payment.expiresInSeconds ?? null);
    },
    onTerminal: (data) => {
      setTerminal(data);
      switch (data.status) {
        case "PAYMENT_COMPLETED":
          setPhase("completed");
          setTimeout(onSuccess, 2500);
          break;
        case "PAYMENT_CANCELLED":
          setPhase("cancelled");
          break;
        case "PAYMENT_FAILED":
          setPhase("failed");
          break;
        case "PAYMENT_EXPIRED":
          setPhase("expired");
          break;
      }
    },
  });

  const copyCode = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {phase === "waiting_attachment" && (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-rose-500" />
                Processing Contribution
              </>
            )}
            {phase === "pending" && (
              <>
                {attached?.payment.type === "PAYMENT_CODE" ? (
                  <Smartphone className="h-4 w-4 text-amber-500" />
                ) : (
                  <CreditCard className="h-4 w-4 text-blue-500" />
                )}
                Complete Your Payment
              </>
            )}
            {phase === "completed" && (
              <>
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                Payment Successful
              </>
            )}
            {(phase === "cancelled" || phase === "failed" || phase === "expired") && (
              <>
                <XCircle className="h-4 w-4 text-red-500" />
                Payment{" "}
                {phase === "cancelled"
                  ? "Cancelled"
                  : phase === "expired"
                  ? "Expired"
                  : "Failed"}
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {/* Waiting for attachment */}
          {phase === "waiting_attachment" && (
            <motion.div
              key="waiting"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex flex-col items-center gap-4 py-8"
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 text-rose-500 animate-spin" />
                </div>
              </div>
              <div className="text-center">
                <p className="font-medium text-zinc-900 dark:text-white">
                  Setting up your payment
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  Connecting to payment provider…
                </p>
              </div>
            </motion.div>
          )}

          {/* Payment Code */}
          {phase === "pending" && attached?.payment.type === "PAYMENT_CODE" && (
            <motion.div
              key="payment-code"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-4"
            >
              {/* Instructions */}
              {attached.payment.instruction && (
                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                  <p className="font-semibold text-amber-800 dark:text-amber-200 mb-3">
                    {attached.payment.instruction.title}
                  </p>
                  <ol className="space-y-2">
                    {attached.payment.instruction.steps.map((step, i) => (
                      <li key={i} className="flex gap-3 text-sm text-amber-700 dark:text-amber-300">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-200 dark:bg-amber-800 flex items-center justify-center text-xs font-bold">
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                  {attached.payment.instruction.expiryMessage && (
                    <p className="mt-3 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {attached.payment.instruction.expiryMessage}
                    </p>
                  )}
                </div>
              )}

              {/* USSD Code */}
              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">USSD Code</p>
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-xl font-bold text-zinc-900 dark:text-white tracking-wider">
                    {attached.payment.actionUrlCode}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyCode(attached.payment.actionUrlCode)}
                    className="rounded-lg shrink-0"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Countdown */}
              {countdown !== null && countdown > 0 && (
                <div className="flex items-center justify-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                  <Clock className="h-4 w-4" />
                  Expires in{" "}
                  <span
                    className={cn(
                      "font-mono font-semibold",
                      countdown < 60 ? "text-red-500" : "text-zinc-700 dark:text-zinc-300"
                    )}
                  >
                    {formatCountdown(countdown)}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900">
                <Loader2 className="h-4 w-4 text-blue-500 animate-spin shrink-0" />
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Waiting for payment confirmation…
                </p>
              </div>
            </motion.div>
          )}

          {/* Checkout Session */}
          {phase === "pending" && attached?.payment.type === "CHECKOUT_SESSION" && (
            <motion.div
              key="checkout"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-4"
            >
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                <p className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                  Complete your payment
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Click the button below to open the secure payment page.
                </p>
              </div>

              <Button
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl h-12"
                onClick={() => window.open(attached.payment.actionUrlCode, "_blank")}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Open Payment Page
              </Button>

              {countdown !== null && countdown > 0 && (
                <div className="flex items-center justify-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                  <Clock className="h-4 w-4" />
                  Session expires in{" "}
                  <span
                    className={cn(
                      "font-mono font-semibold",
                      countdown < 60 ? "text-red-500" : "text-zinc-700 dark:text-zinc-300"
                    )}
                  >
                    {formatCountdown(countdown)}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                <Loader2 className="h-4 w-4 text-zinc-500 animate-spin shrink-0" />
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Waiting for payment confirmation…
                </p>
              </div>
            </motion.div>
          )}

          {/* Completed */}
          {phase === "completed" && (
            <motion.div
              key="completed"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-4 py-8"
            >
              <div className="w-20 h-20 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-emerald-500" />
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-zinc-900 dark:text-white">
                  Thank you! 🎉
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  Your contribution has been received. Every Leone counts!
                </p>
              </div>
              <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800">
                Payment Confirmed
              </Badge>
            </motion.div>
          )}

          {/* Terminal failure states */}
          {(phase === "cancelled" || phase === "failed" || phase === "expired") && (
            <motion.div
              key="terminal-error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-4 py-6"
            >
              <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center">
                {phase === "expired" ? (
                  <Clock className="h-8 w-8 text-amber-500" />
                ) : (
                  <AlertCircle className="h-8 w-8 text-red-500" />
                )}
              </div>
              <div className="text-center">
                <p className="font-semibold text-zinc-900 dark:text-white">
                  {phase === "cancelled"
                    ? "Payment was cancelled"
                    : phase === "expired"
                    ? "Payment session expired"
                    : "Payment failed"}
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  {phase === "expired"
                    ? "The payment window has closed. Please try again."
                    : "Something went wrong. You can try again."}
                </p>
              </div>
              <Button
                onClick={onClose}
                variant="outline"
                className="rounded-xl"
              >
                Try Again
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
