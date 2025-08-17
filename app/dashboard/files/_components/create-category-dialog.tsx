'use client';

import React, {useState} from 'react';
import {Button} from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {useCreateCategoryMutation} from '@/hooks/repository/use-resources';
import {useToast} from '@/hooks/use-toast';
import {formatResponse} from "@/utils/format-response";

interface CreateCategoryDialogProps {
    open: boolean;
    onOpenChangeAction: (open: boolean) => void;
}

export function CreateCategoryDialog({ open, onOpenChangeAction }: CreateCategoryDialogProps) {
    const [categoryName, setCategoryName] = useState('');
    const [description, setDescription] = useState('');
    const {toast} = useToast();

    const categoryMutation = useCreateCategoryMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!categoryName.trim() || !description.trim()) {
            toast({
                title: 'Error',
                description: 'Please enter a category name and description',
                variant: 'destructive',
            });
            return;
        }

        try {
            await categoryMutation.mutateAsync({
                name: categoryName.trim(),
                description: description.trim()
            });

            toast({
                title: 'Success',
                description: 'Category created successfully',
            });

            setCategoryName('');
            setDescription('');
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
                    <DialogTitle>Create New Category</DialogTitle>
                    <DialogDescription>
                        Enter a name description of your new category.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="categoryName">Category Name *</Label>
                            <Input
                                id="categoryName"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                placeholder="Enter category name"
                                autoFocus
                            />
                        </div>
                    </div>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description *</Label>
                            <Input
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Enter category description"
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
                            disabled={categoryMutation.isPending || !categoryName.trim()}
                        >
                            {categoryMutation.isPending ? 'Creating...' : 'Create Category'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}