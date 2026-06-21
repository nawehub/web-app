"use client";

import { useRef, useState } from "react";
import { AlertCircle, Check, Cloud, Eye, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    EducationItem,
    EntrepreneurProfile,
    JourneyItem,
    OPT,
    SectionKey,
    Venture,
    VerificationKey,
    isEmail,
    isPhone,
    isUrl,
    newId,
    saveProfile,
    submitVerification,
} from "../_data/profile";
import { revokePreview, uploadPhoto } from "../_data/photo";
import { SaveStatus, useAutosave } from "../_data/use-autosave";
import { ProfileHeader } from "./profile-header";
import { VerificationSection } from "./verification-section";
import {
    AboutSection,
    SkillsSection,
    JourneySection,
    EducationSection,
    CredibilitySection,
    ImpactSection,
    FundingSection,
    ContactSection,
} from "./profile-sections";
import { VenturesSection } from "./ventures-section";
import { PasswordSection } from "./password-section";
import { ProfileSidebar } from "./profile-sidebar";
import { EditDialog, EditDialogConfig, FormValues } from "./edit-dialog";
import { VerifyDialog, VerifyTarget } from "./verify-dialog";

interface ProfileEditorProps {
    profile: EntrepreneurProfile;
}

const VKIND: Record<VerificationKey, "doc" | "selfie" | "code"> = {
    national_id: "doc",
    passport: "doc",
    voter_id: "doc",
    selfie: "selfie",
    email: "code",
    phone: "code",
};

type CredKind = "references" | "awards" | "links";

