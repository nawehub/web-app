'use client'

import React, { useRef, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
    ClipboardList, Link2, Mail, Phone, UserCircle, Globe,
    ImagePlus, ShieldCheck, Loader2, CheckCircle2, AlertCircle,
    Building, Users, GraduationCap, Briefcase, Handshake,
    Send, ArrowLeft, X, MapPin, Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Static option lists
// ---------------------------------------------------------------------------

const OPPORTUNITY_CATEGORIES = [
    'Grant', 'Competition / Challenge', 'Fellowship', 'Scholarship',
    'Accelerator Program', 'Incubator Program', 'Training / Capacity Building',
    'Internship', 'Funding Opportunity', 'Business Support Service',
]

const ORGANIZATION_TYPES = [
    'Development Partner', 'NGO', 'Innovation Hub',
    'Private Sector Organization', 'Tech Hub',
    'University / Research Institution', 'Foundation',
    'Government Agency',
]

const TARGET_BENEFICIARIES = [
    'Entrepreneurs', 'Students', 'Innovators', 'Researchers',
    'Startups', 'Farmers', 'SMEs', 'Persons with Disabilities',
    'Women-led Businesses', 'Youth',
]

const GEOGRAPHIC_SCOPES = [
    { id: 'sl', label: 'Sierra Leone Only' },
    { id: 'africa', label: 'Africa' },
    { id: 'global', label: 'Global' },
    { id: 'other', label: 'Other' },
]

const MAX_BANNER_BYTES = 10 * 1024 * 1024 // 10 MB

// ---------------------------------------------------------------------------
// Reusable small components
// ---------------------------------------------------------------------------

function SectionHeading({
                            icon: Icon, number, title,
                        }: { icon: React.ElementType; number: string; title: string }) {
    return (
        <div className="flex items-center gap-3 border-b border-border pb-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
        <Icon className="h-5 w-5" />
      </span>
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary [font-family:var(--font-mono)]">
                {number}. {title}
            </h2>
        </div>
    )
}

function FieldLabel({ n, children, optional }: { n: number; children: React.ReactNode; optional?: boolean }) {
    return (
        <Label className="mb-1.5 flex items-baseline gap-1 font-medium text-foreground">
            <span className="text-[11px] [font-family:var(--font-mono)] text-muted-foreground">{n}.</span>
            {children}
            {optional
                ? <span className="text-[11px] font-normal text-muted-foreground">(Optional)</span>
                : <span className="text-destructive">*</span>}
        </Label>
    )
}

function CheckGroup({
                        options, selected, onChange, columns = 2,
                    }: {
    options: string[]
    selected: string[]
    onChange: (next: string[]) => void
    columns?: number
}) {
    const toggle = (opt: string) =>
        onChange(selected.includes(opt) ? selected.filter(s => s !== opt) : [...selected, opt])

    return (
        <div className={cn('grid gap-x-6 gap-y-2', columns === 2 ? 'grid-cols-2' : 'grid-cols-1')}>
            {options.map(opt => (
                <label key={opt} className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
                    <input
                        type="checkbox"
                        checked={selected.includes(opt)}
                        onChange={() => toggle(opt)}
                        className="h-4 w-4 rounded border-border accent-primary"
                    />
                    {opt}
                </label>
            ))}
        </div>
    )
}

function OtherInput({
                        label = 'Other', value, onChange,
                    }: { label?: string; value: string; onChange: (v: string) => void }) {
    return (
        <label className="mt-1 flex items-center gap-2 text-sm text-foreground">
            <input
                type="checkbox"
                checked={value !== ''}
                onChange={e => onChange(e.target.checked ? ' ' : '')}
                className="h-4 w-4 rounded border-border accent-primary"
            />
            <span className="shrink-0">{label}:</span>
            <input
                type="text"
                value={value.trim()}
                disabled={value === ''}
                onChange={e => onChange(e.target.value)}
                placeholder="Please specify"
                className="flex-1 rounded-lg border border-input bg-background px-2 py-1 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40"
            />
        </label>
    )
}

function RadioGroup({
                        options, value, onChange, otherValue, onOtherChange,
                    }: {
    options: { id: string; label: string }[]
    value: string
    onChange: (v: string) => void
    otherValue: string
    onOtherChange: (v: string) => void
}) {
    return (
        <div className="space-y-2">
            {options.map(opt => (
                <label key={opt.id} className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
                    <input
                        type="radio"
                        name="geo-scope"
                        value={opt.id}
                        checked={value === opt.id}
                        onChange={() => onChange(opt.id)}
                        className="h-4 w-4 accent-primary"
                    />
                    {opt.label}
                </label>
            ))}
            <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
                <input
                    type="radio"
                    name="geo-scope"
                    value="other"
                    checked={value === 'other'}
                    onChange={() => onChange('other')}
                    className="h-4 w-4 accent-primary"
                />
                Other:
                <input
                    type="text"
                    value={value === 'other' ? otherValue : ''}
                    disabled={value !== 'other'}
                    onChange={e => onOtherChange(e.target.value)}
                    placeholder="Please specify"
                    className="flex-1 rounded-lg border border-input bg-background px-2 py-1 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40"
                />
            </label>
        </div>
    )
}

// ---------------------------------------------------------------------------
// Banner Image Upload
// ---------------------------------------------------------------------------

function BannerUpload({
                          file, previewUrl, error, onChange,
                      }: {
    file: File | null
    previewUrl: string | null
    error: string | null
    onChange: (f: File | null) => void
}) {
    const inputRef = useRef<HTMLInputElement>(null)

    const handleFiles = (files: FileList | null) => {
        const picked = files?.[0]
        if (!picked) return
        onChange(picked)
    }

    return (
        <div className="space-y-3">
            {!file ? (
                <label
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files) }}
                    className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border bg-muted/30 px-6 py-12 text-center transition-colors hover:border-primary/50 hover:bg-primary/5"
                >
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <ImagePlus className="h-7 w-7" />
          </span>
                    <div>
                        <p className="font-medium text-foreground">Click to upload or drag and drop</p>
                        <p className="mt-1 text-xs text-muted-foreground">PNG, JPG or WEBP — max 10 MB</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">Recommended: 1200 × 630 px (landscape)</p>
                    </div>
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="hidden"
                        onChange={e => handleFiles(e.target.files)}
                    />
                </label>
            ) : (
                <div className="relative overflow-hidden rounded-2xl border border-border bg-muted">
                    {previewUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={previewUrl}
                            alt="Opportunity banner preview"
                            className="h-52 w-full object-cover"
                        />
                    )}
                    <div className="flex items-center justify-between gap-3 border-t border-border bg-card/80 p-3 backdrop-blur-sm">
                        <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => onChange(null)}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            aria-label="Remove banner image"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}
            {error && (
                <p className="flex items-center gap-1.5 text-xs text-[hsl(var(--color-error))]">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {error}
                </p>
            )}
        </div>
    )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

