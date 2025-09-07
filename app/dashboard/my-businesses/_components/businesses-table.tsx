// BusinessesTable.tsx
import React, {useEffect, useMemo, useState} from "react";
import type { BusinessData } from "@/lib/services/business";
import {motion, AnimatePresence} from "framer-motion";
import {
    ChevronDown, Columns, Building2, Calendar, MapPin, User, Phone, Mail, Hash,
    CheckCircle, Clock, XCircle, Filter, Eye
} from "lucide-react";
import clsx from "clsx";

// Radix primitives (swap for your app's UI lib if desired)
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Checkbox from "@radix-ui/react-checkbox";
import {useIsMobile} from "@/hooks/use-mobile";

/* Lightweight UI primitives (replace with your Button/Input/Badge if you have them) */
function Button(
    props: React.ButtonHTMLAttributes<HTMLButtonElement> & {
        variant?: "default" | "outline" | "ghost" | "secondary";
        size?: "sm" | "md";
    }
) {
    const {variant = "default", size = "md", className, ...rest} = props;
    return (
        <button
            {...rest}
            className={clsx(
                "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
                "focus:ring-emerald-600 focus:ring-offset-white dark:focus:ring-offset-slate-900",
                variant === "default" && "bg-emerald-600 text-white hover:bg-emerald-700",
                variant === "outline" && "border border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800",
                variant === "ghost" && "hover:bg-slate-100 dark:hover:bg-slate-800",
                variant === "secondary" && "bg-slate-800 text-white hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600",
                size === "sm" ? "h-8 px-3 text-sm" : "h-10 px-4",
                className
            )}
        />
    );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            className={clsx(
                "h-10 w-full rounded-md border bg-white px-3 text-sm outline-none placeholder:text-slate-400",
                "border-slate-200 focus:ring-2 focus:ring-emerald-600",
                "dark:bg-slate-900 dark:text-slate-200 dark:placeholder:text-slate-500 dark:border-slate-700",
                props.className
            )}
        />
    );
}

function Badge(
    props: React.HTMLAttributes<HTMLSpanElement> & {
        variant?: "success" | "warning" | "error" | "neutral";
    }
) {
    const {variant = "neutral", className, ...rest} = props;
    return (
        <span
            {...rest}
            className={clsx(
                "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium",
                // light
                variant === "success" && "bg-green-50 text-green-700 border-green-200",
                variant === "warning" && "bg-yellow-50 text-yellow-700 border-yellow-200",
                variant === "error" && "bg-red-50 text-red-700 border-red-200",
                variant === "neutral" && "bg-slate-50 text-slate-700 border-slate-200",
                // dark
                variant === "success" && "dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
                variant === "warning" && "dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800",
                variant === "error" && "dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
                variant === "neutral" && "dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700",
                className
            )}
        />
    );
}

/* Types and props */
type BusinessesTableProps = {
    data: BusinessData[];
    loading?: boolean;
    initialVisible?: string[];  // keys from columnsConfig
    storageKey?: string;        // localStorage key for column visibility
    onView?: (business: BusinessData) => void;
};

type ColumnKey =
    | keyof BusinessData
    | "status.state"
    | "status.rejectionReason"
    | "status.statusActionDate";

type ColumnConfig = {
    key: ColumnKey;
    label: string;
    width?: string; // Tailwind width classes
    render?: (b: BusinessData) => React.ReactNode;
    lockVisible?: boolean; // user cannot hide this column (Business Name)
};

/* Helpers */
const normalizeBizStatus = (val?: string) => {
    const s = (val || "").toLowerCase();
    if (["approved", "approve"].includes(s)) return "approved";
    if (["pending", "awaiting"].includes(s)) return "pending";
    if (["rejected", "reject"].includes(s)) return "rejected";
    return s || "pending";
};

const BizStatusBadge = ({ state }: { state?: string }) => {
    const s = normalizeBizStatus(state);
    const icon =
        s === "approved" ? <CheckCircle className="h-3.5 w-3.5" /> :
            s === "rejected" ? <XCircle className="h-3.5 w-3.5" /> :
                <Clock className="h-3.5 w-3.5" />;

    const variant =
        s === "approved" ? "success" :
            s === "rejected" ? "error" : "warning";

    return (
        <Badge variant={variant}>
            <span className="mr-1">{icon}</span>
            <span className="capitalize">{s}</span>
        </Badge>
    );
};

