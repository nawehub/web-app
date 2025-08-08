export async function api4app(endpoint: string, options: RequestInit = {}) {
    const baseUrl = "/api"
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };
    const response = await fetch(`${baseUrl}${endpoint}`, {
        ...options,
        headers,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'API request failed');
    return data;
}

export async function api4FileUpload(endpoint: string, options: RequestInit = {}) {
    const baseUrl = "/api"
    const headers = {
        ...options.headers,
    };

    // @ts-ignore
    delete headers['Content-Type'];

    const response = await fetch(`${baseUrl}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'API request failed');
    return data;
}