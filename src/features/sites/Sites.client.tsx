'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Accordion } from '@/shared/lib/shadcn/components/ui/accordion'
import CategoryAccordion from '@/features/sites/components/CategoryAccordion'
import { Category, Site } from '@/features/sites/types/type'
import { useInfiniteSiteQuery } from './api/useInfiniteSiteQuery'
import { Input } from '@/shared/lib/shadcn/components/ui/input'
import { Checkbox } from '@/shared/lib/shadcn/components/ui/checkbox'
import { Label } from '@/shared/lib/shadcn/components/ui/label'
import { Button } from '@/shared/lib/shadcn/components/ui/button'
import { Loader2 } from 'lucide-react'

interface SitesClientProps {
    categories: Category[]
    initialSites: Site[]
}

const SitesClient: React.FC<SitesClientProps> = ({
    categories,
    initialSites,
}) => {
    const [ownerPick, setOwnerPick] = useState(false)
    const [userPick, setuserPick] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
    const [accordionValues, setAccordionValues] = useState<string[]>([])
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        refetch,
    } = useInfiniteSiteQuery(
        initialSites,
        ownerPick,
        userPick,
        debouncedSearchTerm,
    )

    const allSites: Site[] = data || []

    // 검색어 디바운싱
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm)
        }, 500)

        return () => {
            clearTimeout(handler)
        }
    }, [searchTerm])

    // 필터 또는 검색어 변경 시 데이터 다시 불러오기
    useEffect(() => {
        refetch()
    }, [debouncedSearchTerm, ownerPick, userPick, refetch])

    // Intersection Observer를 사용하여 무한 스크롤 구현
    const observerTarget = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const target = observerTarget.current
        if (!target) return

        const observer = new IntersectionObserver(
            (entries) => {
                if (
                    entries[0].isIntersecting &&
                    hasNextPage &&
                    !isFetchingNextPage
                ) {
                    fetchNextPage()
                }
            },
            { threshold: 1 },
        )

        observer.observe(target)

        return () => {
            observer.unobserve(target)
        }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage])

    // 스크롤이 없는 경우에도 observerTarget이 화면에 보이면 fetchNextPage를 자동 호출
    useEffect(() => {
        if (
            typeof window !== 'undefined' &&
            observerTarget.current &&
            hasNextPage &&
            !isFetchingNextPage &&
            !isLoading
        ) {
            const rect = observerTarget.current.getBoundingClientRect()
            if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
                fetchNextPage()
            }
        }
    }, [
        allSites.length,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        fetchNextPage,
    ])

    // 필터링된 사이트 목록에 해당하는 카테고리만 동적으로 추출
    const getFilteredCategories = useCallback(
        (allCats: Category[], filteredSites: Site[]): Category[] => {
            const activeCategoryIds = new Set(
                filteredSites.map((site) => site.category),
            )

            const filterCategoriesRecursive = (
                cats: Category[],
            ): Category[] => {
                return cats.filter((cat) => {
                    const hasDirectSite = activeCategoryIds.has(cat.id)
                    const hasChildCategories =
                        cat.children && cat.children.length > 0

                    if (hasChildCategories) {
                        const filteredChildren = filterCategoriesRecursive(
                            cat.children || [],
                        )
                        if (filteredChildren.length > 0) {
                            return { ...cat, children: filteredChildren }
                        }
                    }
                    return hasDirectSite
                })
            }

            // 깊은 복사본을 생성하고 필터링
            const clonedCategories: Category[] = JSON.parse(
                JSON.stringify(allCats),
            )
            return filterCategoriesRecursive(clonedCategories)
        },
        [],
    )

    const filteredCategories = getFilteredCategories(categories, allSites)

    // 모든 카테고리 id를 재귀적으로 수집하는 함수
    const getAllCategoryIds = useCallback((cats: Category[]): string[] => {
        let ids: string[] = []
        cats.forEach((cat) => {
            ids.push(cat.id)
            if (cat.children && cat.children.length > 0) {
                ids = ids.concat(getAllCategoryIds(cat.children))
            }
        })
        return ids
    }, [])

    if (isLoading && allSites.length === 0) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 데이터를
                불러오는 중입니다...
            </div>
        )
    }

    if (isError) {
        return (
            <div className="text-center text-red-500">
                데이터를 불러오는 데 실패했습니다. 다시 시도해주세요.
            </div>
        )
    }

    return (
        <div className={'flex w-full flex-col items-center'}>
            <div className={'w-[80%] p-4'}>
                <div className="mb-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="ownerPick"
                            checked={ownerPick}
                            onCheckedChange={(checked: boolean) =>
                                setOwnerPick(checked)
                            }
                        />
                        <Label htmlFor="ownerPick">Owner Pick</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="userPick"
                            checked={userPick}
                            onCheckedChange={(checked: boolean) =>
                                setuserPick(checked)
                            }
                        />
                        <Label htmlFor="userPick">User Pick</Label>
                    </div>
                    <Input
                        type="text"
                        placeholder="사이트 검색 (이름, 설명, 태그)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full flex-grow sm:w-auto"
                    />
                    {/* 전체 열기/닫기 버튼 */}
                    <div className="ml-2 flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                setAccordionValues(
                                    getAllCategoryIds(filteredCategories),
                                )
                            }
                        >
                            모두 열기
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setAccordionValues([])}
                        >
                            모두 닫기
                        </Button>
                    </div>
                </div>

                {filteredCategories.length === 0 && allSites.length === 0 && (
                    <div className="mt-8 text-center text-gray-500">
                        검색 결과가 없습니다. 다른 검색어를 시도해보세요.
                    </div>
                )}

                {!mounted ? (
                    <div style={{ minHeight: 200 }} />
                ) : (
                    <Accordion
                        type="multiple"
                        className="w-full"
                        value={accordionValues}
                        onValueChange={setAccordionValues}
                    >
                        <CategoryAccordion
                            categories={filteredCategories || []}
                            sites={allSites}
                        />
                    </Accordion>
                )}

                {/* 무한 스크롤 트리거용 div, 반드시 ScrollArea 내부에 위치 */}
                {hasNextPage && (
                    <div ref={observerTarget} style={{ height: 1 }} />
                )}

                {/* 모든 사이트를 불러왔을 때 메시지 */}
                {!hasNextPage && allSites.length > 0 && (
                    <div className="py-4 text-center text-gray-500">
                        모든 사이트를 불러왔습니다.
                    </div>
                )}
            </div>
        </div>
    )
}

export default SitesClient
