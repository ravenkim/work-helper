// features/sites/components/CategoryAccordion.tsx
'use client'

import {
    AccordionItem,
    AccordionContent,
    AccordionTrigger,
} from '@/shared/lib/shadcn/components/ui/accordion'
import React from 'react'

import { Category, Site } from '@/features/sites/types/type'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/lib/shadcn/components/ui/card'
import { Badge } from '@/shared/lib/shadcn/components/ui/badge'

const CategoryAccordion: React.FC<{
    categories: Category[]
    sites: Site[]
    depth?: number
}> = ({ categories, sites, depth = 0 }) => {

    // 현재 카테고리에 직접 연결된 사이트 필터링
    const currentCategorySites = (categoryId: string) =>
        sites.filter((site) => site.category === categoryId);


    const hasVisibleContent = (category: Category): boolean => {
        const sitesInCategory = currentCategorySites(category.id);
        if (sitesInCategory.length > 0) return true;
        if (!category.children) return false;
        return category.children.some(child => hasVisibleContent(child));
    };

    return (
        <>
            {categories.map((category) => {
                const sitesInCurrentCategory = currentCategorySites(category.id);
                const hasChildren = category.children && category.children.length > 0;

                const visible = sitesInCurrentCategory.length > 0 || hasVisibleContent(category);
                if (!visible && depth > 0) {
                    return null;
                }

                return (
                    <AccordionItem key={category.id} value={category.id}>
                        <AccordionTrigger
                            style={{ paddingLeft: `${16 + depth * 8}px` }}
                        >
                            {category.name}
                        </AccordionTrigger>

                        <AccordionContent
                            style={{ paddingLeft: `${16 + (depth + 1) * 8}px` }}
                        >
                            {/* 해당 카테고리에 속하는 사이트 목록 */}
                            {sitesInCurrentCategory.map((site) => (
                                <Card key={site.url} className="mb-4 overflow-hidden rounded-lg shadow-sm px-8">
                                    <div className="grid grid-cols-[180px_1fr] md:grid-cols-[220px_1fr] gap-0">
                                        {/* 이미지 섹션 (site.imageUrl이 있을 때만 렌더링) */}
                                        {site.imageUrl && (
                                            <div className="relative h-full w-full">
                                                <img
                                                    src={site.imageUrl}
                                                    alt={site.name}
                                                    loading="lazy"
                                                    decoding="async"
                                                    style={{ objectFit: 'contain', width: '100%', height: '100%' }}
                                                    // Image 쓰면 도메인 관리 해줘야함
                                                />
                                            </div>
                                        )}

                                        {!site.imageUrl && (
                                            <div className="relative h-full w-full bg-gray-100 flex justify-center items-center">
                                                <span className="text-gray-400 text-sm">No Image </span>
                                            </div>
                                        )}
                                        {/* 콘텐츠 섹션 */}
                                        <div className="flex flex-col pl-6">
                                            <CardHeader className="p-0 mb-2">
                                                <CardTitle className="text-lg md:text-xl font-semibold leading-tight">
                                                    {site.name}
                                                </CardTitle>
                                                <CardDescription className="text-sm text-muted-foreground line-clamp-2 md:line-clamp-3">
                                                    {site.description}
                                                </CardDescription>
                                            </CardHeader>

                                            <CardContent className="p-0 flex-grow">
                                                {/* URL 링크 */}
                                                <a
                                                    href={site.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="block text-sm text-blue-600 hover:underline truncate"
                                                    title={site.url}
                                                >
                                                    {site.url}
                                                </a>
                                            </CardContent>

                                            {/* 레이블 섹션 */}
                                            {site.labels && site.labels.length > 0 && (
                                                <CardFooter className="p-0 pt-3 flex flex-wrap gap-2">
                                                    {site.labels.map((label, index) => (
                                                        <Badge key={index} variant="secondary">
                                                            {label}
                                                        </Badge>
                                                    ))}
                                                </CardFooter>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            ))}

                            {/* 하위 카테고리가 있을 경우 재귀적으로 렌더링 */}
                            {hasChildren && (
                                <div
                                    style={{ paddingLeft: `${0}px` }} // 여기서 다시 depth에 따라 조절되므로 0으로 설정
                                >
                                    <CategoryAccordion
                                        categories={category.children!}
                                        sites={sites}
                                        depth={depth + 1}
                                    />
                                </div>
                            )}

                            {/* 해당 카테고리에 사이트나 하위 카테고리가 없을 때 메시지 */}
                            {sitesInCurrentCategory.length === 0 && !hasChildren && (
                                <p
                                    style={{
                                        marginLeft: `${0}px`, // 이미 상위 AccordionContent에서 패딩이 적용되므로 0으로 설정
                                        color: '#666',
                                    }}
                                >
                                    이 카테고리에는 등록된 사이트가 없습니다.
                                    보이면 안됨 이미 재귀적으로 없애주고 있음
                                </p>
                            )}
                        </AccordionContent>
                    </AccordionItem>
                );
            })}
        </>
    )
}

export default CategoryAccordion;