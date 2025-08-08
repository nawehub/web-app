"use client"

import type React from "react"

import { useState, useCallback, useMemo } from "react"
import { useDropzone } from "react-dropzone"
import { UploadCloud, FileText, XCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import type {FileItem, FolderData} from "@/types/files"

interface EnhancedFileUploadProps {
    onUploadCompleteAction: (file: FileItem) => void
    currentFolderId: string | null
    availableFolders: FolderData[]
}

export function EnhancedFileUpload({ onUploadCompleteAction, currentFolderId, availableFolders }: EnhancedFileUploadProps) {
    const [file, setFile] = useState<File | null>(null)
    const [uploadProgress, setUploadProgress] = useState<number>(0)
    const [isUploading, setIsUploading] = useState<boolean>(false)
    const [step, setStep] = useState(1) // 1: file select, 2: metadata, 3: uploading
    const { toast } = useToast()

    const [metadata, setMetadata] = useState<Omit<FileItem, "id" | "updatedAt" | "url">>({
        title: "",
        description: "",
        type: "",
        category: "",
        folderId: currentFolderId,
        tags: [],
        accessControl: "Private",
    })
    const [tagInput, setTagInput] = useState("")

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0])
            setMetadata((prev) => ({
                ...prev,
                title: acceptedFiles[0].name.split(".").slice(0, -1).join("."),
                type: acceptedFiles[0].name.split(".").pop()?.toLowerCase() || "",
            }))
            setStep(2) // Move to metadata step
        }
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
        disabled: step !== 1,
    })

    const handleRemoveFile = () => {
        setFile(null)
        setStep(1)
        setMetadata({
            title: "",
            description: "",
            type: "",
            category: "",
            folderId: currentFolderId,
            tags: [],
            accessControl: "Private",
        })
    }

    const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target
        setMetadata((prev) => ({ ...prev, [id]: value }))
    }

    const handleSelectChange = (id: keyof Omit<FileItem, "id" | "updatedAt" | "url">, value: string) => {
        setMetadata((prev) => ({ ...prev, [id]: value }))
    }

    const handleTagAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && tagInput.trim() !== "") {
            e.preventDefault()
            setMetadata((prev) => ({
                ...prev,
                tags: [...prev.tags, tagInput.trim()],
            }))
            setTagInput("")
        }
    }

    const handleTagRemove = (index: number) => {
        setMetadata((prev) => ({
            ...prev,
            tags: prev.tags.filter((_, i) => i !== index),
        }))
    }

    const handleUpload = async () => {
        if (!file) {
            toast({
                title: "No file selected",
                description: "Please select a file to upload.",
                variant: "destructive",
            })
            return
        }

        if (!metadata.title || !metadata.type || !metadata.category) {
            toast({
                title: "Missing Metadata",
                description: "Please fill in file title, type, and category.",
                variant: "destructive",
            })
            return
        }

        setIsUploading(true)
        setUploadProgress(0)
        setStep(3) // Move to uploading step

        const formData = new FormData()
        formData.append("file", file)
        formData.append("metadata", JSON.stringify(metadata))

        try {
            // Simulate upload progress
            let progress = 0
            const interval = setInterval(() => {
                progress += 10
                setUploadProgress(progress)
                if (progress >= 100) {
                    clearInterval(interval)
                }
            }, 200)

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            })

            if (!response.ok) {
                throw new Error("File upload failed.")
            }

            const result = await response.json()
            console.log("Upload successful:", result)
            toast({
                title: "Upload Successful",
                description: `File "${result.file.title}" uploaded successfully!`,
            })
            onUploadCompleteAction(result.file) // Pass the new file item back to parent
            setFile(null) // Clear file
            setStep(1) // Reset to first step
        } catch (error) {
            console.error("Upload error:", error)
            toast({
                title: "Upload Failed",
                description: "There was an error uploading your file. Please try again.",
                variant: "destructive",
            })
            setIsUploading(false)
            setUploadProgress(0)
            setStep(2) // Go back to metadata step on error
        }
    }

    const fileIcon = useMemo(() => {
        if (!file) return null
        if (file.type.startsWith("image/")) return <FileText className="h-5 w-5 text-primary" />
        if (file.type === "application/pdf") return <FileText className="h-5 w-5 text-primary" />
        return <FileText className="h-5 w-5 text-primary" />
    }, [file])

    return (
        <div className="grid gap-6">
            {step === 1 && (
                <div
                    {...getRootProps()}
                    className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-colors hover:border-primary min-h-[200px]"
                >
                    <input {...getInputProps()} />
                    <UploadCloud className="mb-4 h-12 w-12 text-muted-foreground" />
                    {isDragActive ? (
                        <p className="text-muted-foreground">Drop the file here ...</p>
                    ) : (
                        <p className="text-muted-foreground">Drag 'n' drop a file here, or click to select</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">Only one file can be uploaded at a time.</p>
                </div>
            )}

            {step === 2 && file && (
                <Card>
                    <CardHeader>
                        <CardTitle>Configure File Metadata</CardTitle>
                        <CardDescription>Provide details for the uploaded file.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="flex items-center justify-between rounded-md bg-muted p-3">
                            <div className="flex items-center gap-2">
                                {fileIcon}
                                <span>{file.name}</span>
                            </div>
                            <Button variant="ghost" size="icon" onClick={handleRemoveFile}>
                                <XCircle className="h-5 w-5 text-destructive" />
                                <span className="sr-only">Remove file</span>
                            </Button>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="title">File Title</Label>
                            <Input id="title" value={metadata.title} onChange={handleMetadataChange} required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" value={metadata.description} onChange={handleMetadataChange} rows={3} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="type">File Type</Label>
                                <Input id="type" value={metadata.type} onChange={handleMetadataChange} disabled />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="category">Category</Label>
                                <Input id="category" value={metadata.category} onChange={handleMetadataChange} required />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="folderId">Folder</Label>
                            <Select
                                value={metadata.folderId || "Root Folder"}
                                onValueChange={(value) => {
                                    handleSelectChange("folderId", value == "Root Folder" ? "" : value);
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select folder (optional)" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Root Folder">Root Folder</SelectItem>
                                    {availableFolders.map((folder) => (
                                        <SelectItem key={folder.id} value={folder.id}>
                                            {folder.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="tags">Tags (Press Enter to add)</Label>
                            <Input
                                id="tags"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleTagAdd}
                                placeholder="e.g., report, finance, Q1"
                            />
                            <div className="flex flex-wrap gap-2 mt-2">
                                {metadata.tags.map((tag, index) => (
                                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                        {tag}
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="h-auto p-0.5"
                                            onClick={() => handleTagRemove(index)}
                                        >
                                            <X className="h-3 w-3" />
                                            <span className="sr-only">Remove tag</span>
                                        </Button>
                                    </Badge>
                                ))}
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="accessControl">Access Control</Label>
                            <Select
                                value={metadata.accessControl}
                                onValueChange={(value) => handleSelectChange("accessControl", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select access level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Public">Public</SelectItem>
                                    <SelectItem value="Private">Private</SelectItem>
                                    <SelectItem value="Restricted">Restricted</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button onClick={handleUpload} className="w-full">
                            Upload File
                        </Button>
                    </CardContent>
                </Card>
            )}

            {step === 3 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Uploading File...</CardTitle>
                        <CardDescription>Please wait while your file is being uploaded.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="flex items-center justify-between rounded-md bg-muted p-3">
                            <div className="flex items-center gap-2">
                                {fileIcon}
                                <span>{file?.name}</span>
                            </div>
                        </div>
                        <Progress value={uploadProgress} className="w-full" />
                        <p className="text-center text-sm text-muted-foreground">{uploadProgress}% Complete</p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
