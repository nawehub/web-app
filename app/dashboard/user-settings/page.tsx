"use client";

import { useProfile } from "./_data/profile";
import { ProfileEditor } from "./_components/profile-editor";
import { ProfileSkeleton } from "./_components/profile-skeleton";

export default function ProfileSettingsPage() {
    const { profile, isLoading, error } = useProfile();

    if (isLoading || !profile) {
        return (
            <div className="mt-2">
                <ProfileSkeleton />
            </div>
        );
    }

    if (error) {
        return (
            <div className="mx-auto mt-10 max-w-md rounded-xl border bg-card p-8 text-center shadow-sm">
                <h2 className="font-display text-lg font-bold">Couldn&apos;t load your profile</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                    Something went wrong while loading your profile. Please try again.
                </p>
            </div>
        );
    }

    return <ProfileEditor profile={profile} />;
}
