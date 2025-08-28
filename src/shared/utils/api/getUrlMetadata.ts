import * as cheerio from 'cheerio'
import { HOUR } from '@/shared/constants/time'
import { unstable_cache } from 'next/cache'

export const getUrlMetadata = unstable_cache(
    async (url: string) => {
        try {
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (compatible; MyBot/1.0)',
                },
                cache: 'no-store', // HTML은 캐시 안 함
            })

            const html = await response.text()
            const $ = cheerio.load(html)

            const ogImage = $('meta[property="og:image"]').attr('content')
            const twitterImage = $('meta[name="twitter:image"]').attr('content')

            const ogTitle = $('meta[property="og:title"]').attr('content')
            const ogDescription = $('meta[property="og:description"]').attr(
                'content',
            )
            const keywords = $('meta[name="keywords"]').attr('content')
            const canonicalUrl = $('link[rel="canonical"]').attr('href')
            const favicon =
                $('link[rel="icon"]').attr('href') ||
                $('link[rel="shortcut icon"]').attr('href')
            const faviconUrl = favicon ? new URL(favicon, url).href : null
            const ogUrl = $('meta[property="og:url"]').attr('content')
            const ogType = $('meta[property="og:type"]').attr('content')
            const ogSiteName = $('meta[property="og:site_name"]').attr(
                'content',
            )
            const twitterCard = $('meta[name="twitter:card"]').attr('content')
            const robots = $('meta[name="robots"]').attr('content')

            return {
                imageUrl:
                    ogImage || twitterImage ,
                name: ogTitle || $('title').text() || null,
                description:
                   ogDescription ||
                    $('meta[name="description"]').attr('content') ||
                    null,
                keywords: keywords
                    ? keywords.split(',').map((kw) => kw.trim())
                    : [],
                canonicalUrl: canonicalUrl || null,
                favicon: faviconUrl,
                ogUrl: ogUrl || null,
                ogType: ogType || null,
                ogSiteName: ogSiteName || null,
                twitterCard: twitterCard || null,
                twitterImage: twitterImage || null,
                robots: robots || null,
            }
        } catch (error) {
            console.error(`Failed to fetch metadata for ${url}:`, error)
            return {
                imageUrl: null,
                name: url,
                description: 'Failed to fetch metadata',
                keywords: [],
                canonicalUrl: url,
                favicon: null,
                ogUrl: url,
                ogType: null,
                ogSiteName: null,
                twitterCard: null,
                twitterImage: null,
                robots: null,
            }
        }
    },
    ['url-metadata'], // 캐시 키
    { revalidate: 24 * HOUR }, // TTL (24시간)
)
