'use client'

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { ArrowLeft, CheckCircle2, Sparkles } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { MultiStepForm, useMultiStepForm, type FormStep } from "@/components/ui/multi-step-form"
import { formatResponse } from "@/utils/format-response"
import { useIdeaSubmissionMutation } from "@/hooks/repository/use-idea-submission"
import { IDEA_GENDER_OPTIONS, IDEA_STAGES, IDEA_SUBMISSION_TYPES, ideaStageToParam } from "@/lib/gateway-enums"
import {
    IDEA_WIZARD_STEPS,
    ideaSubmissionDefaults,
    ideaSubmissionSchema,
    type IdeaSubmissionForm,
    type IdeaSubmissionResponse,
} from "@/types/idea-submission"

function ReviewRow({ label, value }: { label: string; value: React.ReactNode }) {
    if (!value) return null
    return (
        <div className="flex flex-col gap-0.5 py-2.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className="text-sm font-medium text-foreground sm:max-w-[60%] sm:text-right">{value}</span>
        </div>
    )
}

function ReviewSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="rounded-2xl border border-border bg-card p-5">
            <h4 className="mb-1 font-semibold text-foreground [font-family:var(--font-display)]">{title}</h4>
            <div className="divide-y divide-border">{children}</div>
        </div>
    )
}

const APPLICANT_FIELDS = [
    "applicant.fullName", "applicant.gender", "applicant.age", "applicant.phone",
    "applicant.email", "applicant.location", "applicant.occupation", "applicant.submissionType",
] as const
const IDEA_FIELDS = [
    "ideaName", "oneLineDescription", "description", "problemStatement",
    "problemAudience", "currentSolution", "proposedSolution", "innovationDescription", "inspiration",
] as const
const MARKET_FIELDS = [
    "targetCustomers", "customerLocation", "marketSize", "competitors", "competitiveAdvantage",
    "revenueModel", "productOrService", "pricingStrategy", "mainCosts",
    "startupCapitalNeeded", "firstYearRevenueEstimate", "potentialPartners",
] as const
const READINESS_FIELDS = [
    "stage", "testedWithCustomers", "testingLearnings", "existingResources",
    "challengesAndRisks", "riskMitigationPlan", "socialImpact", "environmentalImpact",
    "estimatedJobsCreated", "growthPlan", "whySelected",
] as const

