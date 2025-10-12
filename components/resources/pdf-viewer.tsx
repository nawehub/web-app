import React from 'react';

import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import FilePreview from "@/components/resources/file-preview";

interface PdfViewerProps {
    isOpen: boolean;
    onToggle: () => void;
    fileUrl: string;
    fileTitle?: string;
    fName?: string;
}

function PdfViewer({ isOpen, onToggle, fileUrl, fileTitle }: PdfViewerProps) {
    // Create a new plugin instance
    // const defaultLayoutPluginInstance = defaultLayoutPlugin();
    return (
        <Dialog open={isOpen} onOpenChange={onToggle}>
            <DialogContent className="max-w-7xl max-h-screen">
                <DialogHeader>
                    <DialogTitle>{fileTitle}</DialogTitle>
                </DialogHeader>
                <FilePreview fileUrl={fileUrl} title={fileTitle} showUploadArea={false} onClose={onToggle} />
            </DialogContent>
        </Dialog>

    );
}

export default PdfViewer;