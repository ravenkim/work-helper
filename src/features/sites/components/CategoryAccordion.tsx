// features/sites/components/CategoryAccordion.tsx
'use client'

import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/shared/lib/shadcn/components/ui/accordion'
import React from 'react'

import { Category, Site } from '@/features/sites/types/type'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/shared/lib/shadcn/components/ui/card'
import { Badge } from '@/shared/lib/shadcn/components/ui/badge'
import { Github, Link as LinkIcon } from 'lucide-react'

const CategoryAccordion: React.FC<{
    categories: Category[]
    sites: Site[]
    depth?: number
}> = ({ categories, sites, depth = 0 }) => {
    // 현재 카테고리에 직접 연결된 사이트 필터링
    const currentCategorySites = (categoryId: string) =>
        sites.filter((site) => site.category === categoryId)

    const hasVisibleContent = (category: Category): boolean => {
        const sitesInCategory = currentCategorySites(category.id)
        if (sitesInCategory.length > 0) return true
        if (!category.children) return false
        return category.children.some((child) => hasVisibleContent(child))
    }

    return (
        <>
            {categories.map((category) => {
                const sitesInCurrentCategory = currentCategorySites(category.id)
                const hasChildren =
                    category.children && category.children.length > 0

                const visible =
                    sitesInCurrentCategory.length > 0 ||
                    hasVisibleContent(category)
                if (!visible && depth > 0) {
                    return null
                }

                return (
                    <AccordionItem key={category.id} value={category.id}>
                        <AccordionTrigger
                            style={{ paddingLeft: `${16 + depth * 8}px` }}
                        >
                            {category.name}
                        </AccordionTrigger>

                        <AccordionContent
                            className={`px-4 md:pl-[${16 + (depth + 1) * 8}px]`}
                        >
                            {sitesInCurrentCategory.map((site) => (
                                <Card
                                    key={site.url}
                                    className="mb-4 overflow-hidden rounded-lg px-4 md:px-8 shadow-sm"
                                >
                                    <div className="grid grid-cols-1 gap-0 md:grid-cols-[220px_1fr]">
                                        {site.imageUrl && (
                                            <div className="relative h-[180px] w-full md:h-full md:w-[220px]">
                                                {/* 도메인 이슈로 next/image 사용 불가 */}
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={site.imageUrl}
                                                    alt={site.name}
                                                    loading="lazy"
                                                    decoding="async"
                                                    style={{
                                                        objectFit: 'contain',
                                                        width: '100%',
                                                        height: '100%',
                                                    }}
                                                />
                                            </div>
                                        )}

                                        {!site.imageUrl && (
                                            <div className="relative flex h-[180px] w-full items-center justify-center bg-gray-100 md:h-full md:w-[220px]">
                                                <span className="text-sm text-gray-400">
                                                    No Image{' '}
                                                </span>
                                            </div>
                                        )}
                                        {/* 콘텐츠 섹션 */}
                                        <div className="flex flex-col pl-6">
                                            <CardHeader className="mb-2 p-0">
                                                <CardTitle className="text-lg leading-tight font-semibold md:text-xl">
                                                    {site.name}
                                                </CardTitle>
                                                {site.description && (
                                                    <CardDescription className="text-muted-foreground line-clamp-2 text-sm md:line-clamp-3">
                                                        {site.description}
                                                    </CardDescription>
                                                )}
                                                {site.metaDescription && (
                                                    <CardDescription className="text-muted-foreground line-clamp-2 text-sm md:line-clamp-3">
                                                        {site.metaDescription}
                                                    </CardDescription>
                                                )}
                                            </CardHeader>

                                            <CardContent className="flex-grow p-0">
                                                {/* URL 링크 */}
                                                <a
                                                    href={site.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="block flex items-center gap-1 truncate text-sm text-blue-600 hover:underline"
                                                    title={site.url}
                                                >
                                                    <LinkIcon
                                                        size={16}
                                                        className="mr-1 inline-block text-gray-400"
                                                    />
                                                    {site.url}
                                                </a>
                                                {/* Git 주소가 있을 때만 표시 */}
                                                {site.git && (
                                                    <a
                                                        href={site.git}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="mt-1 block flex items-center gap-1 truncate text-sm text-gray-600 hover:underline"
                                                        title={site.git}
                                                    >
                                                        <Github
                                                            size={16}
                                                            className="mr-1 inline-block text-gray-400"
                                                        />
                                                        {site.git}
                                                    </a>
                                                )}
                                            </CardContent>

                                            {/* 레이블 섹션 */}
                                            {site.labels &&
                                                site.labels.length > 0 && (
                                                    <CardFooter className="flex flex-wrap gap-2 p-0 pt-3">
                                                        {site.labels.map(
                                                            (label, index) => (
                                                                <Badge
                                                                    key={index}
                                                                    variant="secondary"
                                                                >
                                                                    {label}
                                                                </Badge>
                                                            ),
                                                        )}
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
                            {sitesInCurrentCategory.length === 0 &&
                                !hasChildren && (
                                    <p
                                        style={{
                                            marginLeft: `${0}px`,
                                            color: '#666',
                                        }}
                                    >
                                        이 카테고리에는 등록된 사이트가
                                        없습니다. 보이면 안됨 이미 재귀적으로
                                        없애주고 있음
                                    </p>
                                )}
                        </AccordionContent>
                    </AccordionItem>
                )
            })}
        </>
    )
}

export default CategoryAccordion
