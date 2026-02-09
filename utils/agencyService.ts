import { AgencyCategory, AgencyInfo } from '../constants/agency-types';
import { searchAgencies } from './naverSearchService';



// Comprehensive database of government agencies for foreigners in Seoul/Gyeonggi
const AGENCY_DB: AgencyInfo[] = [
    // ========== IMMIGRATION OFFICES (출입국·외국인청/사무소) ==========
    {
        name: 'Seoul Immigration Office',
        address: 'Mokdong-dongro 151, Yangcheon-gu, Seoul',
        nameKo: '서울출입국·외국인청',
        addressKo: '서울 양천구 목동동로 151',
        phone: '02-2650-6212',
        lat: 37.5263,
        lng: 126.8755,
        category: 'immigration',
        services: ['Foreign Registration', 'ARC Issuance', 'Visa Extension', 'Status Change'],
        district: 'Yangcheon-gu',
        dong: 'Mokdong',
        districtKo: '양천구',
        dongKo: '목동'
    },
    {
        name: 'Seoul Immigration Office Sejongno Branch',
        address: 'Jongno 38, Jongno-gu, Seoul',
        nameKo: '서울출입국·외국인청 세종로출장소',
        addressKo: '서울 종로구 종로 38',
        phone: '02-2110-4000',
        lat: 37.5720,
        lng: 126.9794,
        category: 'immigration',
        services: ['Foreign Registration', 'Visa Consultation', 'Immigration Counseling'],
        district: 'Jongno-gu',
        dong: 'Sejongno',
        districtKo: '종로구',
        dongKo: '세종로'
    },
    {
        name: 'Seoul Nambu Immigration Office',
        address: 'Magokjungang 1-ro 48, Gangseo-gu, Seoul',
        nameKo: '서울남부출입국·외국인사무소',
        addressKo: '서울 강서구 마곡중앙1로 48',
        phone: '02-2650-6300',
        lat: 37.5621,
        lng: 126.8324,
        category: 'immigration',
        services: ['Foreign Registration', 'Visa Extension', 'Work Permit'],
        district: 'Gangseo-gu',
        dong: 'Magok-dong',
        districtKo: '강서구',
        dongKo: '마곡동'
    },
    {
        name: 'Incheon Immigration Office',
        address: 'Seohaedae-ro 393, Jung-gu, Incheon',
        nameKo: '인천출입국·외국인청',
        addressKo: '인천 중구 서해대로 393',
        phone: '032-890-6300',
        lat: 37.4633,
        lng: 126.6433,
        category: 'immigration',
        services: ['Foreign Registration', 'Airport Services', 'Global Talent Support'],
        district: 'Jung-gu',
        dong: 'Unseo-dong',
        districtKo: '중구',
        dongKo: '운서동'
    },
    {
        name: 'Suwon Immigration Office',
        address: 'Bandal-ro 39, Yeongtong-gu, Suwon',
        nameKo: '수원출입국·외국인청',
        addressKo: '수원 영통구 반달로 39',
        phone: '031-240-3900',
        lat: 37.2478,
        lng: 127.0774,
        category: 'immigration',
        services: ['Foreign Registration', 'Visa Services', 'Immigration Consultation'],
        district: 'Yeongtong-gu',
        dong: 'Yeongtong-dong',
        districtKo: '영통구',
        dongKo: '영통동'
    },
    {
        name: 'Ansan Immigration Office',
        address: 'Jungang-daero 713, Danwon-gu, Ansan',
        nameKo: '안산출입국·외국인사무소',
        addressKo: '안산 단원구 중앙대로 713',
        phone: '031-400-6300',
        lat: 37.3222,
        lng: 126.8230,
        category: 'immigration',
        services: ['Foreign Registration', 'Worker Visa Support', 'Immigration Services'],
        district: 'Danwon-gu',
        dong: 'Gojan-dong',
        districtKo: '단원구',
        dongKo: '고잔동'
    },

    // ========== COMMUNITY CENTERS (주민센터) ==========
    {
        name: 'Yeoksam 1-dong Community Service Center',
        address: 'Yeoksam-ro 7-gil 16, Gangnam-gu, Seoul',
        nameKo: '역삼1동 주민센터',
        addressKo: '서울 강남구 역삼로7길 16',
        phone: '02-3423-6500',
        lat: 37.4954,
        lng: 127.0333,
        category: 'community',
        services: ['Residence Report', 'Seal Certificate', 'Welfare Consultation'],
        district: 'Gangnam-gu',
        dong: 'Yeoksam-dong',
        districtKo: '강남구',
        dongKo: '역삼동'
    },
    {
        name: 'Nonhyeon 1-dong Community Service Center',
        address: 'Hakdong-ro 20-gil 14, Gangnam-gu, Seoul',
        nameKo: '논현1동 주민센터',
        addressKo: '서울 강남구 학동로20길 14',
        phone: '02-3423-6400',
        lat: 37.5113,
        lng: 127.0287,
        category: 'community',
        services: ['Residence Report', 'Large Waste Disposal', 'Civil Complaints'],
        district: 'Gangnam-gu',
        dong: 'Nonhyeon-dong',
        districtKo: '강남구',
        dongKo: '논현동'
    },
    {
        name: 'Itaewon 1-dong Community Service Center',
        address: 'Itaewon-ro 7-gil 19, Yongsan-gu, Seoul',
        nameKo: '이태원1동 주민센터',
        addressKo: '서울 용산구 이태원로7길 19',
        phone: '02-2199-8260',
        lat: 37.5342,
        lng: 126.9933,
        category: 'community',
        services: ['Foreigner Registration', 'Multicultural Support', 'Interpretation'],
        district: 'Yongsan-gu',
        dong: 'Itaewon-dong',
        districtKo: '용산구',
        dongKo: '이태원동'
    },
    {
        name: 'Hannam-dong Community Service Center',
        address: 'Daesaguan-ro 5-gil 1, Yongsan-gu, Seoul',
        nameKo: '한남동 주민센터',
        addressKo: '서울 용산구 대사관로5길 1',
        phone: '02-2199-8320',
        lat: 37.5336,
        lng: 127.0069,
        category: 'community',
        services: ['Residence Report', 'General Affairs'],
        district: 'Yongsan-gu',
        dong: 'Hannam-dong',
        districtKo: '용산구',
        dongKo: '한남동'
    },
    {
        name: 'Seogyo-dong Community Service Center',
        address: 'Donggyo-ro 15-gil 7, Mapo-gu, Seoul',
        nameKo: '서교동 주민센터',
        addressKo: '서울 마포구 동교로15길 7',
        phone: '02-3153-6740',
        lat: 37.5552,
        lng: 126.9189,
        category: 'community',
        services: ['Residence Report', 'Youth Center', 'Library'],
        district: 'Mapo-gu',
        dong: 'Seogyo-dong',
        districtKo: '마포구',
        dongKo: '서교동'
    },
    {
        name: 'Yeonnam-dong Community Service Center',
        address: 'Yeonhui-ro 15-gil 20, Mapo-gu, Seoul',
        nameKo: '연남동 주민센터',
        addressKo: '서울 마포구 연희로15길 20',
        phone: '02-3153-9600',
        lat: 37.5603,
        lng: 126.9251,
        category: 'community',
        services: ['Residence Report', 'Civil Complaints'],
        district: 'Mapo-gu',
        dong: 'Yeonnam-dong',
        districtKo: '마포구',
        dongKo: '연남동'
    },
    {
        name: 'Guro 2-dong Community Service Center',
        address: 'Gurodong-ro 42-gil 12, Guro-gu, Seoul',
        nameKo: '구로2동 주민센터',
        addressKo: '서울 구로구 구로동로42길 12',
        phone: '02-2620-7200',
        lat: 37.4938,
        lng: 126.8837,
        category: 'community',
        services: ['Foreigner Support', 'Labor Consultation', 'Residence Report'],
        district: 'Guro-gu',
        dong: 'Guro-dong',
        districtKo: '구로구',
        dongKo: '구로동'
    },
    {
        name: 'Daerim 1-dong Community Service Center',
        address: 'Daerim-ro 17-gil 26, Yeongdeungpo-gu, Seoul',
        nameKo: '대림1동 주민센터',
        addressKo: '서울 영등포구 대림로17길 26',
        phone: '02-2670-3660',
        lat: 37.4965,
        lng: 126.8997,
        category: 'community',
        services: ['Foreigner Registration', 'Multicultural Family Support', 'Interpretation'],
        district: 'Yeongdeungpo-gu',
        dong: 'Daerim-dong',
        districtKo: '영등포구',
        dongKo: '대림동'
    },
    {
        name: 'Eunpyeong-gu Office Community Service Center',
        address: 'Eunpyeong-ro 195, Eunpyeong-gu, Seoul',
        nameKo: '은평구청',
        addressKo: '서울 은평구 은평로 195',
        phone: '02-351-5000',
        lat: 37.6176,
        lng: 126.9227,
        category: 'community',
        services: ['Residence Report', 'Seal Certificate', 'General Affairs'],
        district: 'Eunpyeong-gu',
        dong: 'Euncheon-dong',
        districtKo: '은평구',
        dongKo: '은천동'
    },
    {
        name: 'Jingwan-dong Community Service Center',
        address: 'Jingwan 1-ro 25, Eunpyeong-gu, Seoul',
        nameKo: '진관동 주민센터',
        addressKo: '서울 은평구 진관1로 25',
        phone: '02-351-7800',
        lat: 37.6109,
        lng: 126.9125,
        category: 'community',
        services: ['Residence Report', 'Welfare Consultation'],
        district: 'Eunpyeong-gu',
        dong: 'Jingwan-dong',
        districtKo: '은평구',
        dongKo: '진관동'
    },
    {
        name: 'Jamsil 2-dong Community Service Center',
        address: 'Olympic-ro 35-gil 10, Songpa-gu, Seoul',
        nameKo: '잠실2동 주민센터',
        addressKo: '서울 송파구 올림픽로35길 10',
        phone: '02-2147-3900',
        lat: 37.5136,
        lng: 127.0858,
        category: 'community',
        services: ['Residence Report', 'Civil Complaints'],
        district: 'Songpa-gu',
        dong: 'Jamsil-dong',
        districtKo: '송파구',
        dongKo: '잠실동'
    },
    {
        name: 'Seocho 1-dong Community Service Center',
        address: 'Hyoryeong-ro 55-gil 30, Seocho-gu, Seoul',
        nameKo: '서초1동 주민센터',
        addressKo: '서울 서초구 효령로55길 30',
        phone: '02-2155-6800',
        lat: 37.4833,
        lng: 127.0144,
        category: 'community',
        services: ['Residence Report', 'Seal Certificate'],
        district: 'Seocho-gu',
        dong: 'Seocho-dong',
        districtKo: '서초구',
        dongKo: '서초동'
    },

    // ========== GLOBAL SUPPORT CENTERS (글로벌센터) ==========
    {
        name: 'Seoul Global Center',
        address: 'Jongno 38, Global Center Building, Jongno-gu, Seoul',
        nameKo: '서울글로벌센터',
        addressKo: '서울 종로구 종로 38',
        phone: '02-2075-4180',
        lat: 37.5720,
        lng: 126.9790,
        category: 'global',
        services: ['Multilingual Consultation', 'Legal Support', 'Employment Support', 'Startup Program'],
        district: 'Jongno-gu',
        dong: 'Cheongjin-dong',
        districtKo: '종로구',
        dongKo: '청진동'
    },
    {
        name: 'Gangnam Global Zone',
        address: 'Gangnam-daero 396, Gangnam-gu, Seoul',
        nameKo: '강남글로벌빌리지센터',
        addressKo: '서울 강남구 강남대로 396',
        phone: '02-3423-5703',
        lat: 37.4979,
        lng: 127.0276,
        category: 'global',
        services: ['Business Consultation', 'Networking Events', 'Cultural Programs'],
        district: 'Gangnam-gu',
        dong: 'Yeoksam-dong',
        districtKo: '강남구',
        dongKo: '역삼동'
    },

    // ========== MULTICULTURAL FAMILY SUPPORT CENTERS (가족센터) ==========
    {
        name: 'Seoul Multicultural Family Support Center',
        address: 'Sinjeong-ro 14-gil 19, Yangcheon-gu, Seoul',
        nameKo: '서울다문화가족지원센터',
        addressKo: '서울 양천구 신정로14길 19',
        phone: '02-2654-0600',
        lat: 37.5141,
        lng: 126.8559,
        category: 'multicultural',
        services: ['Korean Language Class', 'Interpretation', 'Child Education', 'Job Training'],
        district: 'Yangcheon-gu',
        dong: 'Sinjeong-dong',
        districtKo: '양천구',
        dongKo: '신정동'
    },
    {
        name: 'Gangnam Family Center',
        address: 'Bongeunsa-ro 129, Gangnam-gu, Seoul',
        nameKo: '강남구가족센터',
        addressKo: '서울 강남구 봉은사로 129',
        phone: '02-3469-2530',
        lat: 37.5157,
        lng: 127.0525,
        category: 'multicultural',
        services: ['Korean Class', 'Family Counseling', 'Cultural Integration'],
        district: 'Gangnam-gu',
        dong: 'Samseong-dong',
        districtKo: '강남구',
        dongKo: '삼성동'
    },
    {
        name: 'Suwon Family Center',
        address: 'Ingye-ro 140, Paldal-gu, Suwon',
        nameKo: '수원시가족센터',
        addressKo: '수원 팔달구 인계로 140',
        phone: '031-257-8830',
        lat: 37.2787,
        lng: 127.0184,
        category: 'multicultural',
        services: ['Korean Education', 'Marriage Immigrant Support', 'Employment Help'],
        district: 'Paldal-gu',
        dong: 'Ingye-dong',
        districtKo: '팔달구',
        dongKo: '인계동'
    },
    {
        name: 'Ansan Multicultural Family Support Center',
        address: 'Singil-ro 92, Danwon-gu, Ansan',
        nameKo: '안산시다문화가족지원센터',
        addressKo: '안산 단원구 신길로 92',
        phone: '031-599-4901',
        lat: 37.3153,
        lng: 126.7943,
        category: 'multicultural',
        services: ['Interpretation Service', 'Korean Class', 'Child Language Support'],
        district: 'Danwon-gu',
        dong: 'Singil-dong',
        districtKo: '단원구',
        dongKo: '신길동'
    },

    // ========== FOREIGN WORKER SUPPORT CENTERS (외국인노동자지원센터) ==========
    {
        name: 'Seoul Foreign Workers Center',
        address: 'Jangmun-ro 8-gil 3, Yongsan-gu, Seoul',
        nameKo: '서울외국인노동자센터',
        addressKo: '서울 용산구 장문로8길 3',
        phone: '02-795-8550',
        lat: 37.5376,
        lng: 126.9653,
        category: 'worker',
        services: ['Labor Consultation', 'Legal Support', 'Medical Support', 'Korean Class'],
        district: 'Yongsan-gu',
        dong: 'Ichon-dong',
        districtKo: '용산구',
        dongKo: '이촌동'
    },
    {
        name: 'Ansan Foreign Workers Center',
        address: 'Wonsi-ro 570, Danwon-gu, Ansan',
        nameKo: '안산시외국인노동자센터',
        addressKo: '안산 단원구 원시로 570',
        phone: '031-494-4986',
        lat: 37.3135,
        lng: 126.8309,
        category: 'worker',
        services: ['Labor Consultation', 'Living Support', 'Emergency Assistance'],
        district: 'Danwon-gu',
        dong: 'Wonsi-dong',
        districtKo: '단원구',
        dongKo: '원시동'
    },
    {
        name: 'Uijeongbu Foreign Workers Center',
        address: 'Uijeongbu-ro 22, Uijeongbu-si, Gyeonggi',
        nameKo: '의정부외국인노동자지원센터',
        addressKo: '경기 의정부시 의정부로 22',
        phone: '031-873-1691',
        lat: 37.7382,
        lng: 127.0475,
        category: 'worker',
        services: ['Labor Rights', 'Workplace Issues', 'Legal Counseling'],
        district: 'Uijeongbu-si',
        dong: 'Uijeongbu-dong',
        districtKo: '의정부시',
        dongKo: '의정부동'
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
const calculateRelevance = (agency: AgencyInfo, query: string, location: ReturnType<typeof extractLocation>): number => {
    let score = 0;
    const lowerQuery = query.toLowerCase();

    // Exact district match - highest priority
    const districtTerm = location.district?.replace('-gu', '') || '';
    if (location.district && (
        agency.district.toLowerCase().includes(location.district.toLowerCase()) ||
        (agency.districtKo && agency.districtKo.includes(districtTerm))
    )) {
        score += 100;
    }

    // Exact dong match
    const dongTerm = location.dong?.replace('-dong', '') || '';
    if (location.dong && (
        agency.dong.toLowerCase().includes(location.dong.toLowerCase()) ||
        (agency.dongKo && agency.dongKo.includes(dongTerm))
    )) {
        score += 50;
    }

    // Address contains query
    if (agency.address.toLowerCase().includes(lowerQuery) ||
        (agency.addressKo && agency.addressKo.includes(query))) {
        score += 30;
    }

    // Name contains query
    if (agency.name.toLowerCase().includes(lowerQuery) ||
        (agency.nameKo && agency.nameKo.includes(query))) {
        score += 20;
    }

    // Keyword matches
    location.keywords.forEach(keyword => {
        if (agency.address.toLowerCase().includes(keyword) ||
            agency.name.toLowerCase().includes(keyword) ||
            (agency.addressKo && agency.addressKo.includes(keyword)) ||
            (agency.nameKo && agency.nameKo.includes(keyword))) {
            score += 10;
        }
    });

    return score;
};

export const findAgenciesByAddress = async (
    query: string,
    category?: AgencyCategory
): Promise<AgencyInfo[]> => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return [];

    const location = extractLocation(trimmedQuery);

    // Filter by category if specified
    let filteredAgencies = category
        ? AGENCY_DB.filter((a: AgencyInfo) => a.category === category)
        : AGENCY_DB;

    // Calculate relevance scores for all agencies
    const scoredAgencies = filteredAgencies.map((agency: AgencyInfo) => ({
        agency,
        score: calculateRelevance(agency, trimmedQuery, location)
    }));

    // Filter agencies with score > 0 and sort by score (descending)
    const results = scoredAgencies
        .filter(({ score }: { score: number }) => score > 0)
        .sort((a: { score: number }, b: { score: number }) => b.score - a.score)
        .map(({ agency }: { agency: AgencyInfo }) => agency);

    // If no results with scoring, try simple substring match as fallback
    if (results.length === 0) {
        const lowerQuery = trimmedQuery.toLowerCase();
        const fallbackResults = filteredAgencies.filter((agency: AgencyInfo) =>
            agency.name.toLowerCase().includes(lowerQuery) ||
            agency.address.toLowerCase().includes(lowerQuery) ||
            (agency.nameKo && agency.nameKo.includes(trimmedQuery)) ||
            (agency.addressKo && agency.addressKo.includes(trimmedQuery))
        );

        if (fallbackResults.length > 0) {
            return fallbackResults;
        }

        // If still no results, try Naver API
        try {
            console.log('Searching via Naver API for:', trimmedQuery, category);
            // Search 'query' + 'category keyword'
            // We pass just query and category, let the service handle keyword appending
            const apiResults = await searchAgencies(trimmedQuery, category);
            return apiResults;
        } catch (error) {
            console.error('Naver API search failed:', error);
            return [];
        }
    }

    return results;
};

// Get all agencies of a specific category
export const getAgenciesByCategory = (category: AgencyCategory): AgencyInfo[] => {
    return AGENCY_DB.filter((a: AgencyInfo) => a.category === category);
};
