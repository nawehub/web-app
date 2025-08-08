'use client'

import dynamic from 'next/dynamic';
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Download, FileText, Star, ExternalLink, X } from "lucide-react"
import {Resource, FileFormat} from "@/types/files";
import PdfViewer from "@/components/resources/pdf-viewer";

interface ResourcePreviewProps {
  resource: Resource
  isOpen: boolean
  onCloseAction: () => void
  onDownloadAction: (resource: Resource) => void
}

const DynamicPdfViewer = dynamic(() => import("@/components/resources/pdf-viewer"), {
  ssr: false, // This is the crucial part: tells Next.js NOT to render this component on the server
  loading: () => <p>Loading PDF viewer...</p>, // Optional: a loading state
});

export function ResourcePreview({ resource, isOpen, onCloseAction, onDownloadAction }: ResourcePreviewProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [read, setRead] = useState<boolean>(false)
  const { toast } = useToast()

  const handleCloseRead = () => {
    setRead(false)
  }

  const handleDownload = async () => {
    setIsDownloading(true)

    try {
      // Simulate download process
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Create a mock file download
      const fileName = `${resource.title.toLowerCase().replace(/\s+/g, "-")}.pdf`
      const blob = new Blob(["Mock file content"], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      onDownloadAction(resource)

      toast({
        title: "Download Started",
        description: `${resource.title} is being downloaded.`,
      })
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "There was an error downloading the file.",
        variant: "destructive",
      })
    } finally {
      setIsDownloading(false)
    }
  }

  const getFileIcon = (fileType: FileFormat) => {
    switch (fileType) {
      case "pdf":
        return <FileText className="w-6 h-6 text-red-500" />
      case "doc":
      case "docx":
        return <FileText className="w-6 h-6 text-blue-500" />
      default:
        return <FileText className="w-6 h-6 text-gray-500" />
    }
  }

  const renderPreviewContent = () => {
    if (resource.fileFormat === "pdf") {
      return (
        <div className="space-y-4">
          <div className="bg-gray-100 rounded-lg p-8 text-center">
            <FileText className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">PDF Preview</h3>
            <p className="text-gray-600 mb-4">
              This is a comprehensive {resource.title.toLowerCase()} that contains detailed information and guidelines.
            </p>
            <div className="bg-white rounded border p-4 text-left">
              <h4 className="font-semibold mb-2">Document Contents:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Executive Summary</li>
                <li>• Market Analysis</li>
                <li>• Financial Projections</li>
                <li>• Implementation Strategy</li>
                <li>• Risk Assessment</li>
              </ul>
            </div>
          </div>
          <Button variant="outline" className="w-full" onClick={(): void => setRead(true)}>Click To Read Content</Button>
          {read && (
              <DynamicPdfViewer isOpen={read} onToggle={handleCloseRead} fileUrl={resource.url} />
          )}        </div>
      )
    }

    if (resource.fileFormat === "doc" || resource.fileFormat === "docx") {
      return (
        <div className="space-y-4">
          <div className="bg-blue-50 rounded-lg p-8 text-center">
            <FileText className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Document Preview</h3>
            <p className="text-gray-600 mb-4">
              This document provides step-by-step guidance for {resource.title.toLowerCase()}.
            </p>
            <div className="bg-white rounded border p-4 text-left">
              <h4 className="font-semibold mb-2">Key Sections:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Getting Started Guide</li>
                <li>• Best Practices</li>
                <li>• Templates and Examples</li>
                <li>• Troubleshooting</li>
                <li>• Additional Resources</li>
              </ul>
            </div>
          </div>
          <Button variant="outline" className="w-full" onClick={(): void => setRead(true)}>Click To Read Content</Button>
          {read && (
              <DynamicPdfViewer isOpen={read} onToggle={handleCloseRead} fileUrl={resource.url} />
          )}
        </div>
      )
    }

    return (
      <div className="space-y-4">
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          {getFileIcon(resource.fileFormat)}
          <h3 className="text-lg font-semibold mb-2 mt-4">Resource Preview</h3>
          <p className="text-gray-600">
            Preview for {resource.title} - {resource.type}
          </p>
        </div>
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onCloseAction}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-xl font-bold mb-2">{resource.title}</DialogTitle>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary">{resource.type}</Badge>
                {resource.isFeatured && <Badge variant="default">Featured</Badge>}
                <div className="flex items-center text-sm text-gray-600">
                  <Star className="w-4 h-4 mr-1 text-yellow-500" />
                  {resource.rating}
                </div>
              </div>
            </div>
            {/*<Button variant="ghost" size="sm" onClick={onCloseAction}>*/}
            {/*  <X className="w-4 h-4" />*/}
            {/*</Button>*/}
          </div>
        </DialogHeader>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Preview Content */}
          <div className="md:col-span-2">{renderPreviewContent()}</div>

          {/* Resource Info Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Resource Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Downloads</span>
                    <div className="flex items-center">
                      <Download className="w-4 h-4 mr-1" />
                      {resource.downloads}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Rating</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1 text-yellow-500" />
                      {resource.rating}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Category</span>
                    <Badge variant="outline">{resource.category?.name}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Description</h3>
                <p className="text-sm text-gray-600 mb-4">{resource.description}</p>

                <h4 className="font-semibold mb-2">Tags</h4>
                <div className="flex flex-wrap gap-1">
                  {resource.tags.map((tag) => (
                    <Badge key={tag.id} variant="outline" className="text-xs">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <Button onClick={handleDownload} disabled={isDownloading} className="w-full">
                <Download className="w-4 h-4 mr-2" />
                {isDownloading ? "Downloading..." : "Download Resource"}
              </Button>

              <Button variant="outline" className="w-full">
                <ExternalLink className="w-4 h-4 mr-2" />
                Open in New Tab
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ResourcePreview
