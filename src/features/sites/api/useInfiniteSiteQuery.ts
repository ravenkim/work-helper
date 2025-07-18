import { NextRequest, NextResponse } from 'next/server'
import { SITE_PAGE_SIZE } from '@/features/sites/constants/constants'
import { allSites } from '@/features/sites/data/sites' // 더미 데이터

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl
    const cursor = parseInt(searchParams.get('cursor') || '0', 10)


    const slice = allSites.slice(cursor, cursor + SITE_PAGE_SIZE)
    const nextCursor = cursor + SITE_PAGE_SIZE >= allSites.length ? null : cursor + SITE_PAGE_SIZE

    return NextResponse.json({
        sites: slice,
        nextCursor,
    })
}
