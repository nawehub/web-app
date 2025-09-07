import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import {
    Building2,
    Calendar,
    CheckCircle,
    Clock,
    User,
    XCircle,
    Globe,
    IdCard
} from "lucide-react";
import {BusinessData} from "@/lib/services/business";
import {useMemo, useRef} from "react";
import {cn} from "@/lib/utils";
import {IfAllowed} from "@/components/auth/IfAllowed";
import {useIsMobile} from "@/hooks/use-mobile";

type BusinessDetailsModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    business: BusinessData | null;
    onStatusChange?: (status: "Approve" | "Reject") => void;
    showAlert: (show: boolean) => void;
};

export function BusinessDetailsModal({
                                         open,
                                         onOpenChange,
                                         business,
                                         onStatusChange,
                                         showAlert
                                     }: BusinessDetailsModalProps) {
    const printRef = useRef<HTMLDivElement>(null);
    const isMobile = useIsMobile();

    const statusMeta = useMemo(() => {
        const s = (business?.status.state || "").toLowerCase();
        if (s === "approved") {
            return {
                label: "Approved",
                icon: <CheckCircle className="h-4 w-4 mr-1"/>,
                className:
                    "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800"
            };
        }
        if (s === "pending") {
            return {
                label: "Pending",
                icon: <Clock className="h-4 w-4 mr-1"/>,
                className:
                    "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-800"
            };
        }
        if (s === "rejected") {
            return {
                label: "Rejected",
                icon: <XCircle className="h-4 w-4 mr-1"/>,
                className:
                    "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-800"
            };
        }
        return {
            label: business?.status.state ?? "Unknown",
            icon: null,
            className:
                "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700"
        };
    }, [business?.status.state]);

    const formatDate = (d?: string) => {
        if (!d) return "N/A";
        const dt = new Date(d);
        return isNaN(dt.getTime()) ? d : dt.toLocaleDateString();
    };

    const InfoRow = ({label, value}: { label: string; value?: string }) => (
        <div className="flex items-start justify-between gap-3 py-2">
            <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
            <span className="text-sm font-medium text-slate-900 dark:text-slate-100 text-right">{value || "N/A"}</span>
        </div>
    );

    // Print the content inside printRef via a hidden iframe (reliable, no blank windows)
    const handlePrint = () => {
        if (!printRef.current || !business) return;
        const title = `${business.businessName} — Registration Details`;
        const printableHTML = `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${title}</title>
    <style>
      @page { margin: 12mm; }
      html, body { padding: 0; margin: 0; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"; color: #0f172a; }
      .container { width: 100%; padding: 0; margin: 0; }
      .print-header { margin: 0 0 12px 0; }
      .h1 { font-size: 20px; font-weight: 700; color: #0f172a; margin: 0; }
      .meta { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; margin-top: 6px; font-size: 12px; color: #334155; }
      .badge { display: inline-flex; align-items: center; gap: 6px; border: 1px solid #cbd5e1; background: #f8fafc; color: #0f172a; border-radius: 999px; padding: 2px 8px; line-height: 1.4; }
      .separator { height: 1px; background: #e2e8f0; margin: 10px 0 14px; }
      .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
      .card { border: 1px solid #e2e8f0; border-radius: 8px; background: #ffffff; }
      .card-header { display: flex; align-items: center; gap: 8px; border-bottom: 1px solid #e2e8f0; padding: 10px 12px; font-weight: 600; color: #0f172a; }
      .card-body { padding: 10px 12px; }
      .row { display: flex; justify-content: space-between; gap: 8px; padding: 6px 0; page-break-inside: avoid; }
      .label { color: #64748b; font-size: 12px; }
      .value { color: #0f172a; font-size: 12px; font-weight: 600; text-align: right; max-width: 70%; }
      .status-approved { border-color: #86efac; background: #f0fdf4; color: #166534; }
      .status-pending { border-color: #fde68a; background: #fffbeb; color: #92400e; }
      .status-rejected { border-color: #fecaca; background: #fef2f2; color: #991b1b; }
      .status-unknown { border-color: #cbd5e1; background: #f8fafc; color: #0f172a; }
      .page-break-avoid { break-inside: avoid; page-break-inside: avoid; }
    </style>
  </head>
  <body>
    <div class="container">${printRef.current.innerHTML}</div>
    <script>
      window.onload = function () {
        window.focus();
        window.print();
        setTimeout(() => window.close(), 100);
      };
    </script>
  </body>
</html>`.trim();

        const iframe = document.createElement("iframe");
        iframe.style.position = "fixed";
        iframe.style.right = "0";
        iframe.style.bottom = "0";
        iframe.style.width = "0";
        iframe.style.height = "0";
        iframe.style.border = "0";
        document.body.appendChild(iframe);

        const doc = iframe.contentWindow?.document;
        if (!doc) return;
        doc.open();
        doc.write(printableHTML);
        doc.close();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className={cn(
                    "sm:max-w-3xl md:max-w-6xl p-0 mt-3 border",
                    "rounded-none sm:rounded-xl",
                    "bg-white border-slate-200 text-slate-900",
                    "dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
                )}
            >
                {/* Fixed header (does not scroll) */}
                <div
                    className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white px-6 py-5 dark:from-emerald-700 dark:via-teal-700 dark:to-cyan-700">
                    <DialogHeader className="space-y-1">
                        <DialogTitle className="text-xl sm:text-2xl font-bold flex items-start justify-between gap-3">
                              <span className="inline-flex items-center gap-2">
                                <Building2 className="h-5 w-5 opacity-90"/>
                                  {business?.businessName ?? "Business Details"}
                              </span>
                            {business && (
                                <Badge className={cn("border", statusMeta.className)}>
                                    {statusMeta.icon}
                                    <span className="capitalize">{statusMeta.label}</span>
                                </Badge>
                            )}
                        </DialogTitle>
                        <DialogDescription className="text-white/90">
                            Complete business registration details
                        </DialogDescription>
                    </DialogHeader>
                </div>

                {/* Scrollable body (only this scrolls) */}
                <div className="max-h-[70vh] overflow-y-auto">
                    {/* Printable area: includes a clean print header and full data set */}
                    <div className={`px-6 ${isMobile ? 'pt-1 pb-6' : 'py-6'}`} ref={printRef}>
                        {business && (
                            <div className="page-break-avoid">
                                <div className="print-header">
                                    {!isMobile && (
                                        <div
                                            className="text-xl font-bold text-slate-900 dark:text-slate-200">{business.businessName}</div>
                                    )}
                                    <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                                        <span
                                            className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-slate-50 px-2 py-0.5">
                                          <IdCard className="h-3.5 w-3.5"/> <span className={'dark:text-slate-800'}>Reg. No: {business.registrationNumber || "—"}</span>
                                        </span>
                                        {!isMobile && (
                                            <>
                                                <span
                                                    className="inline-flex items-center gap-1 rounded-full border text-slate-800 border-slate-300 bg-slate-50 px-2 py-0.5">
                                                    <Calendar className="h-3.5 w-3.5"/><span
                                                    className={'dark:text-slate-800'}> Registered: {formatDate(business.registerDate)}</span>
                                                </span>
                                                <span
                                                    className="inline-flex items-center gap-1 rounded-full border text-slate-800 border-slate-300 bg-slate-50 dark:text-slate-800 px-2 py-0.5 capitalize">
                                                  Category: {business.category || "—"}
                                                </span>
                                                <span className="ml-auto text-slate-600">
                                                    Last action: {formatDate(business.status.statusActionDate)}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="h-px bg-slate-200 my-3"/>
                            </div>
                        )}

                        {/* Content grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Business Information */}
                            <div
                                className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900/60">
                                <div
                                    className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
                                    <Building2 className="h-4 w-4 text-emerald-600"/>
                                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Business
                                        Information</h4>
                                </div>
                                <div className="px-4 py-2">
                                    <InfoRow label="Name" value={business?.businessName}/>
                                    <Separator className="my-2"/>
                                    <InfoRow label="Category" value={business?.category}/>
                                    <Separator className="my-2"/>
                                    <InfoRow label="Entity Type" value={business?.businessEntityType}/>
                                    <Separator className="my-2"/>
                                    <InfoRow label="Address" value={business?.businessAddress}/>
                                    <Separator className="my-2"/>
                                    <InfoRow label="Business Activities" value={business?.businessActivities}/>
                                    <Separator className="my-2"/>
                                    <InfoRow label="Registration Number" value={business?.registrationNumber}/>
                                    <Separator className="my-2"/>
                                    <InfoRow label="Registration Date" value={formatDate(business?.registerDate)}/>
                                    <Separator className="my-2"/>
                                    <InfoRow label="Created At" value={formatDate(business?.createdAt)}/>
                                    <Separator className="my-2"/>
                                    <InfoRow label="Updated At" value={formatDate(business?.updatedAt)}/>
                                </div>
                            </div>

                            {/* Owner Information */}
                            <div
                                className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900/60">
                                <div
                                    className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
                                    <User className="h-4 w-4 text-emerald-600"/>
                                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Owner
                                        Information</h4>
                                </div>
                                <div className="px-4 py-2">
                                    <InfoRow label="Owner Name" value={business?.ownerName}/>
                                    <Separator className="my-2"/>
                                    <InfoRow label="Gender" value={business?.gender}/>
                                    <Separator className="my-2"/>
                                    <InfoRow label="Date of Birth" value={formatDate(business?.dateOfBirth)}/>
                                    <Separator className="my-2"/>
                                    <InfoRow label="Place of Birth" value={business?.placeOfBirth}/>
                                    <Separator className="my-2"/>
                                    <InfoRow label="Mother's Name" value={business?.mothersName}/>
                                    <Separator className="my-2"/>
                                    <InfoRow label="Nationality" value={business?.nationality}/>
                                    <Separator className="my-2"/>
                                    <InfoRow label="Owner Address" value={business?.ownerAddress}/>
                                    <Separator className="my-2"/>
                                    <InfoRow label="Contact Number" value={business?.contactNumber}/>
                                    <Separator className="my-2"/>
                                    <InfoRow label="Email" value={business?.email}/>
                                </div>
                            </div>

                            {/* Status */}
                            <div
                                className="rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900/60 md:col-span-2">
                                <div
                                    className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
                                    <Globe className="h-4 w-4 text-emerald-600"/>
                                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Registration
                                        Status</h4>
                                </div>
                                <div className="px-4 py-2">
                                    <div className="flex items-center justify-between">
                                        <span
                                            className="text-sm text-slate-500 dark:text-slate-400">Current State</span>
                                        <Badge className={cn("border", statusMeta.className)}>
                                            {statusMeta.icon}
                                            <span className="capitalize">{statusMeta.label}</span>
                                        </Badge>
                                    </div>
                                    {business?.status.rejectionReason && (
                                        <>
                                            <Separator className="my-3"/>
                                            <div>
                                                <div
                                                    className="text-sm text-slate-500 dark:text-slate-400 mb-1">Rejection
                                                    Reason
                                                </div>
                                                <div
                                                    className="text-sm text-red-900 dark:text-red-200 bg-red-50 border border-red-200 dark:bg-red-900/30 dark:border-red-800 rounded-lg p-3">
                                                    {business.status.rejectionReason}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 text-xs text-slate-500">
                            Printed on {new Date().toLocaleString()}
                        </div>
                    </div>
                </div>

                {/* Footer actions (fixed under scrollable area) */}
                <div className="px-6 pb-6 mb-4 pt-2 flex flex-row justify-between gap-3">
                    <div className="flex space-x-2">
                        {!isMobile && (
                            <Button variant="outline" onClick={() => onOpenChange(false)}
                                    className="dark:hover:bg-slate-800">
                                Close
                            </Button>
                        )}
                        {business?.status.state === "Pending" && (
                            <IfAllowed>
                                <>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="text-green-600 hover:text-green-700 bg-transparent"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            onStatusChange("Approve")
                                            showAlert(true)
                                        }}
                                    >
                                        <CheckCircle className="h-4 w-4 mr-1"/>
                                        Approve
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="text-red-600 hover:text-red-700 bg-transparent"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            onStatusChange("Reject")
                                            showAlert(true)
                                        }}
                                    >
                                        <XCircle className="h-4 w-4 mr-1"/>
                                        Reject
                                    </Button>
                                </>
                            </IfAllowed>
                        )}
                    </div>
                    <div className="flex gap-2">
                        {!isMobile && (
                            <Button onClick={handlePrint} className="bg-emerald-600 hover:bg-emerald-700">
                                Print
                            </Button>
                        )}
                        <Button onClick={() => onOpenChange(false)} className="bg-emerald-600 hover:bg-emerald-700">
                            Done
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}