export function ProfileEditor({ profile: initial }: ProfileEditorProps) {
    const [profile, setProfile] = useState<EntrepreneurProfile>(initial);
    const [previewing, setPreviewing] = useState(false);
    const [editor, setEditor] = useState<EditDialogConfig | null>(null);
    const [verifyTarget, setVerifyTarget] = useState<VerifyTarget | null>(null);
    const photoInputRef = useRef<HTMLInputElement>(null);

    // Debounced autosave — the whole profile is the unit of persistence.
    const { status: saveStatus, saveNow } = useAutosave(profile, saveProfile);

    // Visibility lives on the profile object itself (single source of truth),
    // so it is persisted by the same autosave as every other edit.
    const visibility = profile.visibility;

    const patch = (changes: Partial<EntrepreneurProfile>) =>
        setProfile((p) => ({ ...p, ...changes }));

    const toggle = (key: SectionKey) =>
        setProfile((p) => ({
            ...p,
            visibility: { ...p.visibility, [key]: !p.visibility[key] },
        }));

    const pickPhoto = () => photoInputRef.current?.click();

    const changePhoto = async (file: File) => {
        const previous = profile.photo;
        const url = await uploadPhoto(file);
        revokePreview(previous); // free the old local preview, if any
        patch({ photo: url });
        toast("Photo updated", { description: `${file.name} is now your profile picture.` });
    };

    /* ---------- Section editors ---------- */
    const editHeader = () =>
        setEditor({
            title: "Edit profile",
            description: "Your identity as it appears at the top of your profile.",
            fields: [
                { key: "photo", label: "Profile photo", type: "photo", full: true },
                { key: "name", label: "Full name", required: true },
                { key: "pronouns", label: "Pronouns" },
                { key: "headline", label: "Headline", type: "textarea", rows: 2, full: true, placeholder: "What you do, in one line" },
                { key: "gender", label: "Gender" },
                { key: "dob", label: "Date of birth", type: "date" },
                { key: "nationality", label: "Nationality" },
                { key: "district", label: "District", type: "select", options: OPT.districts },
                { key: "chiefdom", label: "Chiefdom (optional)" },
                { key: "location", label: "Current location" },
            ],
            values: profile,
            onSave: (v) => patch(v),
        });

    const editAbout = () =>
        setEditor({
            title: "About",
            description: "Who are you, what motivates you, and why entrepreneurship?",
            fields: [{ key: "about", label: "Your story", type: "textarea", rows: 8, full: true }],
            values: { about: profile.about },
            onSave: (v) => patch({ about: v.about }),
        });

    const editSkills = () =>
        setEditor({
            title: "Skills & Expertise",
            description: "Add the skills that define your work.",
            fields: [{ key: "skills", label: "Skills", type: "tags", full: true, placeholder: "e.g. Agronomy" }],
            values: { skills: profile.skills },
            onSave: (v) => patch({ skills: v.skills ?? [] }),
        });

    const removeSkill = (skill: string) =>
        patch({ skills: profile.skills.filter((s) => s !== skill) });

    const editMemberships = () =>
        setEditor({
            title: "Memberships",
            fields: [{ key: "memberships", label: "Memberships & affiliations", type: "tags", full: true }],
            values: { memberships: profile.memberships },
            onSave: (v) => patch({ memberships: v.memberships ?? [] }),
        });

    const removeMembership = (m: string) =>
        patch({ memberships: profile.memberships.filter((x) => x !== m) });

    /* ---------- List item editors (journey / education) ---------- */
    const editJourney = (index: number | null) => {
        const isNew = index == null;
        const cur = isNew ? { year: "", title: "", desc: "" } : profile.journey[index];
        setEditor({
            title: isNew ? "Add milestone" : "Journey milestone",
            fields: [
                { key: "year", label: "Year", required: true },
                { key: "title", label: "Title", required: true },
                { key: "desc", label: "Description", type: "textarea", full: true },
            ],
            values: cur,
            onSave: (v) => {
                // Build a typed JourneyItem instead of casting the raw form values.
                const item: JourneyItem = {
                    id: isNew ? newId("j") : profile.journey[index].id,
                    year: String(v.year ?? ""),
                    title: String(v.title ?? ""),
                    desc: v.desc ? String(v.desc) : undefined,
                };
                const list = [...profile.journey];
                if (isNew) list.push(item);
                else list[index] = item;
                patch({ journey: list });
            },
            onDelete: isNew ? undefined : () => patch({ journey: profile.journey.filter((_, i) => i !== index) }),
        });
    };

    const editEducation = (index: number | null) => {
        const isNew = index == null;
        const cur = isNew ? { title: "", org: "", year: "" } : profile.education[index];
        setEditor({
            title: isNew ? "Add education / training" : "Education / Training",
            fields: [
                { key: "title", label: "Qualification / Course", required: true },
                { key: "org", label: "Institution", required: true },
                { key: "year", label: "Year(s)", full: true },
            ],
            values: cur,
            onSave: (v) => {
                const item: EducationItem = {
                    id: isNew ? newId("e") : profile.education[index].id,
                    title: String(v.title ?? ""),
                    org: String(v.org ?? ""),
                    year: String(v.year ?? ""),
                };
                const list = [...profile.education];
                if (isNew) list.push(item);
                else list[index] = item;
                patch({ education: list });
            },
            onDelete: isNew ? undefined : () => patch({ education: profile.education.filter((_, i) => i !== index) }),
        });
    };

    /* ---------- Credibility item editors ---------- */
    const credConfig: Record<CredKind, { title: string; fields: EditDialogConfig["fields"]; blank: FormValues }> = {
        references: {
            title: "Reference",
            fields: [
                { key: "name", label: "Name", required: true },
                { key: "type", label: "Type", type: "select", options: OPT.referenceTypes },
                { key: "role", label: "Role / Organisation", full: true },
            ],
            blank: { name: "", role: "", type: "Professional" },
        },
        awards: {
            title: "Award / Recognition",
            fields: [
                { key: "title", label: "Award", required: true },
                { key: "year", label: "Year" },
            ],
            blank: { title: "", year: "" },
        },
        links: {
            title: "Public profile / Link",
            fields: [
                { key: "label", label: "Label", required: true },
                {
                    key: "url",
                    label: "URL",
                    required: true,
                    validate: (v) => (isUrl(v as string) ? null : "Enter a valid URL or domain."),
                },
            ],
            blank: { label: "", url: "" },
        },
    };

    const credIdPrefix: Record<CredKind, string> = { references: "r", awards: "a", links: "l" };

    const editCredItem = (kind: CredKind, index: number | null) => {
        const cfg = credConfig[kind];
        const isNew = index == null;
        const list = profile[kind] as FormValues[];
        // `id` rides along in the draft (no field renders it) so it round-trips on save.
        const cur = isNew ? { ...cfg.blank, id: newId(credIdPrefix[kind]) } : list[index];
        setEditor({
            title: isNew ? `Add ${cfg.title.toLowerCase()}` : cfg.title,
            fields: cfg.fields,
            values: cur,
            onSave: (v) => {
                const next = [...list];
                if (isNew) next.push(v);
                else next[index] = v;
                patch({ [kind]: next } as Partial<EntrepreneurProfile>);
            },
            onDelete: isNew
                ? undefined
                : () => patch({ [kind]: list.filter((_, i) => i !== index) } as Partial<EntrepreneurProfile>),
        });
    };

    /* ---------- Venture editor ---------- */
    const editVenture = (id: string | null) => {
        const isNew = !id;
        const existing = isNew ? undefined : profile.ventures.find((x) => x.id === id);
        // Guard against a stale id rather than casting away `undefined`.
        if (!isNew && !existing) return;
        const cur: Venture = isNew
            ? {
                  id: "v" + Date.now(),
                  name: "",
                  type: "Startup",
                  sector: "Agriculture",
                  stage: "Idea Stage",
                  problem: "",
                  solution: "",
                  customers: "",
                  model: "",
                  status: "",
                  validation: [],
                  registered: false,
                  score: 35,
                  rating: "Idea Verified",
                  jobs: 0,
                  customersReached: 0,
                  beneficiaries: 0,
                  innovation: "Incremental",
              }
            : (existing as Venture);
        setEditor({
            title: isNew ? "Add a venture" : "Edit venture",
            description: "A business, startup, project or idea attached to your profile.",
            fields: [
                { key: "name", label: "Venture name", required: true },
                { key: "type", label: "Type", type: "select", options: OPT.ventureTypes },
                { key: "sector", label: "Sector", type: "select", options: OPT.sectors },
                { key: "stage", label: "Stage", type: "select", options: OPT.stages },
                { key: "problem", label: "Problem being solved", type: "textarea", full: true },
                { key: "solution", label: "Proposed solution", type: "textarea", full: true },
                { key: "customers", label: "Target customers", type: "textarea", rows: 2, full: true },
                { key: "model", label: "Business model", type: "textarea", rows: 2, full: true },
                { key: "innovation", label: "Level of innovation", type: "pills", full: true, options: OPT.innovation },
                { key: "jobs", label: "Jobs created", type: "number" },
                { key: "customersReached", label: "Customers reached", type: "number" },
                { key: "beneficiaries", label: "Beneficiaries", type: "number" },
                { key: "rating", label: "Venture rating", type: "select", options: OPT.ventureRating },
                { key: "validation", label: "Validation evidence", type: "pillsmulti", full: true, options: OPT.validation },
            ],
            values: cur,
            onSave: (v) => {
                const merged: Venture = {
                    ...cur,
                    ...(v as Partial<Venture>),
                    registered: (v.validation ?? []).includes("Registration Certificate"),
                };
                const list = isNew
                    ? [...profile.ventures, merged]
                    : profile.ventures.map((x) => (x.id === id ? merged : x));
                patch({ ventures: list });
            },
            onDelete: isNew ? undefined : () => patch({ ventures: profile.ventures.filter((x) => x.id !== id) }),
        });
    };

    /* ---------- Impact / Funding / Contact ---------- */
    const editImpact = () =>
        setEditor({
            title: "Impact & Results",
            description: "Aggregate impact across your ventures.",
            fields: [
                { key: "jobs", label: "Jobs created", type: "number" },
                { key: "customers", label: "Customers reached", type: "number" },
                { key: "beneficiaries", label: "Beneficiaries", type: "number" },
                { key: "communities", label: "Communities served", type: "number" },
                { key: "environmental", label: "Environmental impact", type: "tags", full: true, placeholder: "e.g. 200 trees planted" },
                { key: "stories", label: "Success story", type: "textarea", full: true },
            ],
            values: profile.impact,
            onSave: (v) => patch({ impact: { ...profile.impact, ...v } }),
        });

    const editFunding = () =>
        setEditor({
            title: "Funding & Support",
            fields: [
                { key: "received", label: "Funding received", type: "pillsmulti", full: true, options: OPT.fundingReceived },
                { key: "supportNeeded", label: "Support needed", type: "pillsmulti", full: true, options: OPT.supportNeeded },
                { key: "needAmount", label: "Current funding need" },
                { key: "needNote", label: "What it is for" },
            ],
            values: profile.funding,
            onSave: (v) => patch({ funding: { ...profile.funding, ...v } }),
        });

    const editContact = () =>
        setEditor({
            title: "Contact & Identity",
            description: "Control visibility with the section toggle. Private = hidden from public.",
            fields: [
                {
                    key: "email",
                    label: "Email",
                    validate: (v) => (isEmail(v as string) ? null : "Enter a valid email address."),
                },
                {
                    key: "phone",
                    label: "Phone",
                    validate: (v) => (isPhone(v as string) ? null : "Enter a valid phone number."),
                },
                {
                    key: "whatsapp",
                    label: "WhatsApp",
                    validate: (v) => (isPhone(v as string) ? null : "Enter a valid phone number."),
                },
                {
                    key: "linkedin",
                    label: "LinkedIn",
                    validate: (v) => (isUrl(v as string) ? null : "Enter a valid URL."),
                },
                {
                    key: "facebook",
                    label: "Facebook",
                    validate: (v) => (isUrl(v as string) ? null : "Enter a valid URL."),
                },
                { key: "x", label: "X (Twitter)" },
                { key: "nationalId", label: "National ID", full: true },
            ],
            values: profile.contact,
            onSave: (v) => patch({ contact: { ...profile.contact, ...v } }),
        });

    /* ---------- Verification ---------- */
    // Opens the upload / capture / code dialog; the actual status change
    // happens on completion (after the user picks a file & submits, etc.).
    const openVerify = (key: VerificationKey) => {
        const value =
            key === "email"
                ? profile.contact.email
                : key === "phone"
                  ? profile.contact.phone
                  : undefined;
        setVerifyTarget({
            key,
            label: profile.verification[key].label,
            kind: VKIND[key],
            value,
            status: profile.verification[key].status,
        });
    };

    const completeVerify = async (key: VerificationKey, status: "review" | "verified") => {
        const label = profile.verification[key].label;
        setVerifyTarget(null);
        try {
            // The server is authoritative about the resulting status.
            const res = await submitVerification(key, status);
            setProfile((p) => ({
                ...p,
                verification: {
                    ...p.verification,
                    [key]: { ...p.verification[key], status: res.status },
                },
            }));
            toast(res.status === "verified" ? "Verified" : "Submitted for review", {
                description:
                    res.status === "verified"
                        ? `${label} has been verified.`
                        : `${label} sent to NaWeHub's vetting team.`,
            });
        } catch {
            toast("Couldn't submit for verification", {
                description: "Something went wrong. Please try again.",
            });
        }
    };

    // TODO(api): demo-only. Fakes the NaWeHub vetting team approving pending checks.
    // Will be removed once verification status comes from the server. Guarded by DEMO_MODE in the UI.
    const simulateApproval = () => {
        setProfile((p) => {
            const v = { ...p.verification };
            (Object.keys(v) as VerificationKey[]).forEach((k) => {
                if (v[k].status === "review") v[k] = { ...v[k], status: "verified" };
            });
            return { ...p, verification: v };
        });
        toast("Approved by NaWeHub", { description: "Pending checks are now verified." });
    };

    /* ---------- Render helpers ---------- */
    const sectionTools = (key: SectionKey) =>
        previewing
            ? { isPublic: visibility[key], onToggleVisibility: undefined }
            : { isPublic: visibility[key], onToggleVisibility: () => toggle(key) };

    const visibleInPreview = (key: SectionKey) => !previewing || visibility[key];

    return (
        <div className="-mx-4 -my-4 lg:-mx-6 lg:-my-6">
            {/* Public preview banner — pinned at the very top, above the dashboard chrome */}
            {previewing && (
                <div className="fixed inset-x-0 top-0 z-modal bg-neutral-900 text-white lg:left-64">
                    <div className="mx-auto flex h-16 max-w-[1120px] items-center gap-3 px-4 sm:px-7">
                        <span className="grid h-6 w-6 place-items-center rounded-md bg-white/15">
                            <Eye className="h-3.5 w-3.5" />
                        </span>
                        <span className="font-display text-sm font-semibold">Public profile preview</span>
                        <span className="hidden text-sm text-white/60 sm:inline">
                            — this is what investors and visitors see. Private sections are hidden.
                        </span>
                        <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => setPreviewing(false)}
                            className="ml-auto rounded-full bg-white text-neutral-900 hover:bg-white/90 hover:text-neutral-900"
                        >
                            Exit preview
                        </Button>
                    </div>
                </div>
            )}

            {/* App layout */}
            <div className="mx-auto grid max-w-[1120px] grid-cols-1 items-start gap-6 px-4 py-6 sm:px-7 lg:grid-cols-[1fr_332px]">
                {/* Main column */}
                <main className="order-2 flex min-w-0 flex-col gap-4 lg:order-1">
                    <ProfileHeader
                        profile={profile}
                        onEdit={previewing ? undefined : editHeader}
                        onPickPhoto={previewing ? undefined : pickPhoto}
                    />

                    {/* Identity & Verification — owner-only, never shown in preview */}
                    {!previewing && (
                        <VerificationSection
                            profile={profile}
                            onVerify={openVerify}
                            onSimulateApproval={simulateApproval}
                        />
                    )}

                    {visibleInPreview("about") && (
                        <AboutSection
                            profile={profile}
                            {...sectionTools("about")}
                            onEdit={previewing ? undefined : editAbout}
                        />
                    )}
                    {visibleInPreview("skills") && (
                        <SkillsSection
                            profile={profile}
                            {...sectionTools("skills")}
                            onAdd={previewing ? undefined : editSkills}
                            onRemove={previewing ? undefined : removeSkill}
                        />
                    )}
                    {visibleInPreview("journey") && (
                        <JourneySection
                            profile={profile}
                            {...sectionTools("journey")}
                            onAddItem={previewing ? undefined : () => editJourney(null)}
                            onEditItem={previewing ? undefined : (i) => editJourney(i)}
                        />
                    )}
                    {visibleInPreview("education") && (
                        <EducationSection
                            profile={profile}
                            {...sectionTools("education")}
                            onAddItem={previewing ? undefined : () => editEducation(null)}
                            onEditItem={previewing ? undefined : (i) => editEducation(i)}
                        />
                    )}
                    {visibleInPreview("credibility") && (
                        <CredibilitySection
                            profile={profile}
                            {...sectionTools("credibility")}
                            onAddMembership={previewing ? undefined : editMemberships}
                            onRemoveMembership={previewing ? undefined : removeMembership}
                            onAddCredItem={previewing ? undefined : (kind) => editCredItem(kind, null)}
                            onEditCredItem={previewing ? undefined : (kind, i) => editCredItem(kind, i)}
                        />
                    )}
                    {visibleInPreview("ventures") && (
                        <VenturesSection
                            profile={profile}
                            isPublic={visibility.ventures}
                            onToggleVisibility={previewing ? () => {} : () => toggle("ventures")}
                            onAddVenture={previewing ? undefined : () => editVenture(null)}
                            onEditVenture={previewing ? undefined : (id) => editVenture(id)}
                        />
                    )}
                    {visibleInPreview("impact") && (
                        <ImpactSection
                            profile={profile}
                            {...sectionTools("impact")}
                            onEdit={previewing ? undefined : editImpact}
                        />
                    )}
                    {visibleInPreview("funding") && (
                        <FundingSection
                            profile={profile}
                            {...sectionTools("funding")}
                            onEdit={previewing ? undefined : editFunding}
                        />
                    )}
                    {visibleInPreview("contact") && (
                        <ContactSection
                            profile={profile}
                            {...sectionTools("contact")}
                            onEdit={previewing ? undefined : editContact}
                        />
                    )}

                    {/* Account security — owner-only, never shown in preview */}
                    {!previewing && <PasswordSection />}
                </main>

                {/* Sidebar — owner tooling, hidden in preview */}
                {!previewing && (
                    <aside className="order-1 flex flex-col gap-4 lg:order-2 lg:sticky lg:top-20">
                        {/* Owner toolbar — pinned to the top of the right column */}
                        <div className="rounded-xl border bg-card p-4 shadow-sm">
                            <div className="flex items-center gap-2">
                                <span className="font-display text-sm font-bold">
                                    Editing your profile
                                </span>
                                <SaveStatusBadge status={saveStatus} onRetry={saveNow} />
                            </div>
                            <Button
                                type="button"
                                size="sm"
                                onClick={() => setPreviewing(true)}
                                className="mt-3 w-full rounded-full"
                            >
                                <Eye className="h-4 w-4" />
                                Preview public profile
                            </Button>
                        </div>

                        <ProfileSidebar
                            profile={profile}
                            visibility={visibility}
                            onToggleVisibilityAction={toggle}
                            onChecklistAction={(key) => {
                                const actions: Record<string, () => void> = {
                                    about: editAbout,
                                    photo: pickPhoto,
                                    identity: () => openVerify("national_id"),
                                    skills: editSkills,
                                    journey: () => editJourney(null),
                                    education: () => editEducation(null),
                                    refs: () => editCredItem("references", null),
                                    venture: () => editVenture(null),
                                    impact: editImpact,
                                    funding: editFunding,
                                };
                                actions[key]?.();
                            }}
                        />
                    </aside>
                )}
            </div>

            {/* Hidden picker shared by the avatar camera button and the checklist */}
            <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) changePhoto(file);
                    e.target.value = "";
                }}
            />

            <EditDialog config={editor} onCloseAction={() => setEditor(null)} />
            <VerifyDialog
                target={verifyTarget}
                onCloseAction={() => setVerifyTarget(null)}
                onCompleteAction={completeVerify}
            />
        </div>
    );
}

/** Live autosave indicator label. */
function SaveStatusBadge({ status, onRetry }: { status: SaveStatus; onRetry: () => void }) {
    if (status === "saving") {
        return (
            <span className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Saving…
            </span>
        );
    }
    if (status === "error") {
        return (
            <button
                type="button"
                onClick={onRetry}
                className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold text-destructive hover:underline"
            >
                <AlertCircle className="h-3.5 w-3.5" />
                Save failed — retry
            </button>
        );
    }
    if (status === "saved") {
        return (
            <span className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600">
                <Check className="h-3.5 w-3.5" />
                Saved
            </span>
        );
    }
    return (
        <span className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <Cloud className="h-3.5 w-3.5" />
            All changes saved
        </span>
    );
}
