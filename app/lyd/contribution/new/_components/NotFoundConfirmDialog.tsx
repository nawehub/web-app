import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface ConfirmDialogProps {
    open: boolean;
    onOpenChangeAction: (open: boolean) => void;
    onContinueAction: () => void;
}

export function NotFoundConfirmDialog({ open, onOpenChangeAction, onContinueAction }: ConfirmDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChangeAction}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{'Missing Account'}</AlertDialogTitle>
                    <AlertDialogDescription>
                        No contribution found for this number.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Search Again</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onContinueAction()}>Start Fresh</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
