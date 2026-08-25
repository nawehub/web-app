'use client';

import React, { useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import {useToast} from "@/components/ui/use-toast";

export function AuthErrorBoundary({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();
    const { toast } = useToast()

    useEffect(() => {
        if (session?.error === 'RefreshAccessTokenError') {
            toast({
                title: 'Session expired',
                description: 'Please sign in again.',
            });
            signOut({callbackUrl: '/'}).then();
        }
    }, [session]);

    return <>{children}</>;
}
