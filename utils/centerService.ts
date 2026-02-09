export type CenterInfo = {
    name: string;
    address: string;
    phone: string;
    lat: number;
    lng: number;
    services: string[];
    district: string; // 구 name for better matching
    dong: string; // 동 name for better matching
};

// Mock Database of Community Service Centers (Jumin Centers)
// Expanded Seoul areas for better coverage
const CENTER_DB: CenterInfo[] = [
    // Gangnam-gu
    {
        name: 'Yeoksam 1-dong Community Service Center',
        address: 'Yeoksam-ro 7-gil 16, Gangnam-gu, Seoul',
        phone: '02-3423-6500',
        lat: 37.4954,
        lng: 127.0333,
        services: ['Residence Report', 'Seal Certificate', 'Welfare Consultation'],
        district: 'Gangnam-gu',
        dong: 'Yeoksam-dong'
    },
    {
        name: 'Nonhyeon 1-dong Community Service Center',
        address: 'Hakdong-ro 20-gil 14, Gangnam-gu, Seoul',
        phone: '02-3423-6400',
        lat: 37.5113,
        lng: 127.0287,
        services: ['Residence Report', 'Large Waste Disposal', 'Civil Complaints'],
        district: 'Gangnam-gu',
        dong: 'Nonhyeon-dong'
    },
    // Yongsan-gu
    {
        name: 'Itaewon 1-dong Community Service Center',
        address: 'Itaewon-ro 7-gil 19, Yongsan-gu, Seoul',
        phone: '02-2199-8260',
        lat: 37.5342,
        lng: 126.9933,
        services: ['Foreigner Registration', 'Multicultural Support', 'Interpretation'],
        district: 'Yongsan-gu',
        dong: 'Itaewon-dong'
    },
    {
        name: 'Hannam-dong Community Service Center',
        address: 'Daesaguan-ro 5-gil 1, Yongsan-gu, Seoul',
        phone: '02-2199-8320',
        lat: 37.5336,
        lng: 127.0069,
        services: ['Residence Report', 'General Affairs'],
        district: 'Yongsan-gu',
        dong: 'Hannam-dong'
    },
    // Mapo-gu
    {
        name: 'Seogyo-dong Community Service Center',
        address: 'Donggyo-ro 15-gil 7, Mapo-gu, Seoul',
        phone: '02-3153-6740',
        lat: 37.5552,
        lng: 126.9189,
        services: ['Residence Report', 'Youth Center', 'Library'],
        district: 'Mapo-gu',
        dong: 'Seogyo-dong'
    },
    {
        name: 'Yeonnam-dong Community Service Center',
        address: 'Yeonhui-ro 15-gil 20, Mapo-gu, Seoul',
        phone: '02-3153-9600',
        lat: 37.5603,
        lng: 126.9251,
        services: ['Residence Report', 'Civil Complaints'],
        district: 'Mapo-gu',
        dong: 'Yeonnam-dong'
    },
    // Guro-gu (Large Chinese community)
    {
        name: 'Guro 2-dong Community Service Center',
        address: 'Gurodong-ro 42-gil 12, Guro-gu, Seoul',
        phone: '02-2620-7200',
        lat: 37.4938,
        lng: 126.8837,
        services: ['Foreigner Support', 'Labor Consultation', 'Residence Report'],
        district: 'Guro-gu',
        dong: 'Guro-dong'
    },
    // Yeongdeungpo-gu
    {
        name: 'Daerim 1-dong Community Service Center',
        address: 'Daerim-ro 17-gil 26, Yeongdeungpo-gu, Seoul',
        phone: '02-2670-3660',
        lat: 37.4965,
        lng: 126.8997,
        services: ['Foreigner Registration', 'Multicultural Family Support', 'Interpretation'],
        district: 'Yeongdeungpo-gu',
        dong: 'Daerim-dong'
    },
    // Eunpyeong-gu
    {
        name: 'Eunpyeong-gu Office Community Service Center',
        address: 'Eunpyeong-ro 195, Eunpyeong-gu, Seoul',
        phone: '02-351-5000',
        lat: 37.6176,
        lng: 126.9227,
        services: ['Residence Report', 'Seal Certificate', 'General Affairs'],
        district: 'Eunpyeong-gu',
        dong: 'Euncheon-dong'
    },
    {
        name: 'Jingwan-dong Community Service Center',
        address: 'Jingwan 1-ro 25, Eunpyeong-gu, Seoul',
        phone: '02-351-7800',
        lat: 37.6109,
        lng: 126.9125,
        services: ['Residence Report', 'Welfare Consultation'],
        district: 'Eunpyeong-gu',
        dong: 'Jingwan-dong'
    },
    // Songpa-gu
    {
        name: 'Jamsil 2-dong Community Service Center',
        address: 'Olympic-ro 35-gil 10, Songpa-gu, Seoul',
        phone: '02-2147-3900',
        lat: 37.5136,
        lng: 127.0858,
        services: ['Residence Report', 'Civil Complaints'],
        district: 'Songpa-gu',
        dong: 'Jamsil-dong'
    },
    // Seocho-gu
    {
        name: 'Seocho 1-dong Community Service Center',
        address: 'Hyoryeong-ro 55-gil 30, Seocho-gu, Seoul',
        phone: '02-2155-6800',
        lat: 37.4833,
        lng: 127.0144,
        services: ['Residence Report', 'Seal Certificate'],
        district: 'Seocho-gu',
        dong: 'Seocho-dong'
    }
];

