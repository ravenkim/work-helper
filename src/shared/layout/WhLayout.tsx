'use client'
import Header from '@/shared/layout/Header'
import { ReactNode } from 'react'

const WhLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="group/design-root relative flex size-full min-h-screen flex-col overflow-x-hidden bg-slate-50">
            <div className="layout-container flex h-full grow flex-col">
                <Header />
                <div className="h-[calc(100dvh-65px)] w-full">{children}</div>
            </div>
        </div>
    )
}

export default WhLayout
