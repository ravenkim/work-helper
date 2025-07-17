'use client'
import Header from '@/shared/layout/Header'
import { ReactNode } from 'react'
import { ScrollArea } from '@/shared/lib/shadcn/components/ui/scroll-area'

const WhLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="group/design-root bg-background relative flex size-full min-h-screen flex-col overflow-x-hidden">
            <div className="layout-container flex h-full grow flex-col">
                <Header />

                <ScrollArea className="h-[calc(100dvh-65px)] w-full">
                    {children}
                </ScrollArea>
            </div>
        </div>
    )
}

export default WhLayout
