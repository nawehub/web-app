"use client";

import { EntrepreneurProfile, SectionKey } from "@/types/entrepreneur-profile";
import { ProfileHeader } from "./profile-header";
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

interface PublicProfileViewProps {
    profile: EntrepreneurProfile;
}

/**
 * Read-only render of an entrepreneur's profile — exactly what investors and
 * visitors see once the owner has configured their settings.
 */
export function PublicProfileView({ profile }: PublicProfileViewProps) {
    const isPublic = (key: SectionKey) => profile.visibility[key];

    return (
        <div className="mx-auto flex max-w-[820px] flex-col gap-4">
            <ProfileHeader profile={profile} />

            {isPublic("about") && <AboutSection profile={profile} isPublic />}
            {isPublic("skills") && <SkillsSection profile={profile} isPublic />}
            {isPublic("journey") && <JourneySection profile={profile} isPublic />}
            {isPublic("education") && <EducationSection profile={profile} isPublic />}
            {isPublic("credibility") && <CredibilitySection profile={profile} isPublic />}
            {isPublic("ventures") && <VenturesSection profile={profile} isPublic />}
            {isPublic("impact") && <ImpactSection profile={profile} isPublic />}
            {isPublic("funding") && <FundingSection profile={profile} isPublic />}
            {isPublic("contact") && <ContactSection profile={profile} isPublic />}
        </div>
    );
}
