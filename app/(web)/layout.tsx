import type { ReactNode } from 'react'
import Header from '@/components/public/header'
import Footer from '@/components/public/app-footer'

export default function WebLayout({ children }: { children: ReactNode }) {
    return (
        <div>
            <Header />
            <main className={"overflow-x-hidden"}>{children}</main>
            <Footer />
        </div>
    )
}