/* Columns configuration */
const columnsConfig: ColumnConfig[] = [
    {
        key: "businessName",
        label: "Business Name",
        width: "w-64",
        lockVisible: true,
        render: (b) => (
            <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center dark:bg-emerald-900/30 dark:text-emerald-300">
                    <Building2 className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                    <div className="font-semibold truncate text-slate-900 dark:text-slate-100">{b.businessName}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{b.category}</div>
                </div>
            </div>
        )
    },
    { key: "ownerName", label: "Owner", width: "w-48", render: (b) => (
            <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                <User className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                <span className="truncate">{b.ownerName}</span>
            </div>
        )},
    { key: "businessAddress", label: "Address", width: "w-72", render: (b) => (
            <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                <MapPin className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                <span className="truncate">{b.businessAddress}</span>
            </div>
        )},
    { key: "contactNumber", label: "Phone", width: "w-40", render: (b) => (
            <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                <Phone className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                <span className="truncate">{b.contactNumber}</span>
            </div>
        )},
    { key: "email", label: "Email", width: "w-56", render: (b) => (
            <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                <Mail className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                <span className="truncate">{b.email}</span>
            </div>
        )},
    { key: "registrationNumber", label: "Reg. No.", width: "w-40", render: (b) => (
            <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                <Hash className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                <span className="truncate">{b.registrationNumber || "-"}</span>
            </div>
        )},
    { key: "registerDate", label: "Registered", width: "w-40", render: (b) => (
            <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                <Calendar className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                <span className="truncate">{b.registerDate ? new Date(b.registerDate).toLocaleDateString() : "-"}</span>
            </div>
        )},
    { key: "status.state", label: "Status", width: "w-36", render: (b) => <BizStatusBadge state={b.status?.state} /> },
    { key: "status.rejectionReason", label: "Rejection Reason", width: "w-80", render: (b) => (
            <span className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">{b.status?.rejectionReason || "-"}</span>
        )},
];

/* Sticky right Actions column width */
const ACTION_COL_WIDTH = "w-28";

