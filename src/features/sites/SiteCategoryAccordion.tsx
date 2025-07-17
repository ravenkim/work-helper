'use client'

import React, { useEffect, useState } from 'react'
import { Accordion } from '@/shared/lib/shadcn/components/ui/accordion'
import { useTranslation } from 'react-i18next'
import { Category, Site } from '@/features/sites/type'
import CategoryAccordion from '@/features/sites/CategoryAccordion'
import i18n from '@/assets/locales/i18n'

const SiteCategoryAccordion: React.FC = () => {
    const { t } = useTranslation()
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)  // 클라이언트에서만 실행되도록 상태 설정
        if (typeof window !== 'undefined') {
            const lng = localStorage.getItem('i18nextLng') || 'ko'
            i18n.changeLanguage(lng)
        }
    }, [])

    // 클라이언트에서만 렌더링되도록 설정
    if (!isClient) {
        return null
    }

    // i18n에서 'categories'와 'sites' 데이터를 가져옴
    const data = t('categories', { returnObjects: true }) as Category[]
    const sites = t('sites', { returnObjects: true }) as Site[]

    // 데이터가 로드되지 않았을 경우 로딩 메시지 표시
    if (!data || data.length === 0 || !sites) {
        return <div>데이터를 불러오는 중입니다...</div>
    }

    return (
        <div className={'w-full flex flex-col items-center'}>
            <div
                className={'w-[80%]'}
            ><Accordion type="multiple" className="w-full" suppressHydrationWarning>
                <CategoryAccordion categories={data} sites={sites} />
            </Accordion></div>
        </div>
    )
}

export default SiteCategoryAccordion
