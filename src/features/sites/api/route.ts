import { allSites } from '@/features/sites/data/sites'
import { NextResponse } from 'next/server'

export const GET = async (req: Request) => {
    const { searchParams } = new URL(req.url)
    const page = Number(searchParams.get('page') || 0)
    const keyword = searchParams.get('keyword')?.toLowerCase()
    const ownerPick = searchParams.get('ownerPick') === 'true'
    const ceoPick = searchParams.get('ceoPick') === 'true'

    let filtered = allSites

    if (keyword) {
        filtered = filtered.filter(
            (site) =>
                site.name.toLowerCase().includes(keyword) ||
                site.description.toLowerCase().includes(keyword) ||
                site.labels.some((label) =>
                    label.toLowerCase().includes(keyword)
                )
        )
    }

    if (ownerPick) {
        filtered = filtered.filter((site) => site.ownerPick)
    }

    if (ceoPick) {
        filtered = filtered.filter((site) => site.ceoPick)
    }

    const pageSize = 10
    const start = page * pageSize
    const end = start + pageSize
    const paginated = filtered.slice(start, end)

    return NextResponse.json({
        items: paginated,
        nextPage: end < filtered.length ? page + 1 : null,
    })
}
