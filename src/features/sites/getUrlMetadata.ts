import * as cheerio from 'cheerio';

export async function getUrlMetadata(url: string) {
    try {
        const response = await fetch(url);
        const html = await response.text();

        const $ = cheerio.load(html);

        const ogImage = $('meta[property="og:image"]').attr('content');
        const ogTitle = $('meta[property="og:title"]').attr('content');
        const ogDescription = $('meta[property="og:description"]').attr('content');

        // --- 추가된 메타데이터 파싱 ---
        const keywords = $('meta[name="keywords"]').attr('content');
        const canonicalUrl = $('link[rel="canonical"]').attr('href');
        const favicon = $('link[rel="icon"]').attr('href') || $('link[rel="shortcut icon"]').attr('href');
        const ogUrl = $('meta[property="og:url"]').attr('content');
        const ogType = $('meta[property="og:type"]').attr('content');
        const ogSiteName = $('meta[property="og:site_name"]').attr('content');
        const twitterCard = $('meta[name="twitter:card"]').attr('content');
        const twitterImage = $('meta[name="twitter:image"]').attr('content');
        const robots = $('meta[name="robots"]').attr('content');
        // --- 여기까지 ---

        return {
            imageUrl: ogImage || twitterImage || null, // 트위터 이미지도 폴백으로 사용
            name: ogTitle || $('title').text() || null,
            description: ogDescription || $('meta[name="description"]').attr('content') || null,
            // --- 추가된 반환 값 ---
            keywords: keywords ? keywords.split(',').map(kw => kw.trim()) : [],
            canonicalUrl: canonicalUrl || null,
            favicon: favicon ? (new URL(favicon, url)).href : null, // 상대 경로를 절대 경로로 변환
            ogUrl: ogUrl || null,
            ogType: ogType || null,
            ogSiteName: ogSiteName || null,
            twitterCard: twitterCard || null,
            twitterImage: twitterImage || null,
            robots: robots || null,
            // --- 여기까지 ---
        };
    } catch (error) {
        console.error(`Failed to fetch metadata for ${url}:`, error);
        return {
            imageUrl: null,
            name: null,
            description: null,
            // 에러 발생 시 추가된 필드들도 null로 반환
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