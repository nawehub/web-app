export async function refreshAccessToken(token: any) {
    try {
        const response = await fetch(`${process.env.API_BASE_URL}/auth/refresh-access-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                refreshToken: token.refreshToken,
            }),
        });

        if (!response.ok) {
            throw await response.json();
        }

        const refreshedTokens: RefreshTokenResponse = await response.json();

        return {
            ...token,
            accessToken: refreshedTokens.accessToken,
            refreshToken: refreshedTokens.refreshToken,
            // Fix the expiration calculation - expiresIn is already a timestamp
            expiresIn: refreshedTokens.expiresIn,
            error: undefined
        };
    } catch (error) {
        console.error('Error refreshing token:', error);
        return {
            ...token,
            error: 'RefreshAccessTokenError',
        };
    }
}

interface RefreshTokenResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}

