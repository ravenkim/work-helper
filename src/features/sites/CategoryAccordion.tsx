'use client'

import {
    AccordionItem,
    AccordionContent,
    AccordionTrigger,
} from '@/shared/lib/shadcn/components/ui/accordion'
import React from 'react'

import { Category, Site } from '@/features/sites/type'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/lib/shadcn/components/ui/card'
import { Badge } from '@/shared/lib/shadcn/components/ui/badge'

const CategoryAccordion: React.FC<{
    categories: Category[]
    sites: Site[]
    depth?: number
}> = ({ categories, sites, depth = 0 }) => {

    return (
        <>
            {categories.map((category) => (
                <AccordionItem key={category.id} value={category.id}>
                    {/* 아코디언 트리거 (헤더) 부분 */}
                    <AccordionTrigger
                        style={{ paddingLeft: `${16 + depth * 8}px` }}
                    >
                        {category.name}
                    </AccordionTrigger>

                    {/* 아코디언 콘텐츠 (내용) 부분 */}
                    <AccordionContent
                        style={{ paddingLeft: `${16 + (depth+1) * 8}px` }}
                    >
                        {/* 해당 카테고리에 속하는 사이트 목록 */}
                        {sites
                            .filter((site) => site.category === category.id)
                            .map((site) => (
                                <Card key={site.url} className="mb-4 overflow-hidden rounded-lg shadow-sm px-8">
                                    <div className="grid grid-cols-[180px_1fr] md:grid-cols-[220px_1fr] gap-0">
                                        {/* 이미지 섹션 */}
                                        <div className="relative h-full w-full">
                                            <img
                                                src={site.imageUrl || '/placeholder.jpg'}
                                                alt={site.name}
                                                className="h-full w-full object-contain"
                                            />
                                            {/* 이미지 위에 레이블을 오버레이하고 싶다면 여기에 배치할 수 있습니다. */}
                                        </div>

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
                                                    title={site.url} // 마우스 오버 시 전체 URL 표시
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
                        {category.children && category.children.length > 0 && (
                            <div
                                style={{ paddingLeft: `${16 + depth * 16}px` }}
                            >
                                <CategoryAccordion
                                    categories={category.children}
                                    sites={sites}
                                    depth={depth + 1}
                                />
                            </div>
                        )}

                        {/* 해당 카테고리에 사이트나 하위 카테고리가 없을 때 메시지 */}
                        {sites.filter((site) => site.category === category.id)
                            .length === 0 &&
                            (!category.children ||
                                category.children.length === 0) && (
                                <p
                                    style={{
                                        marginLeft: `${32 + depth * 16}px`,
                                        color: '#666',
                                    }}
                                >
                                    이 카테고리에는 등록된 사이트가 없습니다.
                                </p>
                            )}
                    </AccordionContent>
                </AccordionItem>
            ))}
        </>
    )
}

export default CategoryAccordion
