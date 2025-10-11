import React, { useState, ChangeEvent, useEffect, useRef, JSX } from 'react';
import { FileText, Image, Film, Music, FileCode, Archive, File as FileIcon, X, Download, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';
import * as mammoth from 'mammoth';

type FileCategory = 'image' | 'video' | 'audio' | 'pdf' | 'docx' | 'text' | 'code' | 'archive' | 'unknown';

interface FileTypeCategories {
    [key: string]: string[];
}

// Declare PDF.js types
declare global {
    interface Window {
        pdfjsLib: any;
    }
}

interface FilePreviewProps {
    fileUrl?: string;
    file?: File;
    title?: string;
    onClose?: () => void;
    showUploadArea?: boolean;
}

const FilePreview: React.FC<FilePreviewProps> = ({
                                                     fileUrl,
                                                     file: externalFile,
                                                     title: externalTitle,
                                                     onClose,
                                                     showUploadArea = true
                                                 }) => {
    const [file, setFile] = useState<File | null>(externalFile || null);
    const [preview, setPreview] = useState<string | null>(null);
    const [fileType, setFileType] = useState<FileCategory | null>(null);
    const [zoom, setZoom] = useState<number>(1);
    const [error, setError] = useState<string | null>(null);
    const [pdfDoc, setPdfDoc] = useState<any>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [pdfLoading, setPdfLoading] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [fileName, setFileName] = useState<string>(externalTitle || '');
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const renderTaskRef = useRef<any>(null);

    const fileTypeCategories: FileTypeCategories = {
        image: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'],
        video: ['mp4', 'webm', 'ogg', 'mov'],
        audio: ['mp3', 'wav', 'ogg', 'aac', 'm4a'],
        pdf: ['pdf'],
        docx: ['docx', 'doc'],
        text: ['txt', 'md', 'csv', 'log'],
        code: ['js', 'jsx', 'ts', 'tsx', 'html', 'css', 'json', 'xml', 'py', 'java', 'cpp', 'c', 'cs', 'php', 'rb', 'go', 'rs', 'swift'],
        archive: ['zip', 'rar', '7z', 'tar', 'gz'],
    };

    // Load PDF.js
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
        script.async = true;
        script.onload = () => {
            if (window.pdfjsLib) {
                window.pdfjsLib.GlobalWorkerOptions.workerSrc =
                    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            }
        };
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    // Fetch file from URL if provided
    useEffect(() => {
        if (fileUrl) {
            fetchFileFromUrl(fileUrl).then();
        }
    }, [fileUrl]);

    // Handle external file prop
    useEffect(() => {
        if (externalFile && !fileUrl) {
            setFile(externalFile);
            processFile(externalFile).then();
        }
    }, [externalFile]);

    const fetchFileFromUrl = async (url: string) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': '*/*',
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
            }

            // Get content type from response
            const contentType = response.headers.get('Content-Type') || 'application/octet-stream';

            // Try to get filename from Content-Disposition header
            let filename = externalTitle;
            if (!filename) {
                const contentDisposition = response.headers.get('Content-Disposition');
                if (contentDisposition) {
                    const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
                    if (filenameMatch && filenameMatch[1]) {
                        filename = filenameMatch[1].replace(/['"]/g, '');
                    }
                }
            }

            // Fallback to URL parsing or default
            if (!filename) {
                const urlPath = url.split('?')[0]; // Remove query params
                filename = urlPath.split('/').pop() || 'file';

                // Add extension based on content type if missing
                if (!filename.includes('.')) {
                    const ext = getExtensionFromContentType(contentType);
                    if (ext) filename += `.${ext}`;
                }
            }

            const blob = await response.blob();
            const fetchedFile = new File([blob], filename, { type: contentType });

            setFile(fetchedFile);
            setFileName(filename);
            await processFile(fetchedFile);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to load file from URL';
            setError(errorMessage);
            console.error('Error fetching file:', err);
        } finally {
            setLoading(false);
        }
    };

    const getExtensionFromContentType = (contentType: string): string | null => {
        const typeMap: { [key: string]: string } = {
            'application/pdf': 'pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
            'application/msword': 'doc',
            'image/jpeg': 'jpg',
            'image/png': 'png',
            'image/gif': 'gif',
            'image/webp': 'webp',
            'image/svg+xml': 'svg',
            'video/mp4': 'mp4',
            'video/webm': 'webm',
            'audio/mpeg': 'mp3',
            'audio/wav': 'wav',
            'text/plain': 'txt',
            'text/csv': 'csv',
            'application/json': 'json',
        };

        return typeMap[contentType] || null;
    };

    const processFile = async (selectedFile: File) => {
        setError(null);
        setZoom(1);
        setCurrentPage(1);
        setPdfDoc(null);
        setTotalPages(0);

        const category = getFileCategory(selectedFile.name);
        setFileType(category);

        try {
            // Handle DOCX files
            if (category === 'docx') {
                const arrayBuffer = await selectedFile.arrayBuffer();
                const result = await mammoth.convertToHtml({ arrayBuffer });
                setPreview(result.value);
                return;
            }

            // Handle PDF files
            if (category === 'pdf') {
                if (!window.pdfjsLib) {
                    setError('PDF library not loaded yet. Please try again.');
                    return;
                }

                const arrayBuffer = await selectedFile.arrayBuffer();
                const loadingTask = window.pdfjsLib.getDocument({ data: arrayBuffer });
                const pdf = await loadingTask.promise;
                setPdfDoc(pdf);
                setTotalPages(pdf.numPages);
                setPreview('pdf-loaded');
                return;
            }

            const reader = new FileReader();

            reader.onload = (event: ProgressEvent<FileReader>) => {
                setPreview(event.target?.result as string);
            };

            reader.onerror = () => {
                setError('Failed to read file');
            };

            if (category === 'image') {
                reader.readAsDataURL(selectedFile);
            } else if (category === 'text' || category === 'code') {
                reader.readAsText(selectedFile);
            } else if (category === 'video' || category === 'audio') {
                reader.readAsDataURL(selectedFile);
            } else {
                setPreview(null);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to process file';
            setError(errorMessage);
            console.error('Error processing file:', err);
        }
    };

    // Render PDF page
    useEffect(() => {
        if (pdfDoc && canvasRef.current && fileType === 'pdf') {
            renderPdfPage(currentPage).then();
        }
    }, [pdfDoc, currentPage, zoom]);

    const renderPdfPage = async (pageNum: number) => {
        if (!pdfDoc || !canvasRef.current) return;

        // Cancel any ongoing render task
        if (renderTaskRef.current) {
            try {
                renderTaskRef.current.cancel();
            } catch (err) {
                // Ignore cancellation errors
            }
            renderTaskRef.current = null;
        }

        setPdfLoading(true);
        try {
            const page = await pdfDoc.getPage(pageNum);
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            if (!context) return;

            const viewport = page.getViewport({ scale: zoom * 1.5 });
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            const renderContext = {
                canvasContext: context,
                viewport: viewport
            };

            // Store the render task so we can cancel it if needed
            renderTaskRef.current = page.render(renderContext);

            await renderTaskRef.current.promise;
            renderTaskRef.current = null;
        } catch (err: any) {
            // Ignore cancellation errors
            if (err?.name !== 'RenderingCancelledException') {
                console.error('Error rendering PDF page:', err);
                setError('Failed to render PDF page');
            }
        } finally {
            setPdfLoading(false);
        }
    };

    const getFileCategory = (fileName: string): FileCategory => {
        const ext = fileName.split('.').pop()?.toLowerCase() || '';
        for (const [category, extensions] of Object.entries(fileTypeCategories)) {
            if (extensions.includes(ext)) return category as FileCategory;
        }
        return 'unknown';
    };

    const getFileIcon = (category: FileCategory | null) => {
        const icons: Record<FileCategory, typeof FileIcon> = {
            image: Image,
            video: Film,
            audio: Music,
            pdf: FileText,
            docx: FileText,
            text: FileText,
            code: FileCode,
            archive: Archive,
            unknown: FileIcon,
        };
        return icons[category || 'unknown'];
    };

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        setFileName(selectedFile.name);
        await processFile(selectedFile);
    };

    const clearFile = () => {
        // Cancel any ongoing PDF render
        if (renderTaskRef.current) {
            try {
                renderTaskRef.current.cancel();
            } catch (err) {
                // Ignore cancellation errors
            }
            renderTaskRef.current = null;
        }

        setFile(null);
        setPreview(null);
        setFileType(null);
        setZoom(1);
        setError(null);
        setPdfDoc(null);
        setCurrentPage(1);
        setTotalPages(0);
        setFileName('');

        if (onClose) {
            onClose();
        }
    };

    const downloadFile = () => {
        if (!file) return;
        const url = URL.createObjectURL(file);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        a.click();
        URL.revokeObjectURL(url);
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const goToPrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const renderPreview = (): JSX.Element => {
        if (loading) {
            return (
                <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading file...</p>
                    </div>
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex items-center justify-center h-full text-red-500">
                    <div className="text-center">
                        <X className="w-16 h-16 mx-auto mb-4" />
                        <p className="text-lg font-semibold">{error}</p>
                    </div>
                </div>
            );
        }

        if (!preview && fileType !== 'archive' && fileType !== 'unknown') {
            return (
                <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">Processing file...</p>
                    </div>
                </div>
            );
        }

        switch (fileType) {
            case 'image':
                return (
                    <div className="flex items-center justify-center h-full overflow-auto p-4">
                        <img
                            src={preview || ''}
                            alt={fileName || 'Preview'}
                            style={{ transform: `scale(${zoom})` }}
                            className="max-w-full max-h-full object-contain transition-transform duration-200"
                        />
                    </div>
                );

            case 'video':
                return (
                    <div className="flex items-center justify-center h-full p-4">
                        <video controls className="max-w-full max-h-full">
                            <source src={preview || ''} type={file?.type} />
                            Your browser does not support video playback.
                        </video>
                    </div>
                );

            case 'audio':
                return (
                    <div className="flex items-center justify-center h-full p-8">
                        <div className="w-full max-w-md">
                            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg p-8 mb-4 text-white text-center">
                                <Music className="w-16 h-16 mx-auto mb-4" />
                                <p className="text-lg font-semibold truncate">{fileName || file?.name}</p>
                            </div>
                            <audio controls className="w-full">
                                <source src={preview || ''} type={file?.type} />
                                Your browser does not support audio playback.
                            </audio>
                        </div>
                    </div>
                );

            case 'pdf':
                return (
                    <div className="h-full w-full flex flex-col bg-gray-800">
                        {pdfLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                            </div>
                        )}

                        {/* PDF Controls */}
                        <div className="bg-gray-900 p-4 flex items-center justify-between text-white">
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={goToPrevPage}
                                    disabled={currentPage === 1}
                                    className="p-2 hover:bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <span className="text-sm">
                                  Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    onClick={goToNextPage}
                                    disabled={currentPage === totalPages}
                                    className="p-2 hover:bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
                                    className="p-2 hover:bg-gray-700 rounded"
                                >
                                    <ZoomOut className="w-5 h-5" />
                                </button>
                                <span className="text-sm w-16 text-center">{Math.round(zoom * 100)}%</span>
                                <button
                                    onClick={() => setZoom(Math.min(3, zoom + 0.25))}
                                    className="p-2 hover:bg-gray-700 rounded"
                                >
                                    <ZoomIn className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* PDF Canvas */}
                        <div className="flex-1 overflow-auto flex items-center justify-center p-4">
                            <canvas ref={canvasRef} className="shadow-2xl" />
                        </div>
                    </div>
                );

            case 'docx':
                return (
                    <div className="h-full overflow-auto p-8 bg-white">
                        <div className="max-w-4xl mx-auto prose prose-slate prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700">
                            <div dangerouslySetInnerHTML={{ __html: preview || '' }} />
                        </div>
                    </div>
                );

            case 'text':
            case 'code':
                return (
                    <div className="h-full overflow-auto p-6">
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm font-mono whitespace-pre-wrap break-words">
              {preview}
            </pre>
                    </div>
                );

            case 'archive':
            case 'unknown':
                const IconComponent = getFileIcon(fileType);
                return (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <IconComponent className="w-24 h-24 mx-auto mb-4 text-gray-400" />
                            <p className="text-gray-600 mb-2">Preview not available</p>
                            <p className="text-sm text-gray-500">Click download to view this file</p>
                        </div>
                    </div>
                );

            default:
                return <div className="flex items-center justify-center h-full text-gray-500">Unknown file type</div>;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
            <div className="max-w-6xl mx-auto">
                {!file && showUploadArea ? (
                    <div className="bg-white rounded-2xl shadow-xl p-12">
                        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-all hover:border-blue-500 hover:shadow-lg">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <FileIcon className="w-16 h-16 text-gray-400 mb-4" />
                                <p className="mb-2 text-lg font-semibold text-gray-700">
                                    Click to upload or drag and drop
                                </p>
                                <p className="text-sm text-gray-500">
                                    Supports images, videos, audio, PDFs, DOCX, text files, code, and more
                                </p>
                            </div>
                            <input
                                type="file"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </label>
                    </div>
                ) : file ? (
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4 flex-1 min-w-0">
                                    {React.createElement(getFileIcon(fileType), {
                                        className: "w-8 h-8 flex-shrink-0"
                                    })}
                                    <div className="min-w-0 flex-1">
                                        <h2 className="text-xl font-semibold truncate">{fileName || file.name}</h2>
                                        <p className="text-sm text-blue-100">
                                            {formatFileSize(file.size)} • {fileType?.toUpperCase()}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
                                    {fileType === 'image' && (
                                        <>
                                            <button
                                                onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
                                                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                                title="Zoom Out"
                                            >
                                                <ZoomOut className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => setZoom(Math.min(3, zoom + 0.25))}
                                                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                                title="Zoom In"
                                            >
                                                <ZoomIn className="w-5 h-5" />
                                            </button>
                                        </>
                                    )}
                                    <button
                                        onClick={downloadFile}
                                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                        title="Download"
                                    >
                                        <Download className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            clearFile()
                                            onClose && onClose();
                                        }}
                                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                        title="Close"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Preview Area */}
                        <div className="bg-gray-50"
                             style={{ height: '1000px', width: "900px", marginLeft: "auto", marginRight: "auto", border: '1px solid rgba(0, 0, 0, 0.3)' }}
                        >
                            {renderPreview()}
                        </div>
                    </div>
                ) : null}

                {/* Upload Another */}
                {file && showUploadArea && (
                    <div className="mt-6 text-center">
                        <label className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition-colors shadow-lg hover:shadow-xl">
                            <FileIcon className="w-5 h-5 mr-2" />
                            Upload Another File
                            <input
                                type="file"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </label>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FilePreview;