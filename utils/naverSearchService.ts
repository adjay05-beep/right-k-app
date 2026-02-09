import { Platform } from 'react-native';
import { AgencyInfo } from '../constants/agency-types';

const NAVER_CLIENT_ID = process.env.EXPO_PUBLIC_NAVER_CLIENT_ID;
const NAVER_CLIENT_SECRET = process.env.EXPO_PUBLIC_NAVER_CLIENT_SECRET;

const NAVER_SEARCH_API_URL = 'https://openapi.naver.com/v1/search/local.json';

// Map agency categories to Korean search keywords
const CATEGORY_KEYWORDS: Record<string, string> = {
    immigration: '출입국·외국인청',
    community: '주민센터',
    global: '글로벌센터',
    multicultural: '가족센터',
    worker: '외국인노동자지원센터'
};

export const searchAgencies = async (query: string, category?: string): Promise<AgencyInfo[]> => {
    try {
        let searchQuery = query;
        if (category && CATEGORY_KEYWORDS[category]) {
            searchQuery = `${query} ${CATEGORY_KEYWORDS[category]}`;
        }

        let data;

        if (Platform.OS === 'web') {
            // Use internal API proxy on web to avoid CORS
            // Note: In Expo Router, API routes are at /api/...
            // We use relative path for same-origin fetch
            const response = await fetch(`/api/search?query=${encodeURIComponent(searchQuery)}&display=5&sort=random`);
            if (!response.ok) {
                console.error('API Proxy Error:', response.status, response.statusText);
                return [];
            }
            data = await response.json();
        } else {
            // Use direct Naver API call on native (Android/iOS)
            if (!NAVER_CLIENT_ID || !NAVER_CLIENT_SECRET) {
                console.warn('Naver API keys are missing. Please check .env file.');
                return [];
            }

            const response = await fetch(`${NAVER_SEARCH_API_URL}?query=${encodeURIComponent(searchQuery)}&display=5&start=1&sort=random`, {
                method: 'GET',
                headers: {
                    'X-Naver-Client-Id': NAVER_CLIENT_ID,
                    'X-Naver-Client-Secret': NAVER_CLIENT_SECRET
                }
            });

            if (!response.ok) {
                console.error('Naver API Error:', response.status, response.statusText);
                return [];
            }

            data = await response.json();
        }

        if (!data.items) return [];

        return data.items.map((item: any) => ({
            name: item.title.replace(/<[^>]*>/g, ''), // Strip HTML tags like <b>...</b>
            address: item.roadAddress || item.address,
            phone: item.telephone || '',
            lat: 0, // Naver search returns mapx/mapy in KATECH, complex to convert without library
            lng: 0,
            category: category || 'community', // Fallback
            services: [], // API doesn't provide services, we might inject generic ones based on category
            district: '',
            dong: '',
            nameKo: item.title.replace(/<[^>]*>/g, ''),
            addressKo: item.roadAddress || item.address
        }));

    } catch (error) {
        console.error('Naver Search API Error:', error);
        return [];
    }
};
