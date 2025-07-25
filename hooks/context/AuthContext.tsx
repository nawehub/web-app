'use client'

import { createContext, useContext, useState, ReactNode } from 'react';
import { UserInfo } from '@/store/auth';

interface AuthContextType {
    token: string | null;
    refreshToken: string | null;
    user: UserInfo | null;
    setAuthData: (token: string | null, refreshToken: string | null, user: UserInfo | null) => void;
    clearAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [user, setUser] = useState<UserInfo | null>(null);

    const setAuthData = (token: string | null, refreshToken: string | null, user: UserInfo | null) => {
        setToken(token);
        setRefreshToken(refreshToken);
        setUser(user);
    };

    const clearAuth = () => {
        setToken(null);
        setRefreshToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ token, refreshToken, user, setAuthData, clearAuth }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
