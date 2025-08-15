'use client';

import {useEffect, useState} from 'react';
import {Button} from '@/components/ui/button';
import {Card} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {
    Folder,
    File,
    Plus,
    Upload,
    Search,
    MoreVertical,
    Grid3X3,
    List,
    SortAsc
} from 'lucide-react';
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from '@/components/ui/context-menu';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {Badge} from '@/components/ui/badge';
import {CreateFolderDialog} from '@/app/dashboard/files/_components/create-folder-dialog';
import {UploadFileDialog} from '@/app/dashboard/files/_components/upload-file-dialog';
import {useListFolderResourcesQuery, useListFoldersQuery} from "@/hooks/repository/use-resources";
import {FolderData} from "@/types/files";
import {CreateTagDialog} from "@/app/dashboard/files/_components/create-tag-dialog";
import {CreateCategoryDialog} from "@/app/dashboard/files/_components/create-category-dialog";

interface Selection {
    files: Set<string>;
    folders: Set<string>;
}

export default function FilesPage() {
    const [currentFolderId, setCurrentFolderId] = useState<string | undefined>(undefined);
    const [breadcrumbs, setBreadcrumbs] = useState<Array<{ id?: string; name: string }>>([
        {name: 'Files'}
    ]);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [showCreateFolder, setShowCreateFolder] = useState(false);
    const [showUploadFile, setShowUploadFile] = useState(false);
    const [selection, setSelection] = useState<Selection>({ files: new Set(), folders: new Set() });
    // const [lastSelectedItem, setLastSelectedItem] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [folderHistory, setFolderHistory] = useState<Array<{id: string, name: string}>>([]);
    const [isOperationPending, setIsOperationPending] = useState(false);



    const {data: folders = [], isLoading: foldersLoading} = useListFoldersQuery();
    let {data: files, refetch, isLoading: filesLoading} = useListFolderResourcesQuery(currentFolderId ?? '');

    const handleFolderOpen = async (folder: FolderData) => {
        setFolderHistory(prev => [...prev, {id: currentFolderId!, name: folder.name}]);
        setCurrentFolderId(folder.id);
        setBreadcrumbs([...breadcrumbs, {id: folder.id, name: folder.name}]);

        try {
            await refetch();
        } catch (error) {
            setError('Failed to load folder contents');
        }
    };

    const handleFileOperation = async (operation: () => Promise<void>) => {
        setIsOperationPending(true);
        setError(null);
        try {
            await operation();
            await refetch();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Operation failed');
        } finally {
            setIsOperationPending(false);
        }
    };

    const handleNavigateBack = () => {
        const previousFolder = folderHistory[folderHistory.length - 1];
        if (previousFolder) {
            setCurrentFolderId(previousFolder.id);
            setBreadcrumbs(prev => prev.slice(0, -1));
            setFolderHistory(prev => prev.slice(0, -1));
        }
    };

    const handleBreadcrumbClick = (index: number) => {
        const newBreadcrumbs = breadcrumbs.slice(0, index + 1);
        setBreadcrumbs(newBreadcrumbs);

        if (index === 0) {
            setCurrentFolderId(undefined);
        } else {
            setCurrentFolderId(newBreadcrumbs[index].id);
            console.log({currentFolderId})
        }
    };

    const filteredFolders = folders.filter(folder =>
        folder.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredFiles = files?.files.filter(file =>
        file.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatFileSize = (bytes?: number) => {
        if (!bytes) return 'Unknown size';
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    };

    const getFileIcon = (mimeType?: string) => {
        if (!mimeType) return <File className="h-8 w-8"/>;

        if (mimeType.startsWith('image/')) return <File className="h-8 w-8 text-blue-500"/>;
        if (mimeType.includes('pdf')) return <File className="h-8 w-8 text-red-500"/>;
        if (mimeType.includes('word')) return <File className="h-8 w-8 text-blue-600"/>;
        if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return <File
            className="h-8 w-8 text-green-600"/>;

        return <File className="h-8 w-8"/>;
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selection, viewMode, filteredFiles, filteredFolders]);


    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'a' && (event.metaKey || event.ctrlKey)) {
            // Select all
            event.preventDefault();
            const newSelection = {
                files: new Set(filteredFiles?.map(f => f.id)),
                folders: new Set(filteredFolders.map(f => f.id))
            };
            setSelection(newSelection);
        }

        // Add arrow key navigation
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
            event.preventDefault();
            // Implementation depends on your grid/list layout
            // You'll need to calculate the next item based on current selection and view mode
        }
    };

    useEffect(() => {
        setError(null);
    }, [currentFolderId]);

    return (
        <div className="space-y-6 mt-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">File Management</h1>
                    <p className="text-muted-foreground">
                        Organize and manage your business resources
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                    >
                        {viewMode === 'grid' ? <List className="h-4 w-4"/> : <Grid3X3 className="h-4 w-4"/>}
                    </Button>
                    <Button variant="outline" size="sm">
                        <SortAsc className="h-4 w-4 mr-2"/>
                        Sort
                    </Button>
                    <Button onClick={() => setShowUploadFile(true)}>
                        <Upload className="h-4 w-4 mr-2"/>
                        Upload File
                    </Button>
                    <Button onClick={() => setShowCreateFolder(true)}>
                        <Plus className="h-4 w-4 mr-2"/>
                        New Folder
                    </Button>
                    <CreateTagDialog />
                    <CreateCategoryDialog />
                </div>
            </div>

            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-sm">
                {breadcrumbs.map((crumb, index) => (
                    <div key={index} className="flex items-center gap-2">
                        {index > 0 && <span className="text-muted-foreground">/</span>}
                        <button
                            onClick={() => handleBreadcrumbClick(index)}
                            className="text-primary hover:underline"
                        >
                            {crumb.name}
                        </button>
                    </div>
                ))}
            </div>

            {/* Search and Filters */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
                    <Input
                        placeholder="Search files and folders..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8"
                    />
                </div>
            </div>

            {/* Content */}
            <div className="space-y-4">
                {!currentFolderId ? (
                    foldersLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-muted-foreground">Loading...</div>
                        </div>
                    ) : (
                        folders?.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Folder className="h-12 w-12 text-muted-foreground mb-4"/>
                                <h3 className="text-lg font-medium mb-2">No folders found</h3>
                                <p className="text-muted-foreground mb-4">
                                    {searchQuery ? 'No items match your search.' : 'Get started by creating a folder or uploading a file.'}
                                </p>
                                {!searchQuery && (
                                    <div className="flex gap-2">
                                        <Button onClick={() => setShowCreateFolder(true)}>
                                            <Plus className="h-4 w-4 mr-2"/>
                                            Create Folder
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-3">Folders</h3>
                                <div
                                    className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4' : 'space-y-2'}>
                                    {filteredFolders.map((folder) => (
                                        <ContextMenu key={folder.id}>
                                            <ContextMenuTrigger>
                                                <Card
                                                    className={`cursor-pointer hover:bg-muted/50 transition-colors ${
                                                        viewMode === 'list' ? 'p-3' : 'p-4'
                                                    }`}
                                                    onDoubleClick={() => handleFolderOpen(folder)}
                                                >
                                                    <div
                                                        className={`flex items-center ${viewMode === 'list' ? 'gap-3' : 'flex-col gap-2'}`}>
                                                        <Folder className="h-8 w-8 text-blue-500"/>
                                                        <div className={viewMode === 'list' ? 'flex-1' : 'text-center'}>
                                                            <p className="text-sm font-medium truncate">{folder.name}</p>
                                                            {viewMode === 'list' && (
                                                                <p className="text-xs text-muted-foreground">
                                                                    Modified {new Date(folder.updatedAt).toLocaleDateString()}
                                                                </p>
                                                            )}
                                                        </div>
                                                        {viewMode === 'list' && (
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" size="sm">
                                                                        <MoreVertical className="h-4 w-4"/>
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent>
                                                                    <DropdownMenuItem
                                                                        onClick={() => handleFolderOpen(folder)}>
                                                                        Open
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem>Rename</DropdownMenuItem>
                                                                    <DropdownMenuItem
                                                                        className="text-destructive">Delete</DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        )}
                                                    </div>
                                                </Card>
                                            </ContextMenuTrigger>
                                            <ContextMenuContent>
                                                <ContextMenuItem onClick={() => handleFolderOpen(folder)}>
                                                    Open
                                                </ContextMenuItem>
                                                <ContextMenuItem>Rename</ContextMenuItem>
                                                <ContextMenuItem className="text-destructive">Delete</ContextMenuItem>
                                            </ContextMenuContent>
                                        </ContextMenu>
                                    ))}
                                </div>
                            </div>
                        )
                    )
                ) : (
                    filteredFiles && filteredFiles.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Folder className="h-12 w-12 text-muted-foreground mb-4"/>
                            <h3 className="text-lg font-medium mb-2">No files found</h3>
                            <p className="text-muted-foreground mb-4">
                                {searchQuery ? 'No items match your search.' : 'Get started by creating a folder or uploading a file.'}
                            </p>
                            {!searchQuery && (
                                <div className="flex gap-2">
                                    <Button variant="outline" onClick={() => setShowUploadFile(true)}>
                                        <Upload className="h-4 w-4 mr-2"/>
                                        Upload File
                                    </Button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-3">Files</h3>
                            <div
                                className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4' : 'space-y-2'}>
                                {filteredFiles?.map((file) => (
                                    <ContextMenu key={file.id}>
                                        <ContextMenuTrigger>
                                            <Card className={`cursor-pointer hover:bg-muted/50 transition-colors ${
                                                viewMode === 'list' ? 'p-3' : 'p-4'
                                            }`}>
                                                <div
                                                    className={`flex items-center ${viewMode === 'list' ? 'gap-3' : 'flex-col gap-2'}`}>
                                                    {getFileIcon(file.fileFormat)}
                                                    <div
                                                        className={viewMode === 'list' ? 'flex-1 min-w-0' : 'text-center'}>
                                                        <p className="text-sm font-medium truncate">{file.title}</p>
                                                        {/*<p className="text-xs text-muted-foreground truncate">{file.fileName}</p>*/}
                                                        {viewMode === 'list' && (
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <Badge variant="secondary" className="text-xs">
                                                                    {file.type}
                                                                </Badge>
                                                                <span className="text-xs text-muted-foreground">
                                                                        45mb
                                                                    {/*{formatFileSize()}*/}
                                                                    </span>
                                                            </div>
                                                        )}
                                                        {viewMode === 'grid' && (
                                                            <Badge variant="secondary" className="text-xs mt-1">
                                                                {file.type}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    {viewMode === 'list' && (
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="sm">
                                                                    <MoreVertical className="h-4 w-4"/>
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent>
                                                                <DropdownMenuItem>Download</DropdownMenuItem>
                                                                <DropdownMenuItem>Share</DropdownMenuItem>
                                                                <DropdownMenuItem>Move</DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    className="text-destructive">Delete</DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    )}
                                                </div>
                                            </Card>
                                        </ContextMenuTrigger>
                                        <ContextMenuContent>
                                            <ContextMenuItem>Download</ContextMenuItem>
                                            <ContextMenuItem>Share</ContextMenuItem>
                                            <ContextMenuItem>Move</ContextMenuItem>
                                            <ContextMenuItem className="text-destructive">Delete</ContextMenuItem>
                                        </ContextMenuContent>
                                    </ContextMenu>
                                ))}
                            </div>
                        </div>
                    )
                )}
            </div>

            {/* Dialogs */}
            <CreateFolderDialog
                open={showCreateFolder}
                onOpenChangeAction={setShowCreateFolder}
                parentId={currentFolderId}
            />

            <UploadFileDialog
                open={showUploadFile}
                onOpenChangeAction={setShowUploadFile}
                folderId={currentFolderId}
            />

            {error && (
                <div className="text-red-500 text-sm mt-2">
                    {error}
                </div>
            )}
        </div>
    );
}