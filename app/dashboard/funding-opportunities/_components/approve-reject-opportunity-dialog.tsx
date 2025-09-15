import {
    AlertDialog, AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {IfAllowed} from "@/components/auth/IfAllowed";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Textarea} from "@/components/ui/textarea";
import {useState, useTransition} from "react";
import {toast} from "sonner";
import {formatResponse} from "@/utils/format-response";
import {useApproveRejectOpportunityMutation} from "@/hooks/repository/use-funding";
import {Switch} from "@/components/ui/switch";
import {Label} from "@/components/ui/label";

interface ApproveRejectDialogProps {
    oppId: string;
    action: "Approve" | "Reject";
    openAlert: boolean;
    openAlertAction: (open: boolean) => void;
}

export function ApproveRejectOpportunityDialog({oppId, action, openAlert, openAlertAction}: ApproveRejectDialogProps) {
    const [rejectionReason, setRejectionReason] = useState("");
    const [isFeatured, setIsFeatured] = useState(false);
    const [isPending, startTransition] = useTransition();
    const approveRejectMutation = useApproveRejectOpportunityMutation(oppId);

    const handleApproveReject = async () => {
        startTransition(async () => {
            try {
                await approveRejectMutation.mutateAsync({
                    isFeatured,
                    action,
                    rejectionReason,
                })
            } catch (e) {
                toast(`${action} Error`,{
                    description: `${e instanceof Error ? formatResponse(e.message) : 'An unknown error occurred'}`,
                })
            }
        })
    }
    return (
        <AlertDialog open={openAlert} onOpenChange={openAlertAction}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will
                        permanently {action === "Approve" ? "approve" : "reject"} this opportunity.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <IfAllowed permission="full:access" fallback={null}>
                    <Card>
                        <CardHeader>
                            <CardTitle
                                className="text-lg">{action === "Approve" ? "Featured Opportunity *" : "Rejection Reason"}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {action === "Reject" ? (
                                <div className="space-y-3">
                                    <Textarea
                                        placeholder="Add your rejection reason here..."
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        rows={4}
                                    />
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <Label>Make this opportunity featured by turning on the switch </Label>
                                    <div className="flex items-center space-x-2">
                                        <Switch id="featured" checked={isFeatured} onCheckedChange={(checked) => setIsFeatured(checked)} />
                                        <Label htmlFor="featured">Featured</Label>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </IfAllowed>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                    <AlertDialogAction disabled={isPending} onClick={(e) => {
                        e.preventDefault()
                        handleApproveReject().then(() => {
                            toast(`${action} Opportunity`, {
                                description: `Opportunity ${action == "Approve" ? 'approved' : 'rejected'} successfully`,
                            })
                            setRejectionReason("")
                            openAlertAction(false)
                        })
                    }}>
                        {isPending ? "Processing..." : action}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
