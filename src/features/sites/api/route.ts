// features/sites/api/route.ts
import { NextResponse } from 'next/server'
import { allSites } from '@/features/sites/data/sites'
import { getUrlMetadata } from '@/shared/utils/api/getUrlMetadata'

const ITEMS_PER_PAGE = 10 // 한 페이지당 가져올 아이템 수

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const cursor = searchParams.get('cursor')
    const ownerPick = searchParams.get('ownerPick') === 'true'
    const ceoPick = searchParams.get('ceoPick') === 'true'
    const searchTerm = searchParams.get('searchTerm')?.toLowerCase() || ''

    let filteredSites = allSites

    // 1. ownerPick 필터링
    if (ownerPick) {
        filteredSites = filteredSites.filter((site) => site.ownerPick)
    }

    // 2. ceoPick 필터링
    if (ceoPick) {
        filteredSites = filteredSites.filter((site) => site.ceoPick)
    }

    // 3. 검색어 필터링 (labels, description, name)
    if (searchTerm) {
        filteredSites = filteredSites.filter(
            (site) =>
                site.name.toLowerCase().includes(searchTerm) ||
                site.description.toLowerCase().includes(searchTerm) ||
                site.labels.some((label) =>
                    label.toLowerCase().includes(searchTerm),
                ),
        )
    }

    // 커서 기반 페이지네이션
    const startIndex = cursor ? parseInt(cursor, 10) : 0
    const paginatedSites = filteredSites.slice(
        startIndex,
        startIndex + ITEMS_PER_PAGE,
    )

    // 각 사이트에 대한 메타데이터 fetch
    const sitesWithMetadata = await Promise.all(
        paginatedSites.map(async (site) => {
            try {
                const metadata = await getUrlMetadata(site.url)

                console.log(metadata)

                return {
                    ...site,
                    imageUrl: metadata.imageUrl || site.imageUrl || null, // 메타데이터가 없으면 기존값 또는 기본값
                    name:
                        metadata.name === site.name
                            ? site.name
                            : `${site.name}[${metadata.name}]`,
                    description: site.description || null,
                    metaDescription: metadata.description || null,
                    labels: Array.from(
                        new Set([...metadata.keywords, ...site.labels]),
                    ),
                }
            } catch (error) {
                console.error(`Error fetching metadata for ${site.url}:`, error)
                // 메타데이터 fetching 실패 시에도 기존 site 정보와 대체 이미지로 반환
                return {
                    ...site,
                    imageUrl: site.imageUrl || null,
                }
            }
        }),
    )

    const nextCursor =
        startIndex + ITEMS_PER_PAGE < filteredSites.length
            ? startIndex + ITEMS_PER_PAGE
            : undefined

    return NextResponse.json({
        sites: sitesWithMetadata,
        nextCursor,
    })
}
