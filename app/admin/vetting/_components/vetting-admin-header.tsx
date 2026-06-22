"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { AUTH_DISABLED } from "@/lib/feature-flags";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV = [
    { href: "/admin/vetting", label: "Vetting Queue" },
    { href: "/web/vetted-entrepreneurs", label: "Public page", external: true },
    { href: "#", label: "Reports", disabled: true },
];

export function VettingAdminHeader() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const disableAuth = AUTH_DISABLED;
    const user =
        session?.user ??
        (disableAuth
            ? ({ firstName: "A.", lastName: "Kissimi", email: "vetting@nawehub.sl" } as const)
            : undefined);

    const first = user?.firstName?.[0] ?? "A";
    const last = user?.lastName?.[0] ?? "M";

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 shadow-sm backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-5 px-4 lg:px-6">
                <Link href="/admin/vetting" className="flex items-center gap-2.5">
                    <img
                        src="/images/wehub-sample-logo.png"
                        alt="NaWeHub Logo"
                        className="h-10 w-auto"
                    />
                    <span className="rounded-md bg-primary/10 px-2 py-0.5 font-display text-[11px] font-semibold uppercase tracking-wide text-primary-700 dark:text-primary-400">
                        Admin
                    </span>
                </Link>

                <nav className="ml-2 hidden items-center gap-1 md:flex">
                    {NAV.map((item) => {
                        const active = item.href !== "#" && pathname.startsWith(item.href);
                        if (item.disabled) {
                            return (
                                <span
                                    key={item.label}
                                    className="cursor-not-allowed rounded-md px-3 py-2 font-display text-sm font-medium text-muted-foreground/50"
                                >
                                    {item.label}
                                </span>
                            );
                        }
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                target={"external" in item && item.external ? "_blank" : undefined}
                                rel={"external" in item && item.external ? "noopener noreferrer" : undefined}
                                className={cn(
                                    "rounded-md px-3 py-2 font-display text-sm font-medium transition-colors",
                                    active
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:bg-neutral-100 hover:text-foreground dark:hover:bg-neutral-800"
                                )}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="ml-auto flex items-center gap-3">
                    <button
                        type="button"
                        className="relative grid h-9 w-9 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-neutral-100 hover:text-foreground dark:hover:bg-neutral-800"
                        aria-label="Notifications"
                    >
                        <Bell className="h-[18px] w-[18px]" />
                        <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-amber-400" />
                    </button>
                    <ThemeToggle />
                    <div className="flex items-center gap-2.5 border-l pl-3">
                        <span
                            className="grid h-9 w-9 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground"
                            aria-hidden
                        >
                            {first}
                            {last}
                        </span>
                        <span className="hidden leading-tight sm:block">
                            <b className="block text-sm font-semibold text-foreground">
                                {user?.firstName} {user?.lastName}
                            </b>
                            <span className="text-xs text-muted-foreground">Vetting Officer</span>
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
}
