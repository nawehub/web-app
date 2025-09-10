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
import {useTransition} from "react";
import {toast} from "sonner";
import {formatResponse} from "@/utils/format-response";
import {useApproveRejectUserMutation} from "@/hooks/repository/use-user";

interface ApproveRejectDialogProps {
    userId: string;
    action: "Approve" | "Reject";
    openAlert: boolean;
    openAlertAction: (open: boolean) => void;
    openModalAction: (close: boolean) => void;
}

export function ApproveRejectUserDialog({userId, action, openAlert, openAlertAction, openModalAction}: ApproveRejectDialogProps) {
    const [isPending, startTransition] = useTransition();
    const approveRejectMutation = useApproveRejectUserMutation();

    const handleSubmit = async () => {
        startTransition(async () => {
            try {
                await approveRejectMutation.mutateAsync({
                    userId: userId,
                    action,
                })
            } catch (error) {
                toast(`${action} Error`, {
                    description: `${error instanceof Error ? formatResponse(error.message) : 'An unknown error occurred'}`,
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
                        permanently {action === "Approve" ? "approve" : "reject"} this partner.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                    <IfAllowed>
                        <AlertDialogAction disabled={isPending} onClick={() => handleSubmit().then(() => {
                            toast(`${action} Partner`, {
                                description: `User ${action == "Approve" ? 'approved' : 'rejected'} successfully`,
                            })
                            openAlertAction(false)
                            openModalAction(false)
                        })}>
                            {isPending ? "Processing..." : action}
                        </AlertDialogAction>
                    </IfAllowed>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
