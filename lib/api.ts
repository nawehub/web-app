export async function api4Public(endpoint: string, options: RequestInit = {}) {
    const headers = new Headers(options.headers);
    if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }
    return await fetch(`${process.env.API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });
}
