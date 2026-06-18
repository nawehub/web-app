"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppHeader from "@/components/public/app-header";
import { Footer } from "@/components/public/footer";
import { PublicProfileView } from "@/app/dashboard/user-settings/_components/public-profile-view";
import { ProfileSkeleton } from "@/app/dashboard/user-settings/_components/profile-skeleton";
import { usePublicProfileQuery } from "@/hooks/repository/use-entrepreneurs";

export default function VettedEntrepreneurProfilePage() {
    const params = useParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const { data: profile, isLoading, isError } = usePublicProfileQuery(id);

    return (
        <div className="flex min-h-screen flex-col bg-muted/30 dark:bg-zinc-950">
            <AppHeader isVisible={true} />

            {isLoading ? (
                <main className="flex-1 px-4 py-6 pt-20 sm:py-8">
                    <div className="mx-auto max-w-[820px]">
                        <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Loading profile…
                        </div>
                        <ProfileSkeleton />
                    </div>
                </main>
            ) : isError ? (
                <main className="flex flex-1 items-center justify-center px-4 pt-16">
                    <div className="mx-auto max-w-md rounded-xl border bg-card p-10 text-center shadow-sm">
                        <h1 className="font-display text-xl font-bold">Couldn&apos;t load profile</h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Something went wrong while loading this entrepreneur&apos;s profile.
                        </p>
                        <Button asChild className="mt-5 rounded-full">
                            <Link href="/vetted-entrepreneurs">
                                <ArrowLeft className="h-4 w-4" /> Back to entrepreneurs
                            </Link>
                        </Button>
                    </div>
                </main>
            ) : profile ? (
                <>
                    <div className="border-b bg-card pt-16">
                        <div className="mx-auto flex max-w-[820px] items-center gap-3 px-4 py-3.5">
                            <Link
                                href="/vetted-entrepreneurs"
                                className="inline-flex items-center gap-1.5 font-display text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
                            >
                                <ArrowLeft className="h-4 w-4" /> All entrepreneurs
                            </Link>
                            <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-2.5 py-1 font-display text-xs font-semibold text-primary-700">
                                <ShieldCheck className="h-3.5 w-3.5" /> NaWeHub Verified Profile
                            </span>
                        </div>
                    </div>

                    <main className="flex-1 px-4 py-6 sm:py-8">
                        <PublicProfileView profile={profile} />
                    </main>
                </>
            ) : (
                <main className="flex flex-1 items-center justify-center px-4 pt-16">
                    <div className="mx-auto max-w-md rounded-xl border bg-card p-10 text-center shadow-sm">
                        <h1 className="font-display text-xl font-bold">Entrepreneur not found</h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            This profile doesn&apos;t exist or is no longer published.
                        </p>
                        <Button asChild className="mt-5 rounded-full">
                            <Link href="/vetted-entrepreneurs">
                                <ArrowLeft className="h-4 w-4" /> Back to entrepreneurs
                            </Link>
                        </Button>
                    </div>
                </main>
            )}

            <Footer />
        </div>
    );
}
