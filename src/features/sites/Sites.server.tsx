// features/sites/SitesServer.tsx
import React from 'react'
import category from '@/features/sites/data/category'
import { allSites as staticAllSites } from '@/features/sites/data/sites' // allSites 데이터 불러오기
import SitesClient from '@/features/sites/Sites.client'
import { getUrlMetadata } from '@/shared/utils/api/getUrlMetadata' // getUrlMetadata 불러오기
import { Category, Site } from '@/features/sites/types/type' // Site, Category 타입

// 카테고리 트리에서 id 순서 배열 만들기
function getCategoryOrder(categories: Category[]): string[] {
    let order: string[] = []
    categories.forEach((cat) => {
        order.push(cat.id)
        if (cat.children && cat.children.length > 0) {
            order = order.concat(getCategoryOrder(cat.children))
        }
    })
    return order
}

// 사이트를 카테고리 순서에 맞게 정렬
function sortSitesByCategoryOrder(
    sites: Site[],
    categories: Category[],
): Site[] {
    const order = getCategoryOrder(categories)
    return [...sites].sort((a, b) => {
        const aIdx = order.indexOf(a.category)
        const bIdx = order.indexOf(b.category)
        // 없는 카테고리는 맨 뒤로
        if (aIdx === -1 && bIdx === -1) return 0
        if (aIdx === -1) return 1
        if (bIdx === -1) return -1
        return aIdx - bIdx
    })
}

const SitesServer = async () => {
    const categoriesData = category

    if (!categoriesData || categoriesData.length === 0) {
        return <div>카테고리 데이터를 불러오는 중입니다...</div>
    }

    // 모든 사이트에 대해 메타데이터를 미리 가져옵니다.
    const sitesWithMetadata = await Promise.all(
        staticAllSites.map(async (site) => {
            try {
                const metadata = await getUrlMetadata(site.url)
                return {
                    ...site,
                    imageUrl: site.imageUrl || metadata.imageUrl || null,
                    name:
                        metadata.name === site.name
                            ? site.name
                            : (metadata.name ? `${site.name}[${metadata.name}]` : site.name),
                    description: site.description || null,
                    metaDescription: metadata.description || null,
                    labels: Array.from(
                        new Set([...metadata.keywords, ...site.labels]),
                    ), // 키워드와 기존 라벨 합치기
                } as Site // 명시적으로 Site 타입 지정
            } catch (error) {
                console.error(`Error fetching metadata for ${site.url}:`, error)
                return {
                    ...site,
                    imageUrl: site.imageUrl || null,
                } as Site
            }
        }),
    )
    // 카테고리 트리 순서에 맞게 사이트 정렬
    const sortedSites = sortSitesByCategoryOrder(
        sitesWithMetadata,
        categoriesData,
    )

    // 정렬, 필터링, 페이지네이션은 여전히 SitesClient에서 처리하되,
    // SitesClient가 이 메타데이터가 포함된 전체 사이트 목록을 받음
    return (
        <SitesClient categories={categoriesData} initialSites={sortedSites} />
    )
}

export default SitesServer
