"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle2,
  XCircle,
  Clock,
  Smartphone,
  CreditCard,
  Copy,
  Check,
  Loader2,
  AlertTriangle,
  RefreshCw,
} from "lucide-react"
import { usePaymentSse } from "@/app/lyd/hooks/use-sse"
import type { PaymentAttachedPayload, PaymentTerminalPayload } from "@/app/lyd/types/sse"
import { cn } from "@/lib/utils"

type Phase =
  | "waiting"     // waiting for PAYMENT_ATTACHED event
  | "code"        // PAYMENT_CODE received - show USSD code + instructions
  | "checkout"    // CHECKOUT_SESSION received - show open-link button
  | "completed"
  | "cancelled"
  | "failed"
  | "expired"

interface PaymentStatusModalProps {
  contributionId: string | null
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export function PaymentStatusModal({
  contributionId,
  open,
  onClose,
  onSuccess,
}: PaymentStatusModalProps) {
  const [phase, setPhase] = useState<Phase>("waiting")
  const [attached, setAttached] = useState<PaymentAttachedPayload | null>(null)
  const [terminal, setTerminal] = useState<PaymentTerminalPayload | null>(null)
  const [copied, setCopied] = useState(false)
  const [countdown, setCountdown] = useState<number | null>(null)

  // Reset when modal opens with a new contribution
  useEffect(() => {
    if (open && contributionId) {
      setPhase("waiting")
      setAttached(null)
      setTerminal(null)
      setCopied(false)
      setCountdown(null)
    }
  }, [open, contributionId])

  // Countdown ticker
  useEffect(() => {
    if (countdown === null || countdown <= 0) return
    const t = setInterval(() => setCountdown(c => (c !== null && c > 0 ? c - 1 : 0)), 1_000)
    return () => clearInterval(t)
  }, [countdown !== null && countdown > 0]) // only start/stop when crossing boundary

  usePaymentSse({
    contributionId: open ? contributionId : null,

    onAttached: (data) => {
      setAttached(data)
      setPhase(data.payment.type === "PAYMENT_CODE" ? "code" : "checkout")
      if (data.payment.expiresInSeconds > 0) setCountdown(data.payment.expiresInSeconds)
    },

    onTerminal: (data) => {
      setTerminal(data)
      setCountdown(null)
      switch (data.status) {
        case "PAYMENT_COMPLETED":
          setPhase("completed")
          setTimeout(onSuccess, 2_200)
          break
        case "PAYMENT_CANCELLED": setPhase("cancelled"); break
        case "PAYMENT_FAILED":    setPhase("failed");    break
        case "PAYMENT_EXPIRED":   setPhase("expired");   break
      }
    },

    onError: () => {
      // SSE error during payment - don't close, let user see status
    },
  })

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2_000)
  }

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`

  const isTerminal = ["completed", "cancelled", "failed", "expired"].includes(phase)
  const canClose = phase !== "waiting" && phase !== "completed"

  return (
    <Dialog open={open} onOpenChange={o => { if (!o && canClose) onClose() }}>
      <DialogContent
        className="sm:max-w-[420px] border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-0 overflow-hidden"
        onPointerDownOutside={e => { if (!canClose) e.preventDefault() }}
        onEscapeKeyDown={e => { if (!canClose) e.preventDefault() }}
      >
        {/* Coloured top strip based on phase */}
        <div className={cn(
          "h-1.5 w-full",
          phase === "waiting"                      ? "bg-zinc-200 dark:bg-zinc-700 animate-pulse"
          : phase === "code" || phase === "checkout" ? "bg-amber-400"
          : phase === "completed"                  ? "bg-emerald-500"
          : "bg-red-400"
        )} />

        <div className="p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="flex items-center gap-2 text-base">
              {phase === "waiting" && <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />}
              {phase === "code"    && <Smartphone className="h-4 w-4 text-amber-500" />}
              {phase === "checkout" && <CreditCard className="h-4 w-4 text-blue-500" />}
              {phase === "completed" && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
              {(phase === "cancelled" || phase === "failed" || phase === "expired") && (
                <XCircle className="h-4 w-4 text-red-500" />
              )}

              {phase === "waiting"  && "Setting up payment…"}
              {phase === "code"     && "Complete via Mobile Money"}
              {phase === "checkout" && "Complete via Checkout"}
              {phase === "completed" && "Payment confirmed"}
              {phase === "cancelled" && "Payment cancelled"}
              {phase === "failed"    && "Payment failed"}
              {phase === "expired"   && "Payment expired"}
            </DialogTitle>
          </DialogHeader>

          <AnimatePresence mode="wait">
            {/* ── Waiting ── */}
            {phase === "waiting" && (
              <motion.div
                key="waiting"
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-4 py-8"
              >
                <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 text-zinc-400 animate-spin" />
                </div>
                <div className="text-center space-y-1">
                  <p className="font-medium text-zinc-900 dark:text-white">Connecting to payment provider</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">This usually takes a few seconds…</p>
                </div>
              </motion.div>
            )}

            {/* ── PAYMENT_CODE ── */}
            {phase === "code" && attached && (
              <motion.div
                key="code"
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {/* Instructions */}
                {attached.payment.instruction && (
                  <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20 p-4">
                    <p className="font-semibold text-amber-900 dark:text-amber-200 mb-3 text-sm">
                      {attached.payment.instruction.title}
                    </p>
                    <ol className="space-y-2">
                      {attached.payment.instruction.steps.map((step, i) => (
                        <li key={i} className="flex gap-3 text-sm text-amber-800 dark:text-amber-300">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-200 dark:bg-amber-800 flex items-center justify-center text-xs font-bold">
                            {i + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                    {attached.payment.instruction.expiryMessage && (
                      <p className="mt-3 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        <Clock className="h-3 w-3 flex-shrink-0" />
                        {attached.payment.instruction.expiryMessage}
                      </p>
                    )}
                  </div>
                )}

                {/* Code block */}
                <div className="rounded-xl bg-zinc-950 dark:bg-zinc-800 p-4 flex items-center justify-between gap-3">
                  <span className="font-mono text-xl font-bold text-white tracking-widest">
                    {attached.payment.actionUrlCode}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copy(attached.payment.actionUrlCode)}
                    className="text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg shrink-0"
                  >
                    {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>

                {/* Countdown + waiting pill */}
                <div className="flex items-center justify-between">
                  {countdown !== null && countdown > 0 ? (
                    <span className={cn(
                      "text-sm font-mono font-semibold",
                      countdown < 60 ? "text-red-500" : "text-zinc-500 dark:text-zinc-400"
                    )}>
                      <Clock className="h-3.5 w-3.5 inline mr-1 -mt-px" />
                      {fmt(countdown)}
                    </span>
                  ) : <span />}

                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Awaiting confirmation…
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── CHECKOUT_SESSION ── */}
            {phase === "checkout" && attached && (
              <motion.div
                key="checkout"
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20 p-4">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    Click the button below to open the secure payment page in a new tab. Return here once complete.
                  </p>
                </div>

                <Button
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold"
                  onClick={() => window.open(attached.payment.actionUrlCode, "_blank")}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Open Payment Page
                </Button>

                {countdown !== null && countdown > 0 && (
                  <p className={cn(
                    "text-center text-sm font-mono",
                    countdown < 60 ? "text-red-500" : "text-zinc-500 dark:text-zinc-400"
                  )}>
                    <Clock className="h-3.5 w-3.5 inline mr-1 -mt-px" />
                    Session expires in {fmt(countdown)}
                  </p>
                )}

                <div className="flex items-center justify-center gap-2 text-xs text-zinc-400">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Awaiting payment confirmation…
                </div>
              </motion.div>
            )}

            {/* ── Completed ── */}
            {phase === "completed" && (
              <motion.div
                key="completed"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-4 py-8"
              >
                <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center">
                  <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-xl font-bold text-zinc-900 dark:text-white">Thank you! 🎉</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Your contribution has been received. Every Leone counts!
                  </p>
                </div>
                <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800">
                  Payment Confirmed
                </Badge>
              </motion.div>
            )}

            {/* ── Terminal failures ── */}
            {(phase === "cancelled" || phase === "failed" || phase === "expired") && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-4 py-6"
              >
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center",
                  phase === "expired"
                    ? "bg-amber-50 dark:bg-amber-950/30"
                    : "bg-red-50 dark:bg-red-950/30"
                )}>
                  {phase === "expired"
                    ? <Clock className="h-8 w-8 text-amber-500" />
                    : <AlertTriangle className="h-8 w-8 text-red-500" />
                  }
                </div>
                <div className="text-center space-y-1">
                  <p className="font-semibold text-zinc-900 dark:text-white">
                    {phase === "cancelled" ? "Payment was cancelled"
                     : phase === "expired" ? "Payment window expired"
                     : "Payment failed"}
                  </p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {phase === "expired"
                      ? "The payment time limit was reached. Please try again."
                      : "Something went wrong. Please try again."}
                  </p>
                </div>
                <Button onClick={onClose} variant="outline" className="rounded-xl gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  )
}
