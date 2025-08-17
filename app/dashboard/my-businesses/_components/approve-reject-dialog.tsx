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
import {useApproveRejectBusinessMutation} from "@/hooks/repository/use-business";
import {useToast} from "@/hooks/use-toast";
import {Button} from "@/components/ui/button";
import {formatResponse} from "@/utils/format-response";
import {error} from "next/dist/build/output/log";

interface ApproveRejectDialogProps {
    businessId: string;
    action: "Approve" | "Reject";
    openAlert: boolean;
    openAlertAction: (open: boolean) => void;
}

export function ApproveRejectDialog({businessId, action, openAlert, openAlertAction}: ApproveRejectDialogProps) {
    const [rejectionReason, setRejectionReason] = useState("");
    const [isPending, startTransition] = useTransition();
    const approveRejectMutation = useApproveRejectBusinessMutation();
    const {toast} = useToast();

    const handleApproveReject = async () => {
        startTransition(async () => {
            try {
                await approveRejectMutation.mutateAsync({
                    businessId,
                    action,
                    rejectionReason,
                })
                toast({
                    title: `${action} Business`,
                    description: `Business ${action == "Approve" ? 'approved' : 'rejected' } successfully`,
                    variant: 'default'
                })
                setRejectionReason("")
                openAlertAction(false)
            } catch (e) {
                toast({
                    title: `${action} Error`,
                    description: `${e instanceof Error ? formatResponse(e.message) : 'An unknown error occurred'}`,
                    variant: 'destructive'
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
                        This action cannot be undone. This will permanently {action === "Approve" ? "approve" : "reject"} this business.
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
                    {/*<Button disabled={isPending} onClick={(e) => {*/}
                    {/*    e.preventDefault()*/}
                    {/*    handleApproveReject().then()*/}
                    {/*}}>{action}</Button>*/}
                    <AlertDialogAction disabled={isPending} onClick={(e) => {
                        e.preventDefault()
                        handleApproveReject().then()
                    }}>
                        {isPending ? "Processing..." : action}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
