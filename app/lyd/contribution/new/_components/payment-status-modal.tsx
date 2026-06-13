"use client"

import {useState, useEffect} from "react"
import {motion, AnimatePresence} from "framer-motion"
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button"
import {Badge} from "@/components/ui/badge"
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
import {cn} from "@/lib/utils"
import {ContributionResponse} from "@/lib/services/lyd";

// ─── Modal phases ─────────────────────────────────────────────────────────────
// "pending_code"     → PAYMENT_PENDING + actionUrlOrCode + usageInstructions
// "pending_checkout" → PAYMENT_PENDING + actionUrlOrCode (URL) + no instructions
// "awaiting"         → PAYMENT_REQUESTED but no actionUrlOrCode yet (rare edge case)
// Terminal phases arrive via SSE
export type Phase =
    | "awaiting"
    | "pending_code"
    | "pending_checkout"
    | "completed"
    | "cancelled"
    | "failed"
    | "expired"

function resolveInitialPhase(response: ContributionResponse): Phase {
  const {status, actionUrlOrCode, usageInstructions} = response
  if (status === "PAYMENT_PENDING" || status === "PAYMENT_REQUESTED") {
    if (actionUrlOrCode) {
      // Has instructions → USSD/payment code flow
      return usageInstructions ? "pending_code" : "pending_checkout"
    }
    return "awaiting"
  }
  // Unlikely on open, but handle defensively
  if (status === "PAYMENT_COMPLETED") return "completed"
  if (status === "PAYMENT_FAILED")    return "failed"
  if (status === "PAYMENT_CANCELLED") return "cancelled"
  if (status === "PAYMENT_EXPIRED")   return "expired"
  return "awaiting"
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface PaymentStatusModalProps {
  /** Full response returned synchronously from makeContribution() */
  contributionResponse: ContributionResponse | null
  open: boolean
  onCloseAction: () => void
  onSuccessAction: () => void
  /** Phase driven externally by the SSE hook lifted into the parent */
  ssePhase: Phase
  /** Countdown seconds driven externally (from onAttached expiresInSeconds) */
  sseCountdown: number | null
}

export function PaymentStatusModal({
                                     contributionResponse,
                                     open,
                                     onCloseAction,
                                     onSuccessAction,
                                     ssePhase,
                                     sseCountdown,
                                   }: PaymentStatusModalProps) {
  const [phase, setPhase] = useState<Phase>("awaiting")
  const [copied, setCopied] = useState(false)
  const [countdown, setCountdown] = useState<number | null>(null)

  // Sync phase from SSE (driven by parent)
  useEffect(() => {
    if (ssePhase !== "awaiting") setPhase(ssePhase)
  }, [ssePhase])

  // Sync countdown from SSE (driven by parent)
  useEffect(() => {
    if (sseCountdown !== null) setCountdown(sseCountdown)
  }, [sseCountdown])

  // Derive initial phase from the synchronous response as soon as modal opens
  useEffect(() => {
    if (open && contributionResponse) {
      setPhase(resolveInitialPhase(contributionResponse))
      setCopied(false)
      setCountdown(null)
    }
  }, [open, contributionResponse?.contributionId])

  // Countdown ticker
  useEffect(() => {
    if (countdown === null || countdown <= 0) return
    const t = setInterval(() => setCountdown(c => (c && c > 0 ? c - 1 : 0)), 1_000)
    return () => clearInterval(t)
  }, [countdown])

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2_000)
  }

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`

  const isTerminal  = ["completed", "cancelled", "failed", "expired"].includes(phase)
  const canDismiss  = isTerminal || phase === "pending_code" || phase === "pending_checkout"

  const response = contributionResponse!

  return (
      <Dialog
          open={open}
          onOpenChange={o => { if (!o && canDismiss) onCloseAction() }}
      >
        <DialogContent
            className="sm:max-w-[440px] border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-0 overflow-hidden"
            onPointerDownOutside={e => { if (!canDismiss) e.preventDefault() }}
            onEscapeKeyDown={e => { if (!canDismiss) e.preventDefault() }}
        >
          {/* Phase-coloured progress strip */}
          <div className={cn(
              "h-1.5 w-full transition-colors duration-500",
              phase === "awaiting"                                    ? "bg-zinc-300 dark:bg-zinc-700 animate-pulse"
                  : phase === "pending_code" || phase === "pending_checkout" ? "bg-amber-400"
                      : phase === "completed"                                 ? "bg-emerald-500"
                          : "bg-red-400"
          )}/>

          <div className="p-6 space-y-5">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-base font-semibold">
                {phase === "awaiting"         && <Loader2 className="h-4 w-4 animate-spin text-zinc-400"/>}
                {phase === "pending_code"     && <Smartphone className="h-4 w-4 text-amber-500"/>}
                {phase === "pending_checkout" && <CreditCard className="h-4 w-4 text-blue-500"/>}
                {phase === "completed"        && <CheckCircle2 className="h-4 w-4 text-emerald-500"/>}
                {isTerminal && phase !== "completed" && <XCircle className="h-4 w-4 text-red-500"/>}

                {phase === "awaiting"         && "Setting up payment…"}
                {phase === "pending_code"     && "Complete via Mobile Money"}
                {phase === "pending_checkout" && "Complete via Checkout"}
                {phase === "completed"        && "Payment confirmed"}
                {phase === "cancelled"        && "Payment cancelled"}
                {phase === "failed"           && "Payment failed"}
                {phase === "expired"          && "Payment expired"}
              </DialogTitle>
            </DialogHeader>

            <AnimatePresence mode="wait">

              {/* ── Awaiting ── */}
              {phase === "awaiting" && (
                  <motion.div key="awaiting"
                              initial={{opacity: 0, y: 6}} animate={{opacity: 1, y: 0}} exit={{opacity: 0}}
                              className="flex flex-col items-center gap-4 py-8"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                      <Loader2 className="h-8 w-8 text-zinc-400 animate-spin"/>
                    </div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center">
                      Connecting to payment provider…
                    </p>
                  </motion.div>
              )}

              {/* ── Payment Code (USSD / Mobile Money) ── */}
              {phase === "pending_code" && response && (
                  <motion.div key="pending_code"
                              initial={{opacity: 0, y: 6}} animate={{opacity: 1, y: 0}} exit={{opacity: 0}}
                              className="space-y-4"
                  >
                    {/* Instructions box */}
                    {response.usageInstructions && (
                        <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20 p-4">
                          <p className="font-semibold text-amber-900 dark:text-amber-200 text-sm mb-3">
                            {response.usageInstructions.title}
                          </p>
                          <ol className="space-y-2">
                            {response.usageInstructions.steps.map((step, i) => (
                                <li key={i} className="flex gap-3 text-sm text-amber-800 dark:text-amber-300">
                                                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-200 dark:bg-amber-800 flex items-center justify-center text-xs font-bold">
                                                        {i + 1}
                                                    </span>
                                  {step}
                                </li>
                            ))}
                          </ol>
                          {response.usageInstructions.expiryMessage && (
                              <p className="mt-3 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                                <Clock className="h-3 w-3 flex-shrink-0"/>
                                {response.usageInstructions.expiryMessage}
                              </p>
                          )}
                        </div>
                    )}

                    {/* Code block */}
                    <div className="rounded-xl bg-zinc-950 dark:bg-zinc-800 p-4 flex items-center justify-between gap-3">
                                    <span className="font-mono text-xl font-bold text-white tracking-widest select-all">
                                        {response.actionUrlOrCode}
                                    </span>
                      <Button
                          size="sm" variant="ghost"
                          onClick={() => copy(response.actionUrlOrCode)}
                          className="text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg shrink-0"
                      >
                        {copied
                            ? <Check className="h-4 w-4 text-emerald-400"/>
                            : <Copy className="h-4 w-4"/>
                        }
                      </Button>
                    </div>

                    {/* Countdown + waiting pill */}
                    <div className="flex items-center justify-between">
                      {countdown !== null && countdown > 0 ? (
                          <span className={cn(
                              "text-sm font-mono font-semibold flex items-center gap-1",
                              countdown < 60 ? "text-red-500" : "text-zinc-500 dark:text-zinc-400"
                          )}>
                                            <Clock className="h-3.5 w-3.5"/>
                            {fmt(countdown)}
                                        </span>
                      ) : <span/>}

                      <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                        <Loader2 className="h-3.5 w-3.5 animate-spin"/>
                        Awaiting confirmation…
                      </div>
                    </div>
                  </motion.div>
              )}

              {/* ── Checkout Session ── */}
              {phase === "pending_checkout" && response && (
                  <motion.div key="pending_checkout"
                              initial={{opacity: 0, y: 6}} animate={{opacity: 1, y: 0}} exit={{opacity: 0}}
                              className="space-y-4"
                  >
                    <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20 p-4">
                      <p className="text-sm text-blue-800 dark:text-blue-300">
                        Click below to open the secure payment page in a new tab. You will be automatically returned here once completed.
                      </p>
                    </div>

                    <Button
                        className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold"
                        onClick={() => window.open(response.actionUrlOrCode, "_blank")}
                    >
                      <CreditCard className="mr-2 h-4 w-4"/>
                      Open Payment Page
                    </Button>

                    {countdown !== null && countdown > 0 && (
                        <p className={cn(
                            "text-center text-sm font-mono flex items-center justify-center gap-1",
                            countdown < 60 ? "text-red-500" : "text-zinc-500 dark:text-zinc-400"
                        )}>
                          <Clock className="h-3.5 w-3.5"/>
                          Session expires in {fmt(countdown)}
                        </p>
                    )}

                    <div className="flex items-center justify-center gap-1.5 text-xs text-zinc-400">
                      <Loader2 className="h-3.5 w-3.5 animate-spin"/>
                      Awaiting payment confirmation…
                    </div>
                  </motion.div>
              )}

              {/* ── Completed ── */}
              {phase === "completed" && (
                  <motion.div key="completed"
                              initial={{opacity: 0, scale: 0.9}} animate={{opacity: 1, scale: 1}} exit={{opacity: 0}}
                              className="flex flex-col items-center gap-4 py-8"
                  >
                    <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center">
                      <CheckCircle2 className="h-10 w-10 text-emerald-500"/>
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-xl font-bold text-zinc-900 dark:text-white">Thank you! 🎉</p>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Your contribution has been received. Thanks for your generosity!
                      </p>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800">
                      Payment Confirmed
                    </Badge>
                  </motion.div>
              )}

              {/* ── Terminal failures ── */}
              {(phase === "cancelled" || phase === "failed" || phase === "expired") && (
                  <motion.div key="error"
                              initial={{opacity: 0, scale: 0.9}} animate={{opacity: 1, scale: 1}} exit={{opacity: 0}}
                              className="flex flex-col items-center gap-4 py-6"
                  >
                    <div className={cn(
                        "w-16 h-16 rounded-2xl flex items-center justify-center",
                        phase === "expired"
                            ? "bg-amber-50 dark:bg-amber-950/30"
                            : "bg-red-50 dark:bg-red-950/30"
                    )}>
                      {phase === "expired"
                          ? <Clock className="h-8 w-8 text-amber-500"/>
                          : <AlertTriangle className="h-8 w-8 text-red-500"/>
                      }
                    </div>
                    <div className="text-center space-y-1">
                      <p className="font-semibold text-zinc-900 dark:text-white">
                        {phase === "cancelled" ? "Payment was cancelled"
                            : phase === "expired"  ? "Payment window expired"
                                : "Payment failed"}
                      </p>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        {phase === "expired"
                            ? "The payment time limit was reached. Please try again."
                            : "Something went wrong. Please try again."}
                      </p>
                    </div>
                    <Button onClick={onCloseAction} variant="outline" className="rounded-xl gap-2">
                      <RefreshCw className="h-4 w-4"/>
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