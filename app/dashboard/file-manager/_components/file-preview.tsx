"use client"

import type {Resource} from "@/types/files"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ImageIcon, FileText, File } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from 'next/image'

interface FilePreviewProps {
    file: Resource
}

export function FilePreview({ file }: FilePreviewProps) {
    const renderFileContent = () => {
        if (file.fileFormat.startsWith("image")) {
            return (
                <div className="flex justify-center items-center h-full">
                    <Image
                        src={file.url || "/placeholder.svg"}
                        alt={file.title}
                        className="max-w-full max-h-full object-contain"
                    />
                </div>
            )
        } else if (file.fileFormat === "pdf") {
            // In a real application, you'd use a PDF viewer library
            return (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <FileText className="h-16 w-16 mb-4" />
                    <p>PDF preview is not available in this demo.</p>
                    <p>You can download the file to view it.</p>
                    <a href={file.url} download className="mt-4 text-blue-500 hover:underline">
                        Download PDF
                    </a>
                </div>
            )
        } else {
            return (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <File className="h-16 w-16 mb-4" />
                    <p>Preview not available for this file type ({file.type}).</p>
                    <p>You can download the file to view it.</p>
                    <a href={file.url} download className="mt-4 text-blue-500 hover:underline">
                        Download File
                    </a>
                </div>
            )
        }
    }

    return (
        <div className="grid md:grid-cols-3 gap-4 h-full">
            <Card className="md:col-span-2 flex flex-col">
                <CardContent className="flex-1 p-4 overflow-hidden">
                    <ScrollArea className="h-full w-full">{renderFileContent()}</ScrollArea>
                </CardContent>
            </Card>
            <Card className="md:col-span-1 flex flex-col">
                <CardContent className="flex-1 p-4 overflow-y-auto">
                    <h3 className="text-lg font-semibold mb-2">File Details</h3>
                    <div className="grid gap-2 text-sm">
                        <div>
                            <p className="text-muted-foreground">Title</p>
                            <p className="font-medium">{file.title}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Description</p>
                            <p>{file.description || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Type</p>
                            <p className="font-medium">{file.type}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Category</p>
                            <p className="font-medium">{file.category.name}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Access Control</p>
                            <p className="font-medium">{file.accessLevel}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Uploaded At</p>
                            <p className="font-medium">{new Date(file.updatedAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Tags</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {file.tags.length > 0 ? (
                                    file.tags.map((tag, index) => (
                                        <Badge key={index} variant="secondary">
                                            {tag.name}
                                        </Badge>
                                    ))
                                ) : (
                                    <p>N/A</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <Separator className="my-4" />
                    <a href={file.url} download className="w-full">
                        <Button className="w-full">Download File</Button>
                    </a>
                </CardContent>
            </Card>
        </div>
    )
}
