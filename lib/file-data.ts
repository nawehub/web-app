import type {FolderData, Resource} from "@/types/files"

// Mock data for folders and files
export let mockFolders: FolderData[] = [
    {
        id: "folder-1",
        name: "Documents",
        createdBy: "James",
        createdAt: new Date("2024-01-01T10:00:00Z"),
        updatedAt: new Date("2024-01-01T10:00:00Z")
    },
    {
        id: "folder-2",
        name: "Images",
        createdBy: "Maria",
        createdAt: new Date("2024-02-15T11:00:00Z"),
        updatedAt: new Date("2024-02-15T11:00:00Z")
    },
    {
        id: "folder-3",
        name: "Reports",
        createdBy: "Ramsey",
        createdAt: new Date("2024-03-10T12:00:00Z"),
        updatedAt: new Date("2024-03-10T12:00:00Z")
    },
    {
        id: "folder-4",
        name: "Sub-Documents",
        createdBy: "Ramsey",
        createdAt: new Date("2024-04-01T13:00:00Z"),
        updatedAt: new Date("2024-04-01T13:00:00Z")
    },
]

export let mockFiles: Resource[] = [
    {
        id: "file-1",
        title: "Project Proposal",
        description: "Detailed proposal for the upcoming year's projects.",
        type: "Template",
        category: {
            id: "id-1", description: "desc-1", name: "Marketing", createdBy: "Ramsey", updatedAt: new Date, createdAt: new Date()
        },
        tags: [{id: "id-1", name: "SME"}],
        accessLevel: "Public",
        updatedAt: new Date(),
        createdAt: new Date(),
        url: "/placeholder.svg?height=200&width=150",
        fileFormat: "pdf",
        featured: true,
        isFeatured: false
    },
    {
        id: "file-2",
        title: "Team Photo",
        description: "Photo from the Q1 team building event.",
        type: "Checklist",
        category: {
            id: "id-1", description: "desc-1", name: "Photos", createdBy: "Ramsey", updatedAt: new Date, createdAt: new Date()
        },
        tags: [{name: "team", id: "id-2"}],
        accessLevel: "Public",
        updatedAt: new Date("2024-04-05T15:00:00Z"),
        createdAt: new Date("2024-04-05T15:00:00Z"),
        fileFormat: "pdf",
        featured: false,
        isFeatured: false,
        url: "/placeholder.svg?height=200&width=200",
    }
]

const simulateDelay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms))

export const fetchFolders = async (): Promise<FolderData[]> => {
    await simulateDelay()
    return mockFolders
}

export const fetchFiles = async (folderId: string | null): Promise<Resource[]> => {
    await simulateDelay()
    return mockFiles
}

export const createFolder = async (name: string): Promise<FolderData> => {
    await simulateDelay()
    const newFolder: FolderData = {
        id: `folder-${Date.now()}`,
        name,
        createdBy: "Ramsey",
        createdAt: new Date(),
        updatedAt: new Date(),
    }
    mockFolders.push(newFolder)
    return newFolder
}

export const uploadFile = async (fileData: Omit<Resource, "id" | "url" | "uploadedAt"> & { file: Blob }): Promise<Resource> => {
    await simulateDelay()
    const newFile: Resource = {
        id: `file-${Date.now()}`,
        title: fileData.title,
        description: fileData.description,
        type: fileData.type,
        category: fileData.category,
        tags: fileData.tags,
        accessLevel: fileData.accessLevel,
        fileFormat: fileData.fileFormat,
        featured: fileData.featured,
        isFeatured: fileData.isFeatured,
        updatedAt: new Date(),
        createdAt: new Date(),
        url: `/placeholder.svg?height=200&width=150&query=${fileData.fileFormat}+document`, // Placeholder URL
    }
    mockFiles.push(newFile)
    return newFile
}

export const renameItem = async ({
                                     id,
                                     type,
                                     newName,
                                 }: { id: string; type: "folder" | "file"; newName: string }): Promise<void> => {
    await simulateDelay()
    if (type === "folder") {
        const folder = mockFolders.find((f) => f.id === id)
        if (folder) {
            folder.name = newName
        }
    } else {
        const file = mockFiles.find((f) => f.id === id)
        if (file) {
            file.title = newName // Renaming file title
        }
    }
}

export const deleteItem = async ({ id, type }: { id: string; type: "folder" | "file" }): Promise<void> => {
    await simulateDelay()
    if (type === "folder") {
        mockFolders = mockFolders.filter((f) => f.id !== id)
        mockFiles = mockFiles.filter((file) => file.id !== id) // Delete files within the folder too
    } else {
        mockFiles = mockFiles.filter((f) => f.id !== id)
    }
}