interface FormState {
    // Section 1
    title: string
    categories: string[]
    categoryOther: string
    description: string
    // Section 2
    orgName: string
    orgTypes: string[]
    orgTypeOther: string
    // Section 3
    beneficiaries: string[]
    beneficiaryOther: string
    eligibilityCriteria: string
    deadline: string
    // Section 4
    applyLink: string
    contactEmail: string
    contactPhone: string
    additionalContact: string
    // Section 5
    geoScope: string
    geoScopeOther: string
    // Submitter
    submittedBy: string
    dateSubmitted: string
    // Declaration
    declared: boolean
}

const INITIAL: FormState = {
    title: '', categories: [], categoryOther: '', description: '',
    orgName: '', orgTypes: [], orgTypeOther: '',
    beneficiaries: [], beneficiaryOther: '', eligibilityCriteria: '', deadline: '',
    applyLink: '', contactEmail: '', contactPhone: '', additionalContact: '',
    geoScope: 'sl', geoScopeOther: '',
    submittedBy: '', dateSubmitted: '',
    declared: false,
}

export default function SubmitOpportunityPage() {
    const [form, setForm] = useState<FormState>(INITIAL)
    const [bannerFile, setBannerFile] = useState<File | null>(null)
    const [bannerPreview, setBannerPreview] = useState<string | null>(null)
    const [bannerError, setBannerError] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [formError, setFormError] = useState('')

    const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
        setForm(prev => ({ ...prev, [key]: value }))

    const handleBannerChange = (file: File | null) => {
        if (file) {
            if (!file.type.startsWith('image/')) {
                setBannerError('Please upload an image file (PNG, JPG, or WEBP).')
                return
            }
            if (file.size > MAX_BANNER_BYTES) {
                setBannerError('Image is over 10 MB. Please upload a smaller file.')
                return
            }
            setBannerError(null)
            setBannerFile(file)
            const url = URL.createObjectURL(file)
            setBannerPreview(url)
        } else {
            setBannerFile(null)
            if (bannerPreview) URL.revokeObjectURL(bannerPreview)
            setBannerPreview(null)
            setBannerError(null)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setFormError('')
        if (!form.declared) {
            setFormError('Please confirm the declaration before submitting.')
            return
        }
        setSubmitting(true)
        try {
            // TODO: replace with your real mutation
            await new Promise(r => setTimeout(r, 1800))
            setSubmitted(true)
        } catch {
            setFormError('Submission failed. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    // ── Success screen ──
    if (submitted) {
        return (
            <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 py-24 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/15 text-primary">
          <CheckCircle2 className="h-10 w-10" />
        </span>
                <h1 className="text-3xl font-semibold text-foreground [font-family:var(--font-display)]">
                    Opportunity submitted!
                </h1>
                <p className="max-w-md text-muted-foreground">
                    Thank you for helping us connect opportunities with entrepreneurs and innovators across Sierra Leone.
                    Our team will review your submission and get back to you shortly.
                </p>
                <div className="flex gap-3">
                    <Link href="/web/opportunities">
                        <Button className="gap-2 rounded-xl">
                            <ArrowLeft className="h-4 w-4" /> Back to Opportunities
                        </Button>
                    </Link>
                    <Button variant="outline" className="rounded-xl" onClick={() => { setForm(INITIAL); setBannerFile(null); setBannerPreview(null); setSubmitted(false) }}>
                        Submit another
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div>
            {/* ── HERO ── */}
            <section className="relative overflow-hidden bg-[hsl(var(--color-neutral-900))]">
                {/* Glow blobs */}
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -left-40 -top-40 h-[400px] w-[400px] rounded-full bg-primary/20 blur-[120px]" />
                    <div className="absolute -right-20 bottom-0 h-[300px] w-[300px] rounded-full bg-accent/15 blur-[100px]" />
                </div>

                <div className="container relative mx-auto px-4 py-16 lg:py-20">
                    <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
                        {/* Left copy */}
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="space-y-6"
                        >
                            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5">
                                <Sparkles className="h-4 w-4 text-primary" />
                                <span className="text-sm font-medium text-primary">Submit an Opportunity</span>
                            </div>

                            <h1 className="text-3xl font-semibold text-[hsl(var(--color-neutral-50))] [font-family:var(--font-display)] sm:text-4xl lg:text-5xl">
                                Share an Opportunity<br />
                                <span className="text-primary">with Thousands of</span><br />
                                Entrepreneurs
                            </h1>

                            <p className="max-w-lg text-[hsl(var(--color-neutral-300))]">
                                Submit funding calls, grants, competitions, events, training programs, and any other
                                opportunities that support entrepreneurs, innovators, SME owners, and other
                                impact-driven individuals across Sierra Leone and beyond.
                            </p>

                            <div className="flex flex-wrap gap-4 pt-2">
                                {[
                                    { icon: ShieldCheck, text: 'All submissions are reviewed & verified' },
                                    { icon: Globe, text: 'Reach entrepreneurs across Sierra Leone' },
                                    { icon: Handshake, text: 'Free to submit — always' },
                                ].map(f => (
                                    <div key={f.text} className="flex items-center gap-2 text-sm text-[hsl(var(--color-neutral-300))]">
                                        <f.icon className="h-4 w-4 text-primary" />
                                        {f.text}
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Right — person filling form illustration */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.15 }}
                            className="relative hidden justify-center lg:flex"
                        >
                            <div className="relative h-[380px] w-full max-w-md">
                                <div className="absolute inset-0 rounded-3xl" />
                                {/* Replace src with your own asset */}
                                <img
                                    src="/images/opportunities/person-fill-form.png"
                                    alt="Person filling out an opportunity submission form"
                                    className="h-full w-full object-cover drop-shadow-2xl"
                                    onError={e => { (e.target as HTMLImageElement).style.opacity = '0' }}
                                />
                                {/* Decorative floating card */}
                                <div className="absolute -left-6 bottom-16 rounded-2xl bg-card px-5 py-4 shadow-[var(--shadow-lg)]">
                                    <p className="text-xs text-muted-foreground">Opportunities submitted</p>
                                    <p className="mt-0.5 text-2xl font-bold text-foreground [font-family:var(--font-mono)]">1,240+</p>
                                    <p className="mt-1 text-xs text-primary">↑ 34 this week</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Cloth border */}
                <div className="h-3 w-full overflow-hidden" aria-hidden="true">
                    <svg width="100%" height="100%" preserveAspectRatio="none">
                        <pattern id="submit-cloth" width="24" height="12" patternUnits="userSpaceOnUse">
                            <path d="M0 6 L12 0 L24 6 L12 12 Z" fill="hsl(60 9% 98%)" fillOpacity="0.55" />
                        </pattern>
                        <rect width="100%" height="100%" fill="url(#submit-cloth)" />
                    </svg>
                </div>
            </section>

            {/* ── FORM ── */}
            <section className="py-14">
                <div className="container mx-auto px-4">
                    <form onSubmit={handleSubmit} noValidate>
                        {/* Form grid — three row-pairs so left/right cards always align.
                Each pair is its own lg:grid-cols-2; both cards are h-full so
                the shorter one stretches to match the taller one in that row. */}
                        <div className="space-y-8">

                            {/* ── ROW 1: Opportunity Information ↔ Link & Contact ── */}
                            <div className="grid gap-8 lg:grid-cols-2 lg:items-stretch">

                                {/* 1 — Opportunity Information */}
                                <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-sm)]">
                                    <SectionHeading icon={ClipboardList} number="1" title="Opportunity Information" />
                                    <div className="mt-6 flex flex-1 flex-col gap-6">

                                        <div>
                                            <FieldLabel n={1}>Opportunity Title</FieldLabel>
                                            <Input
                                                required
                                                value={form.title}
                                                onChange={e => set('title', e.target.value)}
                                                placeholder="Enter opportunity title"
                                                className="h-11"
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <FieldLabel n={2}>Opportunity Category</FieldLabel>
                                            <CheckGroup
                                                options={OPPORTUNITY_CATEGORIES}
                                                selected={form.categories}
                                                onChange={v => set('categories', v)}
                                            />
                                            <OtherInput value={form.categoryOther} onChange={v => set('categoryOther', v)} />
                                        </div>

                                        <div className="flex flex-1 flex-col">
                                            <FieldLabel n={3}>Brief Description of the Opportunity</FieldLabel>
                                            <p className="mb-2 text-xs text-muted-foreground">
                                                Provide a concise summary of the opportunity, its purpose and benefits.
                                            </p>
                                            <Textarea
                                                required
                                                className="flex-1 resize-none"
                                                value={form.description}
                                                onChange={e => set('description', e.target.value)}
                                                placeholder="Type your description here..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* 4 — Link & Contact Info */}
                                <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-sm)]">
                                    <SectionHeading icon={Link2} number="4" title="Opportunity Link & Contact Information" />
                                    <div className="mt-6 flex flex-1 flex-col gap-6">

                                        <div>
                                            <FieldLabel n={9}>Opportunity Details / Application Link</FieldLabel>
                                            <p className="mb-2 text-xs text-muted-foreground">
                                                Paste the official URL where applicants can learn more or apply.
                                            </p>
                                            <div className="relative">
                                                <Link2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                <Input
                                                    type="url"
                                                    required
                                                    value={form.applyLink}
                                                    onChange={e => set('applyLink', e.target.value)}
                                                    placeholder="https://"
                                                    className="h-11 pl-10"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <FieldLabel n={10}>Contact Email Address</FieldLabel>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                <Input
                                                    type="email"
                                                    required
                                                    value={form.contactEmail}
                                                    onChange={e => set('contactEmail', e.target.value)}
                                                    placeholder="example@organization.org"
                                                    className="h-11 pl-10"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <FieldLabel n={11}>Contact Phone Number</FieldLabel>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                <Input
                                                    type="tel"
                                                    required
                                                    value={form.contactPhone}
                                                    onChange={e => set('contactPhone', e.target.value)}
                                                    placeholder="e.g. +322 76 123456"
                                                    className="h-11 pl-10"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <FieldLabel n={12} optional>Additional Contact Person</FieldLabel>
                                            <div className="relative">
                                                <UserCircle className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                <Input
                                                    value={form.additionalContact}
                                                    onChange={e => set('additionalContact', e.target.value)}
                                                    placeholder="Full name and role (e.g. Program Officer)"
                                                    className="h-11 pl-10"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ── ROW 2: Provider Information ↔ Geographic Scope ── */}
                            <div className="grid gap-8 lg:grid-cols-2 lg:items-stretch">

                                {/* 2 — Opportunity Provider */}
                                <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-sm)]">
                                    <SectionHeading icon={Building} number="2" title="Opportunity Provider Information" />
                                    <div className="mt-6 flex flex-1 flex-col gap-6">

                                        <div>
                                            <FieldLabel n={4}>
                                                Name of Development Partner, Foundation, Innovation Hub, Tech Hub, Organization, or Institution
                                            </FieldLabel>
                                            <Input
                                                required
                                                value={form.orgName}
                                                onChange={e => set('orgName', e.target.value)}
                                                placeholder="Enter organization / institution name"
                                                className="h-11"
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <FieldLabel n={5} optional>Organization Type</FieldLabel>
                                            <CheckGroup
                                                options={ORGANIZATION_TYPES}
                                                selected={form.orgTypes}
                                                onChange={v => set('orgTypes', v)}
                                            />
                                            <OtherInput value={form.orgTypeOther} onChange={v => set('orgTypeOther', v)} />
                                        </div>
                                    </div>
                                </div>

                                {/* 5 — Geographic Scope */}
                                <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-sm)]">
                                    <SectionHeading icon={Globe} number="5" title="Geographic Scope" />
                                    <div className="mt-6 flex flex-1 flex-col gap-6">
                                        <div>
                                            <FieldLabel n={13}>Opportunity Coverage</FieldLabel>
                                            <div className="mt-2">
                                                <RadioGroup
                                                    options={GEOGRAPHIC_SCOPES}
                                                    value={form.geoScope}
                                                    onChange={v => set('geoScope', v)}
                                                    otherValue={form.geoScopeOther}
                                                    onOtherChange={v => set('geoScopeOther', v)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ── ROW 3: Eligibility ↔ Banner Image ── */}
                            <div className="grid gap-8 lg:grid-cols-2 lg:items-stretch">

                                {/* 3 — Eligibility & Application Details */}
                                <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-sm)]">
                                    <SectionHeading icon={Users} number="3" title="Eligibility & Application Details" />
                                    <div className="mt-6 flex flex-1 flex-col gap-6">

                                        <div className="space-y-3">
                                            <FieldLabel n={6}>Target Beneficiaries</FieldLabel>
                                            <CheckGroup
                                                options={TARGET_BENEFICIARIES}
                                                selected={form.beneficiaries}
                                                onChange={v => set('beneficiaries', v)}
                                            />
                                            <OtherInput value={form.beneficiaryOther} onChange={v => set('beneficiaryOther', v)} />
                                        </div>

                                        <div>
                                            <FieldLabel n={7} optional>Eligibility Criteria</FieldLabel>
                                            <Textarea
                                                rows={3}
                                                value={form.eligibilityCriteria}
                                                onChange={e => set('eligibilityCriteria', e.target.value)}
                                                placeholder="Describe who is eligible to apply..."
                                            />
                                        </div>

                                        <div>
                                            <FieldLabel n={8}>Application Deadline</FieldLabel>
                                            <input
                                                type="date"
                                                required
                                                value={form.deadline}
                                                onChange={e => set('deadline', e.target.value)}
                                                className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [color-scheme:light] dark:[color-scheme:dark]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* 6 — Banner Image */}
                                <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-sm)]">
                                    <SectionHeading icon={GraduationCap} number="6" title="Opportunity Banner Image" />
                                    <div className="mt-6 flex flex-1 flex-col gap-4">
                                        <div className="flex flex-1 flex-col">
                                            <FieldLabel n={14} optional>Upload Banner Image</FieldLabel>
                                            <p className="mb-3 text-xs text-muted-foreground">
                                                Upload a banner image that represents this opportunity. It will be shown on the
                                                opportunity listing card and detail page.
                                            </p>
                                            <div className="flex flex-1 flex-col">
                                                <BannerUpload
                                                    file={bannerFile}
                                                    previewUrl={bannerPreview}
                                                    error={bannerError}
                                                    onChange={handleBannerChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── DECLARATION + SUBMIT ── */}
                        <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-6 shadow-[var(--shadow-sm)]">
                            <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary mt-0.5">
                  <ShieldCheck className="h-4 w-4" />
                </span>
                                <h3 className="text-sm font-bold uppercase tracking-widest text-primary [font-family:var(--font-mono)] mt-1.5">
                                    Declaration
                                </h3>
                            </div>
                            <label className="mt-4 flex cursor-pointer items-start gap-3 text-sm text-foreground">
                                <input
                                    type="checkbox"
                                    required
                                    checked={form.declared}
                                    onChange={e => set('declared', e.target.checked)}
                                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-border accent-primary"
                                />
                                <span className="leading-relaxed text-muted-foreground">
                  I confirm that the information submitted is accurate and that the opportunity is legitimate and
                  intended to support entrepreneurs, innovators, startups, SMEs, or related beneficiaries.
                </span>
                            </label>
                        </div>

                        {/* Submitter row */}
                        <div className="mt-6 flex flex-wrap items-end gap-4">
                            <div className="flex-1 min-w-[180px] space-y-1.5">
                                <FieldLabel n={15}>Submitted By</FieldLabel>
                                <div className="relative">
                                    <UserCircle className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        required
                                        value={form.submittedBy}
                                        onChange={e => set('submittedBy', e.target.value)}
                                        placeholder="Your full name"
                                        className="h-11 pl-10"
                                    />
                                </div>
                            </div>
                            <div className="flex-1 min-w-[180px] space-y-1.5">
                                <FieldLabel n={16}>Date Submitted</FieldLabel>
                                <input
                                    type="date"
                                    required
                                    value={form.dateSubmitted}
                                    onChange={e => set('dateSubmitted', e.target.value)}
                                    className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [color-scheme:light] dark:[color-scheme:dark]"
                                />
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                {formError && (
                                    <p className="flex items-center gap-1.5 text-xs text-[hsl(var(--color-error))]">
                                        <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {formError}
                                    </p>
                                )}
                                <Button
                                    type="submit"
                                    disabled={submitting}
                                    className="h-12 min-w-[200px] gap-2 rounded-xl bg-primary font-semibold text-primary-foreground shadow-[var(--shadow-md)] transition-all hover:bg-primary/90 hover:shadow-[var(--shadow-lg)]"
                                >
                                    {submitting
                                        ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</>
                                        : <><Send className="h-4 w-4" /> Submit Opportunity</>}
                                </Button>
                            </div>
                        </div>

                        {/* Thank-you note */}
                        <div className="mt-8 flex items-center justify-center gap-2 rounded-2xl border border-border bg-muted/40 px-6 py-4 text-center text-sm text-muted-foreground">
                            <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
                            <span>
                                Thank you for helping us connect opportunities with entrepreneurs, innovators and SME owners.
                                Together, we build a stronger innovation and entrepreneurship ecosystem.
                            </span>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    )
}