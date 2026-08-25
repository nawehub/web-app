import {useEffect, useRef, useState} from "react";
import {cn} from "@/lib/utils";
import {Calendar, X} from "lucide-react";
import {Button} from "@/components/ui/button";

type DeadlinePreset = 'anytime' | 'this-week' | 'this-month' | 'next-3-months' | 'custom'

export interface DeadlineRange {
    preset: DeadlinePreset
    from: string   // ISO date string, e.g. '2026-06-01'
    to: string
}

const DEADLINE_PRESETS: { id: DeadlinePreset; label: string }[] = [
    { id: 'anytime',       label: 'Any time'       },
    { id: 'this-week',     label: 'This week'      },
    { id: 'this-month',    label: 'This month'     },
    { id: 'next-3-months', label: 'Next 3 months'  },
    { id: 'custom',        label: 'Custom range'   },
]

function resolvePresetDates(preset: DeadlinePreset): { from: string; to: string } {
    const now = new Date()
    const pad = (n: number) => String(n).padStart(2, '0')
    const fmt = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

    if (preset === 'this-week') {
        const start = new Date(now); start.setDate(now.getDate() - now.getDay())
        const end   = new Date(start); end.setDate(start.getDate() + 6)
        return { from: fmt(start), to: fmt(end) }
    }
    if (preset === 'this-month') {
        const start = new Date(now.getFullYear(), now.getMonth(), 1)
        const end   = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        return { from: fmt(start), to: fmt(end) }
    }
    if (preset === 'next-3-months') {
        const end = new Date(now); end.setMonth(now.getMonth() + 3)
        return { from: fmt(now), to: fmt(end) }
    }
    return { from: '', to: '' }
}

export function DeadlineFilter({
                            value,
                            onChange,
                        }: {
    value: DeadlineRange
    onChange: (next: DeadlineRange) => void
}) {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    // Close on outside click
    useEffect(() => {
        function onDown(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener('mousedown', onDown)
        return () => document.removeEventListener('mousedown', onDown)
    }, [])

    const selectPreset = (id: DeadlinePreset) => {
        if (id === 'custom') {
            onChange({ preset: 'custom', from: value.from || '', to: value.to || '' })
            return
        }
        const { from, to } = resolvePresetDates(id)
        onChange({ preset: id, from, to })
        setOpen(false)
    }

    const activeLabel = DEADLINE_PRESETS.find(p => p.id === value.preset)?.label ?? 'Any time'
    const hasCustom   = value.preset === 'custom'
    const isActive    = value.preset !== 'anytime'

    return (
        <div ref={ref} className="relative">
            {/* Trigger */}
            <Button
                type="button"
                onClick={() => setOpen(o => !o)}
                className={cn(
                    'flex h-10 items-center gap-2 border px-3 text-sm transition-colors',
                    isActive
                        ? 'border-primary bg-primary/10 font-medium text-primary'
                        : 'border-input bg-background text-foreground hover:border-primary/50',
                )}
            >
                <Calendar className="h-4 w-4 shrink-0" />
                <span className="max-w-[120px] truncate">{
                    value.preset === 'custom' && (value.from || value.to)
                        ? `${value.from || '…'} → ${value.to || '…'}`
                        : activeLabel
                }</span>
                {isActive && (
                    <span
                        role="button"
                        aria-label="Clear deadline filter"
                        onClick={(e) => { e.stopPropagation(); onChange({ preset: 'anytime', from: '', to: '' }) }}
                        className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full hover:bg-primary/20"
                    >
                        <X className="h-3 w-3" />
                    </span>
                )}
            </Button>

            {/* Dropdown panel */}
            {open && (
                <div className="absolute left-0 top-12 z-50 w-80 rounded-2xl border border-border bg-card shadow-[var(--shadow-lg)]">
                    {/* Preset pills */}
                    <div className="p-4">
                        <p className="mb-3 text-xs font-semibold tracking-wider text-muted-foreground">
                            Application deadline
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {DEADLINE_PRESETS.map(p => (
                                <button
                                    key={p.id}
                                    type="button"
                                    onClick={() => selectPreset(p.id)}
                                    className={cn(
                                        'rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors',
                                        value.preset === p.id
                                            ? 'border-primary bg-primary text-primary-foreground'
                                            : 'border-border text-muted-foreground hover:border-primary hover:text-primary',
                                    )}
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Custom date range — only shown when 'Custom range' is selected */}
                    {hasCustom && (
                        <>
                            <div className="mx-4 border-t border-border" />
                            <div className="p-4 space-y-3">
                                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Custom range
                                </p>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-xs text-muted-foreground">From</label>
                                        <input
                                            type="date"
                                            value={value.from}
                                            max={value.to || undefined}
                                            onChange={e => onChange({ ...value, from: e.target.value })}
                                            className="h-9 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [color-scheme:light] dark:[color-scheme:dark]"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-muted-foreground">To</label>
                                        <input
                                            type="date"
                                            value={value.to}
                                            min={value.from || undefined}
                                            onChange={e => onChange({ ...value, to: e.target.value })}
                                            className="h-9 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [color-scheme:light] dark:[color-scheme:dark]"
                                        />
                                    </div>
                                </div>
                                <Button
                                    size="sm"
                                    className="w-full rounded-xl"
                                    disabled={!value.from && !value.to}
                                    onClick={() => setOpen(false)}
                                >
                                    Apply range
                                </Button>
                            </div>
                        </>
                    )}

                    {/* Resolved range preview — shown for presets that aren't 'anytime' or 'custom' */}
                    {!hasCustom && value.preset !== 'anytime' && (value.from || value.to) && (
                        <>
                            <div className="mx-4 border-t border-border" />
                            <div className="px-4 pb-4 pt-3 flex items-center justify-between text-xs text-muted-foreground">
                                <span>
                                  {value.from} → {value.to}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    className="font-medium text-primary hover:underline"
                                >
                                    Done
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}