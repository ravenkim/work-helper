import * as cheerio from 'cheerio';
import { HOUR } from '@/shared/constants/time'

export async function getUrlMetadata(url: string) {
    try {
        const response = await fetch(url, {
            next: { revalidate: 24 * HOUR },
        });
        const html = await response.text();

        const $ = cheerio.load(html);

        const ogImage = $('meta[property="og:image"]').attr('content');
        const ogTitle = $('meta[property="og:title"]').attr('content');
        const ogDescription = $('meta[property="og:description"]').attr('content');

        const keywords = $('meta[name="keywords"]').attr('content');
        const canonicalUrl = $('link[rel="canonical"]').attr('href');
        const favicon = $('link[rel="icon"]').attr('href') || $('link[rel="shortcut icon"]').attr('href');
        const ogUrl = $('meta[property="og:url"]').attr('content');
        const ogType = $('meta[property="og:type"]').attr('content');
        const ogSiteName = $('meta[property="og:site_name"]').attr('content');
        const twitterCard = $('meta[name="twitter:card"]').attr('content');
        const twitterImage = $('meta[name="twitter:image"]').attr('content');
        const robots = $('meta[name="robots"]').attr('content');

        return {
            imageUrl: ogImage || twitterImage || null,
            name: ogTitle || $('title').text() || null,
            description: ogDescription || $('meta[name="description"]').attr('content') || null,
            keywords: keywords ? keywords.split(',').map(kw => kw.trim()) : [],
            canonicalUrl: canonicalUrl || null,
            favicon: favicon ? (new URL(favicon, url)).href : null,
            ogUrl: ogUrl || null,
            ogType: ogType || null,
            ogSiteName: ogSiteName || null,
            twitterCard: twitterCard || null,
            twitterImage: twitterImage || null,
            robots: robots || null,
        };
    } catch (error) {
        console.error(`Failed to fetch metadata for ${url}:`, error);
        return {
            imageUrl: null,
            name: null,
            description: null,
            keywords: [],
            canonicalUrl: null,
            favicon: null,
            ogUrl: null,
            ogType: null,
            ogSiteName: null,
            twitterCard: null,
            twitterImage: null,
            robots: null,
        };
    }
}