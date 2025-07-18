// features/sites/api/useInfiniteSiteQuery.ts
import { useState, useEffect, useCallback } from 'react';
import { Site } from '@/features/sites/types/type'; // Site 타입을 가져옵니다.
// allSites 데이터를 직접 가져오지 않습니다.

interface UseInfiniteSiteQueryReturn {
    data: Site[];
    fetchNextPage: () => void;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    isLoading: boolean;
    isError: boolean;
    refetch: () => void;
}

const ITEMS_PER_PAGE = 5; // 한 번에 불러올 아이템 수

export const useInfiniteSiteQuery = (
    initialSites: Site[], // 서버에서 받은 전체 사이트 데이터
    ownerPick: boolean,
    ceoPick: boolean,
    searchTerm: string
): UseInfiniteSiteQueryReturn => {
    const [data, setData] = useState<Site[]>([]);
    const [page, setPage] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
    const [isError, setIsError] = useState(false);
    const [hasNextPage, setHasNextPage] = useState(true);

    // 필터링된 전체 사이트 목록을 계산하는 함수
    const getFilteredAndSortedSites = useCallback(() => {
        let filtered = initialSites;

        if (ownerPick) {
            filtered = filtered.filter(site => site.ownerPick);
        }
        if (ceoPick) {
            filtered = filtered.filter(site => site.ceoPick);
        }
        if (searchTerm) {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            filtered = filtered.filter(site =>
                site.name.toLowerCase().includes(lowerCaseSearchTerm) ||
                site.description.toLowerCase().includes(lowerCaseSearchTerm) ||
                site.labels.some(label => label.toLowerCase().includes(lowerCaseSearchTerm))
            );
        }
        return filtered;
    }, [initialSites, ownerPick, ceoPick, searchTerm]);


    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setIsError(false);
        setPage(0); // 검색/필터 변경 시 페이지 초기화

        try {
            const filteredSites = getFilteredAndSortedSites();
            const initialData = filteredSites.slice(0, ITEMS_PER_PAGE);
            setData(initialData);
            setHasNextPage(filteredSites.length > ITEMS_PER_PAGE);

        } catch (err) {
            console.error("Failed to fetch sites:", err);
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    }, [getFilteredAndSortedSites]); // 의존성 추가


    const fetchNextPage = useCallback(async () => {
        if (!hasNextPage || isFetchingNextPage) return;

        setIsFetchingNextPage(true);
        try {
            const filteredSites = getFilteredAndSortedSites();
            const nextPageStart = (page + 1) * ITEMS_PER_PAGE;
            const nextPageEnd = nextPageStart + ITEMS_PER_PAGE;
            const newItems = filteredSites.slice(nextPageStart, nextPageEnd);

            setData(prevData => [...prevData, ...newItems]);
            setPage(prevPage => prevPage + 1);
            setHasNextPage(filteredSites.length > nextPageEnd);

        } catch (err) {
            console.error("Failed to fetch next page:", err);
            setIsError(true);
        } finally {
            setIsFetchingNextPage(false);
        }
    }, [hasNextPage, isFetchingNextPage, page, getFilteredAndSortedSites]); // 의존성 추가

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const refetch = useCallback(() => {
        fetchData();
    }, [fetchData]);

    return {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        refetch,
    };
};