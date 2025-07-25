'use client';

import React, { useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import {useToast} from "@/hooks/use-toast";

export function AuthErrorBoundary({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();
    const { toast } = useToast()

    useEffect(() => {
        if (session?.error === 'RefreshAccessTokenError') {
            toast({
                title: 'Email verified successfully',
                description: 'Please create your password to complete registration.',
            });
            signOut({callbackUrl: '/login'}).then();
        }
    }, [session]);

    return <>{children}</>;
}
