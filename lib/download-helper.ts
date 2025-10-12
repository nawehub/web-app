export const downloadOrPreviewFileHelper = async (url: string, fileName: string) => {
    // The browser makes a same-origin call to the Next.js server.
    const response = await fetch(url);

    if (!response.ok) {
        // Handle error...
        console.error('File fetch failed');
        return;
    }
    // For download, the browser handles the file based on Content-Disposition
    // relayed from the API Gateway.
    const blob = await response.blob();
    const objectURL = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = objectURL;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(objectURL);
}