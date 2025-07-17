'use client'

import {
    AccordionItem,
    AccordionContent,
    AccordionTrigger,
} from '@/shared/lib/shadcn/components/ui/accordion'
import React from 'react'

import { Category, Site } from '@/features/sites/type'
import { Card, CardTitle } from '@/shared/lib/shadcn/components/ui/card'

const CategoryAccordion: React.FC<{
    categories: Category[]
    sites: Site[]
    depth?: number
}> = ({ categories, sites, depth = 0 }) => {

    console.log(categories)

    return (
        <>
            {categories.map((category) => (
                <AccordionItem key={category.id} value={category.id}>
                    {/* 아코디언 트리거 (헤더) 부분 */}
                    <AccordionTrigger
                        style={{ paddingLeft: `${16 + depth * 16}px` }}
                    >
                        {category.name}
                    </AccordionTrigger>

                    {/* 아코디언 콘텐츠 (내용) 부분 */}
                    <AccordionContent>
                        {/* 해당 카테고리에 속하는 사이트 목록 */}
                        {sites
                            .filter((site) => site.category === category.id)
                            .map((site) => (
                                <Card
                                    key={site.url}
                                    className="mb-2 ml-[64px] overflow-hidden"
                                >
                                    <div className="grid grid-cols-[100px_1fr] gap-4">
                                        {/*<img*/}
                                        {/*    src={site.image || '/placeholder.jpg'}*/}
                                        {/*    alt={site.name}*/}
                                        {/*    className="w-[100px] h-[100px] object-cover"*/}
                                        {/*/>*/}
                                        <div className="p-4">
                                            <CardTitle className="mb-2 text-base">
                                                {site.name}
                                            </CardTitle>
                                            <p className="text-muted-foreground line-clamp-2 text-sm">
                                                {site.description}
                                            </p>
                                            <a
                                                href={site.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-2 block text-sm break-all text-blue-500 hover:underline"
                                            >
                                                {site.url}
                                            </a>
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
