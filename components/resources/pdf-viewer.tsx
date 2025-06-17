import React from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";

interface PdfViewerProps {
    isOpen: boolean;
    onToggle: () => void;
    fileUrl: string;
}

function PdfViewer({ isOpen, onToggle, fileUrl }: PdfViewerProps) {
    // Create a new plugin instance
    const defaultLayoutPluginInstance = defaultLayoutPlugin();
    return (
        <Dialog open={isOpen} onOpenChange={onToggle}>
            <DialogContent className="max-w-7xl max-h-screen overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Content Preview</DialogTitle>
                </DialogHeader>
                <Worker workerUrl="/pdf-workers/pdf.worker.min.mjs">
                    <div style={{ height: '1000px', width: "900px", marginLeft: "auto", marginRight: "auto", border: '1px solid rgba(0, 0, 0, 0.3)' }}>
                        <Viewer
                            fileUrl={fileUrl}
                            plugins={[defaultLayoutPluginInstance]}
                        />
                    </div>
                </Worker>
            </DialogContent>
        </Dialog>

    );
}

export default PdfViewer;

// Example usage in another component:
// <PdfViewer fileUrl="https://example.com/your-document.pdf" />
// Or for a local file:
// <PdfViewer fileUrl="/path/to/your-local-document.pdf" />