export const downloadOrPreviewFileHelper = async (folderId: string, fileName: string, isPreview: boolean, downloadName: string) => {
    const localApiUrl = `/api/resources/files/views/${folderId}/${fileName}`;
    const previewParam = isPreview ? '?preview=true' : '';

    const url = `${localApiUrl}${previewParam}`;

    // The browser makes a same-origin call to the Next.js server.
    const response = await fetch(url);

    if (!response.ok) {
        // Handle error...
        console.error('File fetch failed');
        return;
    }

    const blob = await response.blob();
    if (isPreview) {
        // For preview, get the Blob and create a temporary URL
        const objectURL = URL.createObjectURL(blob);
        // Navigate or set this URL to an <img> or <iframe>
        window.open(objectURL, '_blank');
    } else {
        // For download, the browser handles the file based on Content-Disposition
        // relayed from the API Gateway.
        const blob = await response.blob();
        const objectURL = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = objectURL;
        // The file name is usually best retrieved from the Content-Disposition header
        a.download = downloadName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(objectURL);
    }
}