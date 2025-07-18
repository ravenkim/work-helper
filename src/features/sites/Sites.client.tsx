'use client'

import { useInfiniteSiteQuery } from './api/useInfiniteSiteQuery'
import { useInView } from 'react-intersection-observer'
import CategoryAccordion from './components/CategoryAccordion'
import category from './data/category'
import { getFilteredCategories } from './lib/filterCategories'

const SitesClient = ({ keyword, ownerPick, ceoPick }) => {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteSiteQuery({ keyword, ownerPick, ceoPick })

    const { ref, inView } = useInView()

    const allSites = data?.pages.flatMap((page) => page.items) ?? []
    const filteredCategories = getFilteredCategories(category, allSites)

    useEffect(() => {
        if (inView && hasNextPage) fetchNextPage()
    }, [inView, hasNextPage])

    return (
        <div className="w-full">
            <CategoryAccordion categories={filteredCategories} sites={allSites} />
            {hasNextPage && <div ref={ref}>불러오는 중...</div>}
        </div>
    )
}

export default SitesClient
