import React from 'react'
import { Accordion } from '@/shared/lib/shadcn/components/ui/accordion'
import CategoryAccordion from '@/features/sites/components/CategoryAccordion'
import category from '@/features/sites/data/category'
import { allSites } from '@/features/sites/data/sites'
import { getUrlMetadata } from '@/shared/utils/api/getUrlMetadata'


const SitesServer = async () => {

    const data = category
    const sites = allSites


    // Fetch metadata for each site
    const sitesWithMetadata = await Promise.all(
        sites.map(async (site) => {
            const metadata = await getUrlMetadata(site.url);
            console.log(metadata)
            return {
                ...site,
                imageUrl: metadata.imageUrl || '',
                name: metadata.name || site.name,
                description: metadata.description || site.description,
                labels: metadata.keywords || site.labels,
            };
        })
    );

    if (!data || data.length === 0 || !sitesWithMetadata) {
        return <div>데이터를 불러오는 중입니다...</div>;
    }



    return (
        <div className={'flex w-full flex-col items-center'}>
            <div className={'w-[80%]'}>
                <Accordion
                    type="multiple"
                    className="w-full"
                    suppressHydrationWarning
                >
                    <CategoryAccordion categories={data} sites={sitesWithMetadata} />
                </Accordion>
            </div>
        </div>
    )
}

export default SitesServer