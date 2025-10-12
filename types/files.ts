export type FileMetadataType = "Template" | "Guide" | "Checklist"

export type AccessLevel = "Public" | "Private" | "Restricted"

export interface FileUploadMetadata {
    title: string
    type: FileMetadataType
    description: string
    tags: string[] // Array of tag IDs
    categoryId?: string // ID of the category
    folderId: string | null // ID of the folder it belongs to, null for root
    fileName: string // Original file name
    accessLevel: AccessLevel // Public, Private, Restricted
}

export type FileItem = {
    id: string
    title: string
    description?: string
    type: string // e.g., "pdf", "image", "document"
    category: string // e.g., "Reports", "Contracts", "Marketing"
    folderId: string | null // ID of the parent folder, null for root
    tags: string[]
    accessControl: "Public" | "Private" | "Restricted"
    updatedAt: Date
    url: string // URL to the actual file content
}

export interface FolderItem {
    id: string
    name: string
    type: "folder"
    createdAt: Date
    createdBy: string
    fileCount: number
    totalSize: number // total size of files within this folder
}

export interface Category {
    id: string
    name: string
    description: string
    createdBy: string
    createdAt: Date
    updatedAt: Date
}

export interface Tag {
    id: string
    name: string
    createdBy: string
    createdAt: Date
    updatedAt: Date
}

export type CreateFolderTagRequest = {
    name: string
}

export type FolderData = {
    id: string
    name: string
    createdBy: string
    createdAt: Date
    updatedAt: Date
}

export type StatusDto = {
    state: 'Draft' | 'Approved' | 'Rejected' | 'Pending_Approval'
    rejectionReason: string
    statusActionDate: Date
}

export type Resource = {
    id: string
    title: string
    category: Category
    type: FileMetadataType
    tags: Pick<Tag, "id" | "name">[]
    description: string
    url: string
    fileFormat: FileFormat
    fileSize: number
    fileName: string
    accessLevel: AccessLevel
    isFeatured: boolean
    views?: 1000000
    downloads?: 5
    rating?: 4.5
    status: StatusDto
    createdAt: Date
    updatedAt: Date
}

export type FileListResponse = {
    count: number
    files: Resource[]
}

export type FileFormat = "pdf" | "doc" | "docx"

export interface UploadFileData {
    metadata: {
        title: string;
        type: 'Template' | 'Guide' | 'Checklist';
        description: string;
        tags: string[];
        categoryId: string;
        folderId: string;
        fileName: string;
        isFeatured: boolean;
        accessLevel: AccessLevel;
    };
    file: File;
}

export const constructFileUrl = (url: string, isPreview: boolean) => {
    const { pathname } = new URL(url);
    const parts = pathname.split("/");

    const folderId = parts.at(-2);
    const fileName = parts.at(-1);
    return `/api/resources/files/views/${folderId}/${fileName}?preview=${isPreview ? "true" : "false"}`;
}