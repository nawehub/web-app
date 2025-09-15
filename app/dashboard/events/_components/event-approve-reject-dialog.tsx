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
import {useApproveRejectEventMutation} from "@/hooks/repository/use-events";

interface ApproveRejectDialogProps {
    evtId: string;
    action: "Approve" | "Reject";
    openAlert: boolean;
    openAlertAction: (open: boolean) => void;
}

export function EventApproveRejectDialog({evtId, action, openAlert, openAlertAction}: ApproveRejectDialogProps) {
    const [rejectionReason, setRejectionReason] = useState("");
    const [isPending, startTransition] = useTransition();
    const approveRejectMutation = useApproveRejectEventMutation(evtId);

    const handleApproveReject = async () => {
        startTransition(async () => {
            try {
                await approveRejectMutation.mutateAsync({
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
                        permanently {action === "Approve" ? "approve" : "reject"} this event.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                {action === "Reject" && (
                    <IfAllowed permission="full:access" fallback={null}>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Rejection Reason</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <Textarea
                                        placeholder="Add your rejection reason here..."
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        rows={4}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </IfAllowed>
                )}
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                    <AlertDialogAction disabled={isPending} onClick={(e) => {
                        e.preventDefault()
                        handleApproveReject().then(() => {
                            toast(`${action} Event`, {
                                description: `Event ${action == "Approve" ? 'approved' : 'rejected'} successfully`,
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
