'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Accordion } from '@/shared/lib/shadcn/components/ui/accordion';
import CategoryAccordion from '@/features/sites/components/CategoryAccordion';
import { Category, Site } from '@/features/sites/types/type';
import { useInfiniteSiteQuery } from './api/useInfiniteSiteQuery';
import { Input } from '@/shared/lib/shadcn/components/ui/input';
import { Checkbox } from '@/shared/lib/shadcn/components/ui/checkbox';
import { Label } from '@/shared/lib/shadcn/components/ui/label';
import { Button } from '@/shared/lib/shadcn/components/ui/button';
import { Loader2 } from 'lucide-react';

interface SitesClientProps {
    categories: Category[];
    initialSites: Site[];
}

const SitesClient: React.FC<SitesClientProps> = ({ categories, initialSites }) => {
    const [ownerPick, setOwnerPick] = useState(false);
    const [ceoPick, setCeoPick] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        refetch
    } = useInfiniteSiteQuery(initialSites, ownerPick, ceoPick, debouncedSearchTerm);

    const allSites: Site[] = data || [];

    // 검색어 디바운싱
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);

    // 필터 또는 검색어 변경 시 데이터 다시 불러오기
    useEffect(() => {
        refetch();
    }, [debouncedSearchTerm, ownerPick, ceoPick, refetch]);


    // Intersection Observer를 사용하여 무한 스크롤 구현
    const observerTarget = useRef(null);

    useEffect(() => {
        if (!observerTarget.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 1 }
        );

        observer.observe(observerTarget.current);

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        };
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);


    // 필터링된 사이트 목록에 해당하는 카테고리만 동적으로 추출
    const getFilteredCategories = useCallback((allCats: Category[], filteredSites: Site[]): Category[] => {
        const activeCategoryIds = new Set(filteredSites.map(site => site.category));

        const filterCategoriesRecursive = (cats: Category[]): Category[] => {
            return cats.filter(cat => {
                const hasDirectSite = activeCategoryIds.has(cat.id);
                const hasChildCategories = cat.children && cat.children.length > 0;

                if (hasChildCategories) {
                    const filteredChildren = filterCategoriesRecursive(cat.children || []);
                    if (filteredChildren.length > 0) {
                        return { ...cat, children: filteredChildren };
                    }
                }
                return hasDirectSite;
            });
        };

        // 깊은 복사본을 생성하고 필터링
        const clonedCategories: Category[] = JSON.parse(JSON.stringify(allCats));
        return filterCategoriesRecursive(clonedCategories);
    }, []);


    const filteredCategories = getFilteredCategories(categories, allSites);


    if (isLoading && allSites.length === 0) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> 데이터를 불러오는 중입니다...</div>;
    }

    if (isError) {
        return <div className="text-center text-red-500">데이터를 불러오는 데 실패했습니다. 다시 시도해주세요.</div>;
    }

    return (
        <div className={'flex w-full flex-col items-center'}>
            <div className={'w-[80%] p-4'}>
                <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="ownerPick"
                            checked={ownerPick}
                            onCheckedChange={(checked: boolean) => setOwnerPick(checked)}
                        />
                        <Label htmlFor="ownerPick">Owner Pick</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="ceoPick"
                            checked={ceoPick}
                            onCheckedChange={(checked: boolean) => setCeoPick(checked)}
                        />
                        <Label htmlFor="ceoPick">CEO Pick</Label>
                    </div>
                    <Input
                        type="text"
                        placeholder="사이트 검색 (이름, 설명, 태그)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full sm:w-auto flex-grow"
                    />
                </div>

                {filteredCategories.length === 0 && allSites.length === 0 && (
                    <div className="text-center text-gray-500 mt-8">
                        검색 결과가 없습니다. 다른 검색어를 시도해보세요.
                    </div>
                )}

                <Accordion
                    type="multiple"
                    className="w-full"
                    suppressHydrationWarning
                >
                    <CategoryAccordion categories={filteredCategories || []} sites={allSites} />
                </Accordion>

                {hasNextPage && (
                    <div ref={observerTarget} className="flex justify-center py-4">
                        <Button
                            onClick={() => fetchNextPage()}
                            disabled={isFetchingNextPage}
                            className="w-fit"
                        >
                            {isFetchingNextPage ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    로딩 중...
                                </>
                            ) : (
                                '더 불러오기'
                            )}
                        </Button>
                    </div>
                )}

                {!hasNextPage && allSites.length > 0 && (
                    <div className="text-center text-gray-500 py-4">
                        모든 사이트를 불러왔습니다.
                    </div>
                )}
            </div>
        </div>
    );
};

export default SitesClient;