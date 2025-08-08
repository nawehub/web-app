"use client"

import {useMemo, useState} from "react"
import {FileIcon, FolderIcon, HomeIcon, PlusIcon, SearchIcon, UploadIcon} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Card, CardContent} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Label} from "@/components/ui/label"
import {useToast} from "@/hooks/use-toast"
import type {FolderData, Resource} from "@/types/files"
import {EnhancedFileUpload} from "@/app/dashboard/file-manager/_components/enhanced-file-upload"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {FilePreview} from "@/app/dashboard/file-manager/_components/file-preview"
import {useMutation, useQueryClient} from "@tanstack/react-query"
import {useListFolderResourcesQuery, useListFoldersQuery} from "@/hooks/repository/use-resources";
import {resourceService} from "@/lib/services/resources";
import {deleteItem, renameItem} from "@/lib/file-data";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb"
import {ScrollArea} from "@/components/ui/scroll-area"
import {ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger} from "@/components/ui/context-menu";

type ViewMode = "grid" | "list"

export default function FileManagerPage() {
    const {toast} = useToast()
    const queryClient = useQueryClient()

    const [currentFolderId, setCurrentFolderId] = useState<string | null>(null) // null means root
    const [newFolderName, setNewFolderName] = useState("")
    const [renameItemId, setRenameItemId] = useState<string | null>(null)
    const [renameItemType, setRenameItemType] = useState<"folder" | "file" | null>(null)
    const [renameNewName, setRenameNewName] = useState("")
    const [viewMode, setViewMode] = useState<ViewMode>("grid")
    const [selectedFileForPreview, setSelectedFileForPreview] = useState<Resource | null>(null)
    const [currentFolder, setCurrentFolder] = useState<FolderData | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [fileTypeFilter, setFileTypeFilter] = useState<string>("All")

    const {
        data: folders = [],
        isLoading: isLoadingFolders,
        error: foldersError,
    } = useListFoldersQuery()

    const {
        data: files,
        isLoading: isLoadingFiles,
        error: filesError,
    } = useListFolderResourcesQuery(currentFolderId!)

    const createFolderMutation = useMutation({
        mutationFn: resourceService().folder.createFolder,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["folders"]}).then()
            toast({title: "Folder Created", description: "New folder added successfully."})
            setNewFolderName("")
        },
        onError: (error) => {
            toast({title: "Error", description: `Failed to create folder: ${error.message}`, variant: "destructive"})
        },
    })

    const renameItemMutation = useMutation({
        mutationFn: renameItem,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["folders"]}).then()
            queryClient.invalidateQueries({queryKey: ["files", currentFolderId]}).then()
            toast({title: "Renamed", description: "Item renamed successfully."})
            setRenameItemId(null)
            setRenameNewName("")
        },
        onError: (error) => {
            toast({title: "Error", description: `Failed to rename item: ${error.message}`, variant: "destructive"})
        },
    })

    const deleteItemMutation = useMutation({
        mutationFn: deleteItem,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["folders"]}).then()
            queryClient.invalidateQueries({queryKey: ["files", currentFolderId]}).then()
            toast({title: "Deleted", description: "Item deleted successfully.", variant: "destructive"})
        },
        onError: (error) => {
            toast({title: "Error", description: `Failed to delete item: ${error.message}`, variant: "destructive"})
        },
    })

    const handleOpenFolder = (folderId: string) => {
        setCurrentFolderId(folderId)
    }

    const handleBackToRoot = () => {
        setCurrentFolderId("")
        setSelectedFileForPreview(null)
    }

    const handleCreateFolder = () => {
        if (newFolderName.trim()) {
            createFolderMutation.mutate({name: newFolderName})
        }
    }

    const handleRename = (id: string, type: "folder" | "file", currentName: string) => {
        setRenameItemId(id)
        setRenameItemType(type)
        setRenameNewName(currentName)
    }

    const handleConfirmRename = () => {
        if (renameItemId && renameItemType && renameNewName.trim()) {
            renameItemMutation.mutate({id: renameItemId, type: renameItemType, newName: renameNewName.trim()})
        }
    }

    const handleDelete = (id: string, type: "folder" | "file") => {
        deleteItemMutation.mutate({id, type})
    }

    const handleFileDoubleClick = (file: Resource) => {
        setSelectedFileForPreview(file)
    }

    const currentFolderName = folders?.find((f) => f.id === currentFolderId)?.name || "Home"

    const filteredFiles = files?.files?.filter((file) => {
        const matchesSearch =
            file.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            file.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            file.tags.some((tag) => tag.name.toLowerCase().includes(searchTerm.toLowerCase()))
        const matchesType = fileTypeFilter === "All" || file.type === fileTypeFilter
        return matchesSearch && matchesType
    })

    const filteredFolders = useMemo(() => {
        return folders?.filter(folder => {
            return folder.name.toLowerCase().includes(searchTerm.toLowerCase())
        });
    }, [folders, searchTerm]);

    const uniqueFileTypes = Array.from(new Set(files?.files.map((file) => file.type)))

    if (isLoadingFolders || isLoadingFiles) {
        return <p>Loading files...</p>
    }

    if (foldersError || filesError) {
        return <p>Error loading data: {foldersError?.message || filesError?.message}</p>
    }

    const displayedItems = currentFolderId === null ? folders : files

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink onClick={handleBackToRoot} className="cursor-pointer">
                                <HomeIcon className="h-4 w-4 mr-1" /> Home
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        {currentFolderId && (
                            <>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>{currentFolderName}</BreadcrumbPage>
                                </BreadcrumbItem>
                            </>
                        )}
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="flex items-center gap-2">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline">
                                <UploadIcon className="mr-2 h-4 w-4" /> Upload Files
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[800px]">
                            <DialogHeader>
                                <DialogTitle>Upload New File</DialogTitle>
                                <DialogDescription>Upload a file and configure its metadata.</DialogDescription>
                            </DialogHeader>
                            <EnhancedFileUpload
                                currentFolderId={currentFolderId}
                                availableFolders={folders || []}
                                onUploadCompleteAction={() => {
                                    queryClient.invalidateQueries({ queryKey: ["folder-resources", currentFolderId] }).then()
                                    queryClient.invalidateQueries({ queryKey: ["folders"] }).then() // In case a file was uploaded to a new folder
                                }}
                            />
                        </DialogContent>
                    </Dialog>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>
                                <PlusIcon className="mr-2 h-4 w-4" /> New Folder
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Create New Folder</DialogTitle>
                                <DialogDescription>Enter a name for your new folder.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="folderName" className="text-right">
                                        Folder Name
                                    </Label>
                                    <Input
                                        id="folderName"
                                        value={newFolderName}
                                        onChange={(e) => setNewFolderName(e.target.value)}
                                        className="col-span-3"
                                    />
                                </div>
                            </div>
                            <Button onClick={handleCreateFolder} disabled={createFolderMutation.isPending}>
                                {createFolderMutation.isPending ? "Creating..." : "Create"}
                            </Button>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
                <div className="relative flex-1">
                    <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search files or folders..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                    />
                </div>
                {currentFolderId !== null && (
                    <Select value={fileTypeFilter} onValueChange={setFileTypeFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Types</SelectItem>
                            {uniqueFileTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                    {type}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            </div>

            <ScrollArea className="flex-1 pr-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {currentFolderId === "" ? (
                        folders?.length === 0 ? (
                            <p className="col-span-full text-muted-foreground text-center py-10">No folders found.</p>
                        ) : (
                            folders?.map((item) => (
                                <ContextMenu key={item.id}>
                                    <ContextMenuTrigger asChild>
                                        <Card className="relative group cursor-pointer" onDoubleClick={() => handleOpenFolder(item.id)}>
                                            <CardContent className="flex flex-col items-center justify-center p-4 aspect-square">
                                                <FolderIcon className="h-12 w-12 text-primary mb-2" />
                                                <p className="text-center text-sm font-medium truncate w-full">{item.name}</p>
                                            </CardContent>
                                        </Card>
                                    </ContextMenuTrigger>
                                    <ContextMenuContent>
                                        <ContextMenuItem onClick={() => handleOpenFolder(item.id)}>Open</ContextMenuItem>
                                        <ContextMenuItem onClick={() => handleRename(item.id, "folder", item.name)}>
                                            Rename
                                        </ContextMenuItem>
                                        <ContextMenuItem onClick={() => handleDelete(item.id, "folder")}>
                                            Delete
                                        </ContextMenuItem>
                                    </ContextMenuContent>
                                </ContextMenu>
                            ))
                        )
                    ) : (
                        filteredFiles?.length === 0 ? (
                            <p className="col-span-full text-muted-foreground text-center py-10">This folder is empty.</p>
                        ) : (
                            filteredFiles?.map((item) => (
                                <ContextMenu key={item.id}>
                                    <ContextMenuTrigger asChild>
                                        <Card className="relative group cursor-pointer" onDoubleClick={() => handleFileDoubleClick(item)}>
                                            <CardContent className="flex flex-col items-center justify-center p-4 aspect-square">
                                                <FileIcon className="h-12 w-12 text-muted-foreground mb-2" />
                                                <p className="text-center text-sm font-medium truncate w-full">{item.title}</p>
                                            </CardContent>
                                        </Card>
                                    </ContextMenuTrigger>
                                    <ContextMenuContent>
                                        <ContextMenuItem onClick={() => handleFileDoubleClick(item)}>Preview</ContextMenuItem>
                                        <ContextMenuItem onClick={() => handleRename(item.id, "file", item.title)}>
                                            Rename
                                        </ContextMenuItem>
                                        <ContextMenuItem onClick={() => handleDelete(item.id, "file")}>
                                            Delete
                                        </ContextMenuItem>
                                    </ContextMenuContent>
                                </ContextMenu>
                            ))
                        )
                    )}
                </div>
            </ScrollArea>

            {renameItemId && (
                <Dialog open={!!renameItemId} onOpenChange={() => setRenameItemId(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Rename {renameItemType}</DialogTitle>
                            <DialogDescription>Enter a new name for the {renameItemType}.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="newName" className="text-right">
                                    New Name
                                </Label>
                                <Input
                                    id="newName"
                                    value={renameNewName}
                                    onChange={(e) => setRenameNewName(e.target.value)}
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                        <Button onClick={handleConfirmRename} disabled={renameItemMutation.isPending}>
                            {renameItemMutation.isPending ? "Renaming..." : "Confirm"}
                        </Button>
                    </DialogContent>
                </Dialog>
            )}

            {selectedFileForPreview && (
                <Dialog open={!!selectedFileForPreview} onOpenChange={() => setSelectedFileForPreview(null)}>
                    <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
                        <DialogHeader>
                            <DialogTitle>File Preview: {selectedFileForPreview.title}</DialogTitle>
                            <DialogDescription>{selectedFileForPreview.description}</DialogDescription>
                        </DialogHeader>
                        <div className="flex-1 overflow-auto">
                            <FilePreview file={selectedFileForPreview} />
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    )
}
