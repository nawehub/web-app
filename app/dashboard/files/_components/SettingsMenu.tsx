"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Settings} from "lucide-react";
import {useState} from "react";
import {CreateTagDialog} from "@/app/dashboard/files/_components/create-tag-dialog";
import {CreateCategoryDialog} from "@/app/dashboard/files/_components/create-category-dialog";
import {CreateFolderDialog} from "@/app/dashboard/files/_components/create-folder-dialog";

export function SettingsMenu() {
    const [showCreateFolder, setShowCreateFolder] = useState(false);
    const [showCreateCategory, setShowCreateCategory] = useState(false);
    const [showCreateTag, setShowCreateTag] = useState(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="relative h-9 w-9 rounded-full">
                        <Settings className="h-4 w-4"/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">File Settings</p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => setShowCreateFolder(true)}>Create Folder</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setShowCreateCategory(true)}>Create Category</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setShowCreateTag(true)}>Create Tag</DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
            <CreateTagDialog open={showCreateTag} onOpenChangeAction={setShowCreateTag} />
            <CreateCategoryDialog open={showCreateCategory} onOpenChangeAction={setShowCreateCategory} />
            <CreateFolderDialog open={showCreateFolder} onOpenChangeAction={setShowCreateFolder} />
        </>
    );
}