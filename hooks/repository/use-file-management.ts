'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {api4app} from "@/lib/api4app";

export interface Folder {
    id: string;
    name: string;
    parentId?: string;
    createdAt: string;
    updatedAt: string;
}

export interface FileItem {
    id: string;
    title: string;
    fileName: string;
    type: 'Template' | 'Guide' | 'Checklist';
    description: string;
    tags: string[];
    categoryId: string;
    folderId: string;
    isRestricted: boolean;
    accessLevel: 'public' | 'private' | 'restricted';
    createdAt: string;
    updatedAt: string;
    size?: number;
    mimeType?: string;
}

export interface Category {
    id: string;
    name: string;
    description?: string;
}

export interface Tag {
    id: string;
    name: string;
    color?: string;
}

export interface CreateFolderData {
    name: string;
    parentId?: string;
}

export interface UploadFileData {
    metadata: {
        title: string;
        type: 'Template' | 'Guide' | 'Checklist';
        description: string;
        tags: string[];
        categoryId: string;
        folderId: string;
        fileName: string;
        isRestricted: boolean;
        accessLevel: 'public' | 'private' | 'restricted';
    };
    file: File;
}

// Folders
export function useFoldersQuery(parentId?: string) {
    return useQuery({
        queryKey: ['folders', parentId],
        queryFn: async () => {
            const params = parentId ? `?parentId=${parentId}` : '';
            const response = await api4app(`/api/files/folders${params}`);
            return response.data as Folder[];
        },
    });
}

export function useCreateFolderMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateFolderData) => {
            const response = await api4app('/api/files/folders', {
                body: JSON.stringify(data),
            });
            return response.data as Folder;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['folders', variables.parentId] }).then();
        },
    });
}

// Files
export function useFilesQuery(folderId?: string) {
    return useQuery({
        queryKey: ['files', folderId],
        queryFn: async () => {
            const params = folderId ? `?folderId=${folderId}` : '';
            const response = await api4app(`/api/files${params}`);
            return response.data as FileItem[];
        },
    });
}

export function useUploadFileMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: UploadFileData) => {
            const formData = new FormData();
            formData.append('metadata', JSON.stringify(data.metadata));
            formData.append('file', data.file);

            const response = await api4app('/api/files', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            return response.json();
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({queryKey: ['files', variables.metadata.folderId]}).then();
        },
    });
}

// Categories
export function useCategoriesQuery() {
    return useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await api4app('/api/files/categories');
            return response.data as Category[];
        },
    });
}

// Tags
export function useTagsQuery() {
    return useQuery({
        queryKey: ['tags'],
        queryFn: async () => {
            const response = await api4app('/api/files/tags');
            return response.data as Tag[];
        },
    });
}