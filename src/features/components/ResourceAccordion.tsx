import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from 'src/shared/lib/shadcn/components/ui/accordion.tsx';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from 'src/shared/lib/shadcn/components/ui/card.tsx'

interface Site {
    name: string;
    language: string[];
    url: string;
    git: string;
    description: string;
    labels: string[];
    category: string;
    ownerPick: boolean;
    ceoPick: boolean;
}

interface Category {
    name: string;
    id: string;
    children?: Category[];
}

const CategoryAccordion: React.FC<{ categories: Category[]; sites: Site[]; depth?: number }> = ({ categories, sites, depth = 0 }) => {
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
                                <Card key={site.url} className="mb-2 ml-[64px] overflow-hidden">
                                    <div className="grid grid-cols-[100px_1fr] gap-4">
                                        <img
                                            src={site.image || '/placeholder.jpg'}
                                            alt={site.name}
                                            className="w-[100px] h-[100px] object-cover"
                                        />
                                        <div className="p-4">
                                            <CardTitle className="text-base mb-2">{site.name}</CardTitle>
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {site.description}
                                            </p>
                                            <a
                                                href={site.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-blue-500 hover:underline break-all block mt-2"
                                            >
                                                {site.url}
                                            </a>
                                        </div>
                                    </div>
                                </Card>
                            ))}

                        {/* 하위 카테고리가 있을 경우 재귀적으로 렌더링 */}
                        {category.children && category.children.length > 0 && (
                            <div style={{ paddingLeft: `${16 + depth * 16}px` }}>
                                <CategoryAccordion categories={category.children} sites={sites} depth={depth + 1} />
                            </div>
                        )}

                        {/* 해당 카테고리에 사이트나 하위 카테고리가 없을 때 메시지 */}
                        {sites.filter((site) => site.category === category.id).length === 0 &&
                            (!category.children || category.children.length === 0) && (
                                <p style={{ marginLeft: `${32 + depth * 16}px`, color: '#666' }}>
                                    이 카테고리에는 등록된 사이트가 없습니다.
                                </p>
                            )}
                    </AccordionContent>
                </AccordionItem>
            ))}
        </>
    );
};

const SiteCategoryAccordion: React.FC = () => {
    const { t } = useTranslation();

    // i18n에서 'categories'와 'sites' 데이터를 가져옴
    const data = t('categories', { returnObjects: true }) as Category[];
    const sites = t('sites', { returnObjects: true }) as Site[];

    // 데이터가 로드되지 않았을 경우 로딩 메시지 표시
    if (!data || data.length === 0 || !sites) {
        return <div>데이터를 불러오는 중입니다...</div>;
    }

    return (
        <Accordion type="multiple" className="w-full ">
            <CategoryAccordion categories={data} sites={sites} />
        </Accordion>
    );
};

export default SiteCategoryAccordion;