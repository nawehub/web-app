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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { X, Upload } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
    useListCategoriesQuery,
    useListTagsQuery,
    useUploadResourceMutation
} from "@/hooks/repository/use-resources";
import {AccessLevel, FileUploadMetadata} from "@/types/files";

interface UploadFileDialogProps {
    open: boolean;
    onOpenChangeAction: (open: boolean) => void;
    folderId?: string;
}

export function UploadFileDialog({ open, onOpenChangeAction, folderId }: UploadFileDialogProps) {
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState<'Template' | 'Guide' | 'Checklist'>('Guide');
    const [categoryId, setCategoryId] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [isFeatured, setIsFeatured] = useState(false);
    const [accessLevel, setAccessLevel] = useState<AccessLevel>();
    const { data: categories = [] } = useListCategoriesQuery();
    const { data: tags = [] } = useListTagsQuery();

    const { toast } = useToast();
    const uploadFileMutation = useUploadResourceMutation();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            if (!title) {
                setTitle(selectedFile.name.replace(/\.[^/.]+$/, ''));
            }
        }
    };

    const handleTagToggle = (tagId: string) => {
        setSelectedTags(prev =>
            prev.includes(tagId)
                ? prev.filter(id => id !== tagId)
                : [...prev, tagId]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!file || !title.trim() || !categoryId || selectedTags.length == 0) {
            toast({
                title: 'Error',
                description: 'Please fill in all required fields',
                variant: 'destructive',
                duration: 5000
            });
            return;
        }

        try {
            const formData = new FormData();

            // Create metadata as JSON blob with proper content-type
            const metadata: FileUploadMetadata = {
                title: title.trim(),
                type,
                description: description.trim(),
                tags: selectedTags,
                categoryId,
                folderId: folderId || '',
                fileName: file.name,
                accessLevel: accessLevel || 'Public',
            };

            // Append the metadata as a JSON string
            formData.append('metadata', new Blob([JSON.stringify(metadata)], {
                type: 'application/json'
            }));

            // Append the file
            formData.append('file', file);

            await uploadFileMutation.mutateAsync(formData);

            toast({
                title: 'Success',
                description: 'File uploaded successfully',
                variant: 'default'
            });

            // Reset form
            setFile(null);
            setTitle('');
            setDescription('');
            setType('Guide');
            setCategoryId('');
            setSelectedTags([]);
            setIsFeatured(false);
            setAccessLevel('Public');
            onOpenChangeAction(false);
        } catch (error) {
            toast({
                title: 'Error',
                description: `${error instanceof Error ? error.message : 'Failed to upload file'}`,
                variant: 'destructive',
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChangeAction}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Upload File</DialogTitle>
                    <DialogDescription>
                        Upload a new file to your resource library.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        {/* File Upload */}
                        <div className="grid gap-2">
                            <Label htmlFor="file">File</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    id="file"
                                    type="file"
                                    onChange={handleFileChange}
                                    className="flex-1"
                                />
                                {file && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setFile(null)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                            {file && (
                                <p className="text-sm text-muted-foreground">
                                    Selected: {file.name} ({Math.round(file.size / 1024)} KB)
                                </p>
                            )}
                        </div>

                        {/* Title */}
                        <div className="grid gap-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter file title"
                            />
                        </div>

                        {/* Type */}
                        <div className="grid gap-2">
                            <Label htmlFor="type">Type</Label>
                            <Select value={type} onValueChange={(value: 'Template' | 'Guide' | 'Checklist') => setType(value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Template">Template</SelectItem>
                                    <SelectItem value="Guide">Guide</SelectItem>
                                    <SelectItem value="Checklist">Checklist</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Description */}
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Enter file description"
                                rows={3}
                            />
                        </div>

                        {/* Category */}
                        <div className="grid gap-2">
                            <Label htmlFor="category">Category</Label>
                            <Select value={categoryId} onValueChange={setCategoryId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem key={category.id} value={category.id}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Tags */}
                        <div className="grid gap-2">
                            <Label>Tags</Label>
                            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                                {tags.map((tag) => (
                                    <Badge
                                        key={tag.id}
                                        variant={selectedTags.includes(tag.id) ? 'default' : 'outline'}
                                        className="cursor-pointer"
                                        onClick={() => handleTagToggle(tag.id)}
                                    >
                                        {tag.name}
                                    </Badge>
                                ))}
                            </div>
                            {selectedTags.length > 0 && (
                                <p className="text-sm text-muted-foreground">
                                    {selectedTags.length} tag{selectedTags.length !== 1 ? 's' : ''} selected
                                </p>
                            )}
                        </div>

                        {/* Access Level */}
                        <div className="grid gap-2">
                            <Label htmlFor="accessLevel">Access Level</Label>
                            <Select value={accessLevel} onValueChange={(value: AccessLevel) => setAccessLevel(value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder={''} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="public">Public</SelectItem>
                                    <SelectItem value="private">Private</SelectItem>
                                    <SelectItem value="restricted">Restricted</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Restricted */}
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="restricted">Featured Resource</Label>
                                <p className="text-sm text-muted-foreground">
                                    Mark this resource as featured on the resource library.
                                </p>
                            </div>
                            <Switch
                                id="restricted"
                                checked={isFeatured}
                                onCheckedChange={setIsFeatured}
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
                            disabled={uploadFileMutation.isPending || !file || !title.trim() || !categoryId}
                        >
                            {uploadFileMutation.isPending ? (
                                <>
                                    <Upload className="h-4 w-4 mr-2 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <Upload className="h-4 w-4 mr-2" />
                                    Upload File
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}