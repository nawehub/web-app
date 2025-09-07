"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { UploadCloud, FileText, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"

export function FileUpload() {
    const [files, setFiles] = useState<File[]>([])
    const [uploadProgress, setUploadProgress] = useState<number>(0)
    const [isUploading, setIsUploading] = useState<boolean>(false)
    const { toast } = useToast()

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles((prevFiles) => [...prevFiles, ...acceptedFiles])
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

    const handleRemoveFile = (fileToRemove: File) => {
        setFiles((prevFiles) => prevFiles.filter((file) => file !== fileToRemove))
    }

    const handleUpload = async () => {
        if (files.length === 0) {
            toast({
                title: "No files selected",
                description: "Please drag and drop files or click to select them.",
                variant: "destructive",
            })
            return
        }

        setIsUploading(true)
        setUploadProgress(0)

        const formData = new FormData()
        files.forEach((file) => {
            formData.append("files", file)
        })

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
                description: `${files.length} file(s) uploaded successfully!`,
            })
            setFiles([]) // Clear files after successful upload
        } catch (error) {
            console.error("Upload error:", error)
            toast({
                title: "Upload Failed",
                description: "There was an error uploading your files. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsUploading(false)
            setUploadProgress(0)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Upload Files</CardTitle>
                <CardDescription>Drag and drop your files here or click to select them.</CardDescription>
            </CardHeader>
            <CardContent>
                <div
                    {...getRootProps()}
                    className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-colors hover:border-primary"
                >
                    <input {...getInputProps()} />
                    <UploadCloud className="mb-4 h-12 w-12 text-muted-foreground" />
                    {isDragActive ? (
                        <p className="text-muted-foreground">Drop the files here ...</p>
                    ) : (
                        <p className="text-muted-foreground">Drag 'n' drop some files here, or click to select files</p>
                    )}
                </div>

                {files.length > 0 && (
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-3">Selected Files:</h3>
                        <ul className="space-y-2">
                            {files.map((file, index) => (
                                <li key={index} className="flex items-center justify-between rounded-md bg-muted p-3">
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-5 w-5 text-primary" />
                                        <span>{file.name}</span>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => handleRemoveFile(file)}>
                                        <XCircle className="h-5 w-5 text-destructive" />
                                        <span className="sr-only">Remove file</span>
                                    </Button>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-4">
                            {isUploading && (
                                <div className="mb-4">
                                    <p className="text-sm text-muted-foreground mb-1">Uploading...</p>
                                    <Progress value={uploadProgress} className="w-full" />
                                </div>
                            )}
                            <Button onClick={handleUpload} disabled={isUploading} className="w-full">
                                {isUploading ? "Uploading..." : `Upload ${files.length} File(s)`}
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
