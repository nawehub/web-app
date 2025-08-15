import {Category, CreateFolderTagRequest, FileListResponse, FolderData, Resource, Tag} from "@/types/files";
import {api4app, api4FileUpload} from "@/lib/api4app";

export type FolderCreateResponse = {
    message: string
    folder: FolderData
}

export type CreateCategoryRequest = {
    name: string
    description: string
}

export type CreateCategoryResponse = {
    message: string
    category: Category
}

export type CreateTagResponse = {
    message: string
    tag: Tag
}

export type UploadResponse = {
    message: string
    success: boolean
    metadata: Resource
}

export const resourceService = () => {
    return {
        folder: {
            listAllFolders: async () => {
                const response = await api4app('/resources/folders', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })

                return response as Promise<FolderData[]>
            },
            createFolder: async (req: CreateFolderTagRequest) => {
                const resp = await api4app('/resources/folders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(req),
                })

                return resp as Promise<FolderCreateResponse>
            }
        },
        category: {
            listAllCategories: async () => {
                const response = await api4app('/resources/categories', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })

                return response as Promise<Category[]>
            },
            createCategory: async (req: CreateCategoryRequest) => {
                return await api4app('/resources/categories', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(req),
                })
            }
        },
        tag: {
            listAllTags: async () => {
                const response = await api4app('/resources/tags', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })

                return response as Promise<Tag[]>
            },
            createTag: async (req: Pick<CreateCategoryRequest, "name">) => {
                return await api4app('/resources/tags', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(req),
                })
            }
        },
        resource: {
            listAllResources: async () => {
                const response = await api4app('/resources/files', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                return response as Promise<FileListResponse>
            },
            listFolderResources: async (folderId: string) => {
                const response = await api4app('/resources/files/folder/' + folderId, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                return response as Promise<FileListResponse>
            },
            uploadResource: async (data: FormData) => {
                const response = await api4FileUpload('/resources/files', {
                    method: 'POST',
                    body: data,
                })
                return response as Promise<UploadResponse>
            }
        }

    }
}