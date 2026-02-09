export interface NewsItem {
    title: string;
    link: string;
    pubDate: string;
    source: string;
}

// Search for: "Foreigner Policy" OR "Visa" OR "Immigration Law" OR "Ministry of Justice"
const BASE_RSS_URL = "https://news.google.com/rss/search";

export const fetchNews = async (customQuery?: string): Promise<NewsItem[]> => {
    try {
        // Calculate date for 1 year ago (after:YYYY-MM-DD)
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        const dateString = oneYearAgo.toISOString().split('T')[0];

        const query = (customQuery || "한국 외국인 정책 비자 출입국관리법 이민청") + ` after:${dateString}`;

        // Build the base Google News RSS URL
        const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=ko&gl=KR&ceid=KR:ko`;

        // REVERT: Use rss2json.com (stable free tier, 10 items limit)
        const api_url = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

        const response = await fetch(api_url);
        const data = await response.json();

        if (!data || data.status !== 'ok') {
            throw new Error('RSS2JSON failed');
        }

        return data.items.map((item: any) => ({
            title: item.title,
            link: item.link,
            pubDate: (item.pubDate || "").split(' ')[0], // Format: YYYY-MM-DD
            source: "Google News"
        }));
    } catch (error) {
        console.error("News Fetch Error:", error);
        return [];
    }
};
