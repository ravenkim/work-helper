import WhHeader from 'src/shared/layouts/WhHeader.tsx'

import React, { ReactNode } from 'react'

interface WhLayoutProps {
    children?: ReactNode
}

const WhLayout = ({ children }: WhLayoutProps) => {
    return (
        <div
            className={'w-dvw h-dvh flex flex-col '}
        >
            <WhHeader />
            <div className="w-full h-[calc(100dvh-65px)]">

                {children}

            </div>


        </div>
    )
}

export default WhLayout