// Extract district and dong from search query
const extractLocation = (query: string): { district?: string, dong?: string, keywords: string[] } => {
    const normalizedQuery = query.toLowerCase().trim();

    // Common district patterns (구)
    const districtMatch = normalizedQuery.match(/([\w가-힣-]+)구/);
    const district = districtMatch ? districtMatch[1] + '-gu' : undefined;

    // Common dong patterns (동)
    const dongMatch = normalizedQuery.match(/([\w가-힣-]+)동/);
    const dong = dongMatch ? dongMatch[1] + '-dong' : undefined;

    // Extract other keywords (remove 구/동 and common words)
    const keywords = normalizedQuery
        .replace(/([\w가-힣-]+)(구|동)/g, '')
        .split(/[\s,]+/)
        .filter(w => w.length > 1);

    return { district, dong, keywords };
};

// Calculate relevance score
const calculateRelevance = (center: CenterInfo, query: string, location: ReturnType<typeof extractLocation>): number => {
    let score = 0;
    const lowerQuery = query.toLowerCase();

    // Exact district match - highest priority
    if (location.district && center.district.toLowerCase().includes(location.district.toLowerCase())) {
        score += 100;
    }

    // Exact dong match
    if (location.dong && center.dong.toLowerCase().includes(location.dong.toLowerCase())) {
        score += 50;
    }

    // Address contains query
    if (center.address.toLowerCase().includes(lowerQuery)) {
        score += 30;
    }

    // Name contains query
    if (center.name.toLowerCase().includes(lowerQuery)) {
        score += 20;
    }

    // Keyword matches
    location.keywords.forEach(keyword => {
        if (center.address.toLowerCase().includes(keyword) ||
            center.name.toLowerCase().includes(keyword)) {
            score += 10;
        }
    });

    return score;
};

export const findCentersByAddress = async (query: string): Promise<CenterInfo[]> => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return [];

    const location = extractLocation(trimmedQuery);

    // Calculate relevance scores for all centers
    const scoredCenters = CENTER_DB.map(center => ({
        center,
        score: calculateRelevance(center, trimmedQuery, location)
    }));

    // Filter centers with score > 0 and sort by score (descending)
    const results = scoredCenters
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .map(({ center }) => center);

    // If no results with scoring, try simple substring match as fallback
    if (results.length === 0) {
        const lowerQuery = trimmedQuery.toLowerCase();
        return CENTER_DB.filter(center =>
            center.name.toLowerCase().includes(lowerQuery) ||
            center.address.toLowerCase().includes(lowerQuery)
        );
    }

    return results;
};
