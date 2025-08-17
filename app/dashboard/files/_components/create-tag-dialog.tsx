'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {useCreateTagMutation} from '@/hooks/repository/use-resources';
import { useToast } from '@/hooks/use-toast';

interface CreateTagDialogProps {
    open: boolean;
    onOpenChangeAction: (open: boolean) => void;
}

export function CreateTagDialog({ open, onOpenChangeAction }: CreateTagDialogProps) {
    const [tagName, setTagName] = useState('');
    const { toast } = useToast();

    const tagMutation = useCreateTagMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!tagName.trim()) {
            toast({
                title: 'Error',
                description: 'Please enter a tag name',
                variant: 'destructive',
            });
            return;
        }

        try {
            await tagMutation.mutateAsync({
                name: tagName.trim()
            });

            toast({
                title: 'Success',
                description: 'Tag created successfully',
            });

            setTagName('');
            onOpenChangeAction(false);
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to create tag',
                variant: 'destructive',
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChangeAction}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Tag</DialogTitle>
                    <DialogDescription>
                        Enter a name for your new tag.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="tagName">Tag Name *</Label>
                            <Input
                                id="tagName"
                                value={tagName}
                                onChange={(e) => setTagName(e.target.value)}
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
                            disabled={tagMutation.isPending || !tagName.trim()}
                        >
                            {tagMutation.isPending ? 'Creating...' : 'Create Tag'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}