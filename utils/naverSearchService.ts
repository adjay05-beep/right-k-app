import { Platform } from 'react-native';
import { AgencyInfo } from '../constants/agency-types';

const NAVER_CLIENT_ID = process.env.EXPO_PUBLIC_NAVER_CLIENT_ID;
const NAVER_CLIENT_SECRET = process.env.EXPO_PUBLIC_NAVER_CLIENT_SECRET;

const NAVER_SEARCH_API_URL = 'https://openapi.naver.com/v1/search/local.json';

export const searchAgencies = async (query: string, category?: string): Promise<AgencyInfo[]> => {
    try {
        let searchQuery = query;

        // For immigration, search broadly to find nearby offices
        if (category === 'immigration') {
            searchQuery = `${query} 출입국`;
        } else if (category && category !== 'all') {
            const keywords: Record<string, string> = {
                community: '주민센터',
                global: '글로벌센터',
                multicultural: '가족센터',
                worker: '외국인노동자지원센터'
            };
            if (keywords[category]) searchQuery = `${query} ${keywords[category]}`;
        }

        let data;

        if (Platform.OS === 'web') {
            const url = `/api/search?query=${encodeURIComponent(searchQuery)}&display=10&sort=comment`;

            console.log(`[Client] Fetching: ${url}`);

            const response = await fetch(url);

            if (!response.ok) {
                console.warn(`[Client] API error: ${response.status} ${response.statusText}`);
                return [];
            }

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                console.error('[Client] Non-JSON response:', text.substring(0, 100));
                return [];
            }

            data = await response.json();
            console.log(`[Client] Received ${data.items?.length || 0} items from proxy`);
        } else {
            if (!NAVER_CLIENT_ID || !NAVER_CLIENT_SECRET) {
                console.warn('Naver API keys missing');
                return [];
            }

            const response = await fetch(`${NAVER_SEARCH_API_URL}?query=${encodeURIComponent(searchQuery)}&display=10&start=1&sort=comment`, {
                headers: {
                    'X-Naver-Client-Id': NAVER_CLIENT_ID,
                    'X-Naver-Client-Secret': NAVER_CLIENT_SECRET
                }
            });

            if (!response.ok) return [];
            data = await response.json();
        }

        if (!data || !data.items || data.items.length === 0) {
            console.warn(`[Client] No results for query: ${searchQuery}`);
            return [];
        }

        // Category-specific keywords for filtering
        const categoryKeywords: Record<string, string[]> = {
            immigration: ['출입국', '외국인사무소', '외국인청'],
            community: ['주민센터', '행정복지센터', '동사무소'],
            global: ['글로벌센터', '외국인센터'],
            multicultural: ['가족센터', '다문화가족지원센터'],
            worker: ['외국인노동자', '외국인근로자', '이주노동자']
        };

        const results = data.items
            .filter((item: any) => {
                // If no category specified, return all
                if (!category || category === 'all') return true;

                const itemName = item.title.replace(/<[^>]*>/g, '').trim();
                const keywords = categoryKeywords[category] || [];

                // Check if the item name contains any of the category keywords
                return keywords.some(keyword => itemName.includes(keyword));
            })
            .map((item: any) => ({
                name: item.title.replace(/<[^>]*>/g, '').trim(),
                address: item.roadAddress || item.address,
                phone: item.telephone || '',
                lat: 0,
                lng: 0,
                category: category || 'community',
                services: [],
                nameKo: item.title.replace(/<[^>]*>/g, '').trim(),
                addressKo: item.roadAddress || item.address
            }));

        console.log(`[Client] Filtered to ${results.length} results (from ${data.items.length} total) for category: ${category}`);
        return results;

    } catch (error) {
        console.error('[Client] searchAgencies Error:', error);
        return [];
    }
};