/* Main component */
export function BusinessesTable({data, loading, initialVisible, storageKey = "biz-table-columns", onView}: BusinessesTableProps) {
    const isMobile = useIsMobile();
    // visible columns (persisted)
    const defaultVisible = useMemo(() => {
        const base = ["businessName", "ownerName", "businessAddress", "contactNumber", "registerDate", "status.state"];
        if (initialVisible?.length) return Array.from(new Set(["businessName", ...initialVisible]));
        return base;
    }, [initialVisible]);

    const [visibleKeys, setVisibleKeys] = useState<string[]>(defaultVisible);
    useEffect(() => {
        const raw = typeof window !== "undefined" ? window.localStorage.getItem(storageKey) : null;
        if (raw) {
            try {
                const parsed = JSON.parse(raw) as string[];
                const enforced = Array.from(new Set(["businessName", ...parsed]));
                setVisibleKeys(enforced);
            } catch { /* ignore */ }
        }
    }, [storageKey]);

    useEffect(() => {
        if (typeof window === "undefined") return;
        window.localStorage.setItem(storageKey, JSON.stringify(visibleKeys));
    }, [visibleKeys, storageKey]);

    const toggleColumn = (key: string, lockVisible?: boolean) => {
        if (lockVisible) return;
        setVisibleKeys(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
    };
    const setAll = () => setVisibleKeys(Array.from(new Set(columnsConfig.map(c => c.key as string))));
    const clearAll = () => setVisibleKeys(["businessName"]);

    const visibleColumns = columnsConfig.filter(c => visibleKeys.includes(c.key as string));

    // search and status filters
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | "approved" | "pending" | "rejected">("all");

    const filtered = useMemo(() => {
        let result = data;
        if (search) {
            const q = search.toLowerCase();
            result = result.filter(b =>
                b.businessName.toLowerCase().includes(q) ||
                b.ownerName.toLowerCase().includes(q) ||
                b.category.toLowerCase().includes(q) ||
                b.registrationNumber?.toLowerCase().includes(q)
            );
        }
        if (statusFilter !== "all") {
            result = result.filter(b => normalizeBizStatus(b.status?.state) === statusFilter);
        }
        return result;
    }, [data, search, statusFilter]);

    // Status chip button
    const StatusChip = ({
                            value,
                            label,
                            icon
                        }: { value: "all" | "approved" | "pending" | "rejected"; label: string; icon?: React.ReactNode }) => {
        const active = statusFilter === value;
        return (
            <Button
                type="button"
                size="sm"
                variant={active ? "secondary" : "ghost"}
                className={clsx(
                    "h-8 px-2.5",
                    active
                        ? "bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600"
                        : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                )}
                onClick={() => setStatusFilter(value)}
                aria-pressed={active}
            >
        <span className="flex items-center gap-1.5">
          {icon}
            {label}
        </span>
            </Button>
        );
    };

    return (
        <div className="space-y-4">
            {/* Controls */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center">
                    <div className="relative w-full sm:max-w-sm">
                        <Input
                            placeholder="Search businesses, owners, category, reg. no..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Filter className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none dark:text-slate-500" />
                    </div>

                    {/* Status filter chips */}
                    <div className="flex items-center gap-1.5">
                        <StatusChip value="all" label="All" />
                        <StatusChip value="approved" label="Approved" icon={<CheckCircle className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />} />
                        <StatusChip value="pending" label="Pending" icon={<Clock className="h-3.5 w-3.5 text-yellow-600 dark:text-yellow-400" />} />
                        <StatusChip value="rejected" label="Rejected" icon={<XCircle className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />} />
                    </div>
                </div>

                {/* Column chooser */}
                {!isMobile && (
                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                            <Button variant="outline" className="inline-flex items-center gap-2">
                                <Columns className="h-4 w-4" />
                                Columns
                                <ChevronDown className="h-4 w-4 opacity-70" />
                            </Button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content
                            className={clsx(
                                "z-50 min-w-[260px] rounded-md border p-2 shadow-md bg-white border-slate-200",
                                "dark:bg-slate-900 dark:border-slate-700"
                            )}
                            sideOffset={8}
                        >
                            <div className="px-2 py-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                                Toggle columns
                            </div>
                            <div className="max-h-64 overflow-auto pr-1">
                                {columnsConfig.map(col => {
                                    const checked = visibleKeys.includes(col.key as string);
                                    const disabled = !!col.lockVisible;
                                    return (
                                        <DropdownMenu.Item
                                            key={col.key}
                                            className="px-2 py-1.5 outline-none"
                                            onSelect={(e) => e.preventDefault()}
                                        >
                                            <label
                                                className={clsx(
                                                    "flex items-center gap-2 text-sm",
                                                    "text-slate-700 dark:text-slate-200",
                                                    disabled ? "opacity-50" : "cursor-pointer"
                                                )}
                                            >
                                                <Checkbox.Root
                                                    checked={checked}
                                                    disabled={disabled}
                                                    onCheckedChange={() => toggleColumn(col.key as string, col.lockVisible)}
                                                    className={clsx(
                                                        "flex h-4 w-4 items-center justify-center rounded border",
                                                        checked
                                                            ? "bg-emerald-600 border-emerald-600 text-white"
                                                            : "bg-white border-slate-300 dark:bg-slate-800 dark:border-slate-600"
                                                    )}
                                                >
                                                    <Checkbox.Indicator>
                                                        <svg viewBox="0 0 24 24" className="h-3 w-3 fill-current">
                                                            <path d="M20.285 6.708a1 1 0 0 0-1.414-1.416L9 15.164l-3.879-3.88a1 1 0 1 0-1.414 1.415l4.586 4.587a1 1 0 0 0 1.414 0l10.578-10.578Z" />
                                                        </svg>
                                                    </Checkbox.Indicator>
                                                </Checkbox.Root>
                                                <span>{col.label}</span>
                                            </label>
                                        </DropdownMenu.Item>
                                    );
                                })}
                            </div>
                            <div className="mt-2 flex items-center justify-between gap-2 px-2">
                                <Button variant="ghost" size="sm" onClick={clearAll}>Show minimal</Button>
                                <Button variant="ghost" size="sm" onClick={setAll}>Show all</Button>
                            </div>
                        </DropdownMenu.Content>
                    </DropdownMenu.Root>
                )}
            </div>

            {/* Mobile view: compact cards */}
            <div className="grid gap-3 md:hidden">
                {loading && (
                    <div className="rounded-md border text-center p-6 text-sm text-slate-500 border-slate-200 dark:border-slate-700 dark:text-slate-400 dark:bg-slate-900">
                        Loading businesses…
                    </div>
                )}
                {!loading && filtered.length === 0 && (
                    <div className="rounded-md border p-6 text-sm text-slate-500 border-slate-200 dark:border-slate-700 dark:text-slate-400 dark:bg-slate-900">
                        No businesses found
                    </div>
                )}
                <AnimatePresence>
                    {filtered.map((b) => (
                        <motion.div
                            key={b.id}
                            initial={{opacity: 0, y: 8}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -8}}
                            transition={{duration: 0.18}}
                            className="rounded-xl border-2 border-slate-100 bg-white p-4 shadow-sm dark:bg-slate-900 dark:border-slate-800"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <div className="text-base font-semibold text-slate-900 dark:text-slate-100">{b.businessName}</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400">{b.category}</div>
                                </div>
                                <BizStatusBadge state={b.status?.state} />
                            </div>
                            <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-slate-700 dark:text-slate-200">
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-slate-400 dark:text-slate-500" /><span className="truncate">{b.ownerName}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-slate-400 dark:text-slate-500" /><span className="truncate">{b.businessAddress}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-slate-400 dark:text-slate-500" /><span>{b.status.state == "Approved" ? "Formalized" : b.status.state == "Pending" ? "Registration Processing" : "Not Formalized"}</span>
                                </div>
                            </div>
                            <div className="mt-3">
                                <Button variant="outline" className={'w-full'} size="sm" onClick={() => onView?.(b)}>
                                    <Eye className="h-4 w-4 mr-2" /> View
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Desktop/tablet: table with sticky left/right and dark mode */}
            <div className="hidden md:block">
                <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                    <table className="min-w-full border-collapse">
                        <thead>
                        <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                            {visibleColumns.map((col, idx) => (
                                <th
                                    key={col.key}
                                    className={clsx(
                                        "whitespace-nowrap border-b px-4 py-3",
                                        "border-slate-200 dark:border-slate-700",
                                        "bg-slate-50/60 backdrop-blur supports-[backdrop-filter]:bg-slate-50/40",
                                        "dark:bg-slate-800/70 dark:supports-[backdrop-filter]:bg-slate-800/60",
                                        col.width,
                                        idx === 0 && "sticky left-0 z-10"
                                    )}
                                >
                                    {col.label}
                                </th>
                            ))}
                            <th
                                className={clsx(
                                    "whitespace-nowrap border-b px-4 py-3 text-right sticky right-0 z-10",
                                    "border-slate-200 dark:border-slate-700",
                                    "bg-slate-50/60 backdrop-blur supports-[backdrop-filter]:bg-slate-50/40",
                                    "dark:bg-slate-800/70 dark:supports-[backdrop-filter]:bg-slate-800/60",
                                    ACTION_COL_WIDTH
                                )}
                            >
                                Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody className="text-sm">
                        {loading && (
                            <tr>
                                <td className="px-4 py-6 text-slate-500 dark:text-slate-400" colSpan={visibleColumns.length + 1}>
                                    Loading businesses…
                                </td>
                            </tr>
                        )}
                        {!loading && filtered.length === 0 && (
                            <tr>
                                <td className="px-4 py-6 text-slate-500 dark:text-slate-400" colSpan={visibleColumns.length + 1}>
                                    No businesses found
                                </td>
                            </tr>
                        )}

                        <AnimatePresence initial={false}>
                            {!loading && filtered.map((b, rowIndex) => (
                                <motion.tr
                                    key={b.id}
                                    initial={{opacity: 0, y: 8}}
                                    animate={{opacity: 1, y: 0}}
                                    exit={{opacity: 0, y: -8}}
                                    transition={{duration: 0.18, delay: rowIndex * 0.01}}
                                    className={clsx(
                                        "group hover:bg-emerald-50/40 dark:hover:bg-emerald-900/10",
                                        "even:bg-white odd:bg-slate-50/30",
                                        "dark:even:bg-slate-900 dark:odd:bg-slate-900/60",
                                        "text-slate-800 dark:text-slate-200"
                                    )}
                                >
                                    {visibleColumns.map((col, idx) => (
                                        <td
                                            key={String(col.key)}
                                            className={clsx(
                                                "border-b px-4 py-3 align-top",
                                                "border-slate-100 dark:border-slate-800",
                                                col.width,
                                                idx === 0 &&
                                                "sticky left-0 z-10 bg-white group-hover:bg-emerald-50/60 dark:bg-slate-900 dark:group-hover:bg-emerald-900/10"
                                            )}
                                        >
                                            {col.render ? col.render(b) : (
                                                <span className="truncate block">
                            {String(col.key).startsWith("status.")
                                ? String(col.key) === "status.state"
                                    ? <BizStatusBadge state={b.status?.state} />
                                    : String(col.key) === "status.rejectionReason"
                                        ? (b.status?.rejectionReason || "-")
                                        : (b.status?.statusActionDate || "-")
                                : (b[col.key as keyof BusinessData] as any) ?? "-"
                            }
                          </span>
                                            )}
                                        </td>
                                    ))}
                                    <td
                                        className={clsx(
                                            "border-b px-4 py-3 text-right sticky right-0 z-10",
                                            "border-slate-100 dark:border-slate-800",
                                            "bg-white group-hover:bg-emerald-50/60 dark:bg-slate-900 dark:group-hover:bg-emerald-900/10",
                                            ACTION_COL_WIDTH
                                        )}
                                    >
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 dark:border-emerald-900 dark:hover:bg-emerald-900/20 dark:hover:border-emerald-800"
                                            onClick={() => onView?.(b)}
                                        >
                                            <Eye className="h-4 w-4 mr-1" /> View
                                        </Button>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}