'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {useCreateFolderMutation} from '@/hooks/repository/use-resources';
import { useToast } from '@/hooks/use-toast';
import {formatResponse} from "@/utils/format-response";

interface CreateFolderDialogProps {
    open: boolean;
    onOpenChangeAction: (open: boolean) => void;
    parentId?: string;
}

export function CreateFolderDialog({ open, onOpenChangeAction }: CreateFolderDialogProps) {
    const [folderName, setFolderName] = useState('');
    const { toast } = useToast();

    const createFolderMutation = useCreateFolderMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!folderName.trim()) {
            toast({
                title: 'Error',
                description: 'Please enter a folder name',
                variant: 'destructive',
            });
            return;
        }

        try {
            await createFolderMutation.mutateAsync({
                name: folderName.trim()
            });

            toast({
                title: 'Success',
                description: 'Folder created successfully',
            });

            setFolderName('');
            onOpenChangeAction(false);
        } catch (error) {
            toast({
                title: 'Create Error',
                description: `${error instanceof Error ? formatResponse(error.message) : 'Unknown error'}`,
                variant: 'destructive',
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChangeAction}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Folder</DialogTitle>
                    <DialogDescription>
                        Enter a name for your new folder.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="folderName">Folder Name</Label>
                            <Input
                                id="folderName"
                                value={folderName}
                                onChange={(e) => setFolderName(e.target.value)}
                                placeholder="Enter folder name"
                                autoFocus
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChangeAction(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={createFolderMutation.isPending || !folderName.trim()}
                        >
                            {createFolderMutation.isPending ? 'Creating...' : 'Create Folder'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}