export default function SubmitIdeaForm() {
    const wizard = useMultiStepForm(IDEA_WIZARD_STEPS.length)
    const submitMutation = useIdeaSubmissionMutation()

    const [result, setResult] = useState<IdeaSubmissionResponse | null>(null)

    const form = useForm<IdeaSubmissionForm>({
        resolver: zodResolver(ideaSubmissionSchema),
        defaultValues: ideaSubmissionDefaults,
        mode: "onBlur",
    })

    async function onSubmit() {
        const data = form.getValues()
        try {
            const response = await submitMutation.mutateAsync(data)
            setResult(response)
            wizard.nextStep()
        } catch (error) {
            toast("Submission failed", {
                description: error instanceof Error ? formatResponse(error.message) || error.message : "An unknown error occurred",
                className: "bg-[hsl(var(--color-error))] text-white",
            })
        }
    }

    const steps: FormStep[] = [
        {
            id: IDEA_WIZARD_STEPS[0].id,
            title: IDEA_WIZARD_STEPS[0].title,
            description: IDEA_WIZARD_STEPS[0].description,
            validate: () => form.trigger(APPLICANT_FIELDS as unknown as (keyof IdeaSubmissionForm)[]),
            content: (
                <div className="space-y-5">
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <FormField
                            name="applicant.fullName"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name *</FormLabel>
                                    <FormControl><Input {...field} placeholder="Your full name" /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="applicant.age"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Age *</FormLabel>
                                    <FormControl><Input {...field} type="number" min={1} max={120} placeholder="e.g. 28" /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        name="applicant.gender"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Gender *</FormLabel>
                                <FormControl>
                                    <RadioGroup onValueChange={field.onChange} value={field.value} className="flex flex-wrap items-center gap-x-6 gap-y-2">
                                        {IDEA_GENDER_OPTIONS.map((opt) => (
                                            <div className="flex items-center space-x-2" key={opt.value}>
                                                <RadioGroupItem value={opt.value} id={`gender-${opt.value}`} />
                                                <Label htmlFor={`gender-${opt.value}`} className="font-normal">{opt.label}</Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <FormField
                            name="applicant.phone"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone Number *</FormLabel>
                                    <FormControl><Input {...field} type="tel" placeholder="+232 ..." /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="applicant.email"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email *</FormLabel>
                                    <FormControl><Input {...field} type="email" placeholder="name@example.com" /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <FormField
                            name="applicant.location"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Location *</FormLabel>
                                    <FormControl><Input {...field} placeholder="Town / district" /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="applicant.occupation"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Occupation *</FormLabel>
                                    <FormControl><Input {...field} placeholder="What do you currently do?" /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        name="applicant.submissionType"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Submitting As *</FormLabel>
                                <FormControl>
                                    <RadioGroup onValueChange={field.onChange} value={field.value} className="flex flex-wrap items-center gap-x-6 gap-y-2">
                                        {IDEA_SUBMISSION_TYPES.map((opt) => (
                                            <div className="flex items-center space-x-2" key={opt.value}>
                                                <RadioGroupItem value={opt.value} id={`submission-type-${opt.value}`} />
                                                <Label htmlFor={`submission-type-${opt.value}`} className="font-normal">{opt.label}</Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            ),
        },
        {
            id: IDEA_WIZARD_STEPS[1].id,
            title: IDEA_WIZARD_STEPS[1].title,
            description: IDEA_WIZARD_STEPS[1].description,
            validate: () => form.trigger(IDEA_FIELDS as unknown as (keyof IdeaSubmissionForm)[]),
            content: (
                <div className="space-y-5">
                    <FormField
                        name="ideaName"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Idea Name *</FormLabel>
                                <FormControl><Input {...field} placeholder="Give your idea a name" /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="oneLineDescription"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>One-Line Description *</FormLabel>
                                <FormControl><Input {...field} placeholder="Describe your idea in a single sentence" /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="description"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Detailed Description *</FormLabel>
                                <FormControl><Textarea {...field} rows={4} placeholder="Explain your idea in detail" /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="problemStatement"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Problem Statement *</FormLabel>
                                <FormControl><Textarea {...field} rows={3} placeholder="What problem are you solving?" /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="problemAudience"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Who Experiences This Problem?</FormLabel>
                                <FormControl><Textarea {...field} rows={2} placeholder="Describe the audience affected" /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="currentSolution"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>How Is This Problem Solved Today?</FormLabel>
                                <FormControl><Textarea {...field} rows={2} placeholder="Describe existing solutions, if any" /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="proposedSolution"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Your Proposed Solution *</FormLabel>
                                <FormControl><Textarea {...field} rows={3} placeholder="How does your idea solve the problem?" /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="innovationDescription"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>What Makes It Innovative?</FormLabel>
                                <FormControl><Textarea {...field} rows={2} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="inspiration"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>What Inspired This Idea?</FormLabel>
                                <FormControl><Textarea {...field} rows={2} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            ),
        },
        {
            id: IDEA_WIZARD_STEPS[2].id,
            title: IDEA_WIZARD_STEPS[2].title,
            description: IDEA_WIZARD_STEPS[2].description,
            validate: () => form.trigger(MARKET_FIELDS as unknown as (keyof IdeaSubmissionForm)[]),
            content: (
                <div className="space-y-5">
                    <FormField
                        name="targetCustomers"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Target Customers *</FormLabel>
                                <FormControl><Textarea {...field} rows={2} placeholder="Who will buy or use this?" /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <FormField
                            name="customerLocation"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Customer Location</FormLabel>
                                    <FormControl><Input {...field} placeholder="Where are your customers?" /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="marketSize"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Market Size</FormLabel>
                                    <FormControl><Input {...field} placeholder="e.g. estimated number of potential customers" /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <FormField
                            name="competitors"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Competitors</FormLabel>
                                    <FormControl><Textarea {...field} rows={2} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="competitiveAdvantage"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Your Competitive Advantage</FormLabel>
                                    <FormControl><Textarea {...field} rows={2} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        name="revenueModel"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Revenue Model *</FormLabel>
                                <FormControl><Textarea {...field} rows={2} placeholder="How will this make money?" /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <FormField
                            name="productOrService"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Product or Service</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="pricingStrategy"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Pricing Strategy</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <FormField
                            name="mainCosts"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Main Costs</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="startupCapitalNeeded"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Startup Capital Needed</FormLabel>
                                    <FormControl><Input {...field} placeholder="e.g. Le 20,000,000" /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <FormField
                            name="firstYearRevenueEstimate"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First-Year Revenue Estimate</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="potentialPartners"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Potential Partners</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
            ),
        },
        {
            id: IDEA_WIZARD_STEPS[3].id,
            title: IDEA_WIZARD_STEPS[3].title,
            description: IDEA_WIZARD_STEPS[3].description,
            validate: () => form.trigger(READINESS_FIELDS as unknown as (keyof IdeaSubmissionForm)[]),
            content: (
                <div className="space-y-5">
                    <FormField
                        name="stage"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>How Far Along Is This Idea? *</FormLabel>
                                <FormControl>
                                    <RadioGroup onValueChange={field.onChange} value={field.value} className="flex flex-col gap-2.5">
                                        {IDEA_STAGES.map((label) => {
                                            const value = ideaStageToParam(label)
                                            return (
                                                <div className="flex items-center space-x-2" key={value}>
                                                    <RadioGroupItem value={value} id={`stage-${value}`} />
                                                    <Label htmlFor={`stage-${value}`} className="font-normal">{label}</Label>
                                                </div>
                                            )
                                        })}
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="testedWithCustomers"
                        control={form.control}
                        render={({ field }) => (
                            <div className="flex items-start gap-3 rounded-2xl border border-border bg-muted/30 p-4">
                                <Checkbox id="testedWithCustomers" checked={field.value} onCheckedChange={field.onChange} className="mt-0.5" />
                                <Label htmlFor="testedWithCustomers" className="cursor-pointer font-normal leading-snug">
                                    I have tested this idea with real customers
                                </Label>
                            </div>
                        )}
                    />

                    <FormField
                        name="testingLearnings"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>What Did You Learn From Testing?</FormLabel>
                                <FormControl><Textarea {...field} rows={2} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="existingResources"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>What Resources Do You Already Have?</FormLabel>
                                <FormControl><Textarea {...field} rows={2} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <FormField
                            name="challengesAndRisks"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Challenges & Risks</FormLabel>
                                    <FormControl><Textarea {...field} rows={2} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="riskMitigationPlan"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Risk Mitigation Plan</FormLabel>
                                    <FormControl><Textarea {...field} rows={2} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <FormField
                            name="socialImpact"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Social Impact</FormLabel>
                                    <FormControl><Textarea {...field} rows={2} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="environmentalImpact"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Environmental Impact</FormLabel>
                                    <FormControl><Textarea {...field} rows={2} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <FormField
                            name="estimatedJobsCreated"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Estimated Jobs Created</FormLabel>
                                    <FormControl><Input {...field} placeholder="e.g. 5-10" /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="growthPlan"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Growth Plan</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        name="whySelected"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Why Should This Idea Be Selected?</FormLabel>
                                <FormControl><Textarea {...field} rows={3} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            ),
        },
        {
            id: IDEA_WIZARD_STEPS[4].id,
            title: IDEA_WIZARD_STEPS[4].title,
            description: IDEA_WIZARD_STEPS[4].description,
            // A plain snapshot (not a subscription) - the review step only needs to be
            // correct at the moment it's shown, which is whenever this array is rebuilt
            // (every render), not live on every keystroke elsewhere.
            content: (() => {
                const v = form.getValues()
                const genderLabel = IDEA_GENDER_OPTIONS.find((g) => g.value === v.applicant?.gender)?.label
                const submissionTypeLabel = IDEA_SUBMISSION_TYPES.find((s) => s.value === v.applicant?.submissionType)?.label
                const stageLabel = IDEA_STAGES.find((label) => ideaStageToParam(label) === v.stage)
                return (
                    <div className="space-y-4">
                        <ReviewSection title="About You">
                            <ReviewRow label="Full Name" value={v.applicant?.fullName} />
                            <ReviewRow label="Gender" value={genderLabel} />
                            <ReviewRow label="Age" value={v.applicant?.age} />
                            <ReviewRow label="Phone" value={v.applicant?.phone} />
                            <ReviewRow label="Email" value={v.applicant?.email} />
                            <ReviewRow label="Location" value={v.applicant?.location} />
                            <ReviewRow label="Occupation" value={v.applicant?.occupation} />
                            <ReviewRow label="Submitting As" value={submissionTypeLabel} />
                        </ReviewSection>

                        <ReviewSection title="The Idea">
                            <ReviewRow label="Idea Name" value={v.ideaName} />
                            <ReviewRow label="One-Line Description" value={v.oneLineDescription} />
                            <ReviewRow label="Problem Statement" value={v.problemStatement} />
                            <ReviewRow label="Proposed Solution" value={v.proposedSolution} />
                        </ReviewSection>

                        <ReviewSection title="Market & Business">
                            <ReviewRow label="Target Customers" value={v.targetCustomers} />
                            <ReviewRow label="Revenue Model" value={v.revenueModel} />
                            <ReviewRow label="Startup Capital Needed" value={v.startupCapitalNeeded} />
                        </ReviewSection>

                        <ReviewSection title="Readiness & Impact">
                            <ReviewRow label="Stage" value={stageLabel} />
                            <ReviewRow label="Tested With Customers" value={v.testedWithCustomers ? "Yes" : "No"} />
                            <ReviewRow label="Estimated Jobs Created" value={v.estimatedJobsCreated} />
                        </ReviewSection>
                    </div>
                )
            })(),
        },
    ]

    if (result) {
        return (
            <div className="mx-auto max-w-2xl px-4 py-24">
                <Card className="border-primary/20">
                    <CardContent className="flex flex-col items-center gap-5 py-12 text-center">
                        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-primary">
                            <CheckCircle2 className="h-8 w-8" />
                        </span>
                        <div>
                            <h2 className="text-2xl font-semibold text-foreground [font-family:var(--font-display)]">
                                Idea Submitted
                            </h2>
                            <p className="mt-2 max-w-md text-muted-foreground">
                                Thank you for sharing &ldquo;{result.ideaName}&rdquo; with NaweHub. Our team will review it and
                                you&rsquo;ll be notified of any updates.
                            </p>
                        </div>
                        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
                            <Link href="/web/next-big-idea">
                                <Button className="gap-2">
                                    <ArrowLeft className="h-4 w-4" /> Back to Next Big Idea
                                </Button>
                            </Link>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    form.reset(ideaSubmissionDefaults)
                                    setResult(null)
                                    wizard.reset()
                                }}
                            >
                                Submit another idea
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="container mx-auto max-w-4xl px-4 py-14">
            <Form {...form}>
                <Card className="overflow-visible p-6 sm:p-8">
                    <MultiStepForm
                        steps={steps}
                        currentStep={wizard.currentStep}
                        onStepChange={wizard.setCurrentStep}
                        onComplete={onSubmit}
                        allowStepNavigation
                        isSubmitting={submitMutation.isPending}
                        labels={{ submit: "Submit Idea", submitting: "Submitting..." }}
                    />
                </Card>
            </Form>

            <div className="mt-8 flex items-center justify-center gap-2 rounded-2xl border border-border bg-muted/40 px-6 py-4 text-center text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4 shrink-0 text-primary" />
                <span>Every idea is reviewed by our team — the strongest submissions get featured and connected to funding and mentorship.</span>
            </div>
        </div>
    )
}
