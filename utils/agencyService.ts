import immigrationData from '../assets/data/immigration_offices.json';
import { AgencyCategory, AgencyInfo } from '../constants/agency-types';
import { searchAgencies } from './naverSearchService';

/**
 * Helper to extract Si/Gu/Gun from a full Korean address
 */
const extractSiGuGun = (address: string): string[] => {
    if (!address) return [];

    const results: string[] = [];
    const pattern = /([가-힣]+(?:구|시|군))/g;
    const matches = address.match(pattern);

    if (matches) {
        matches.forEach(m => {
            const trimmed = m.trim();
            const broadNames = [
                // Only exclude Provinces (Do) which are too broad for specific assignment
                // Metropolitan cities (Seoul, Busan, etc.) SHOULD be extracted as they are valid keys for matching or fallback
                '경기도', '강원도', '충청북도', '충청남도',
                '전라북도', '전라남도', '경상북도', '경상남도'
                // Removed: '서울특별시', '부산광역시', '대구광역시', '인천광역시', '광주광역시', '대전광역시', '울산광역시', '세종특별자치시', '제주특별자치도'
            ];
            if (!broadNames.includes(trimmed)) {
                results.push(trimmed);
            }
        });
    }

    return results;
};

/**
 * Attempt to infer district from road name
 * This is a heuristic approach for common Seoul roads
 */
const inferDistrictFromAddress = (query: string): string[] => {
    // Common roads and their districts (expandable)
    const roadToDistrict: Record<string, string> = {
        '은천로': '관악구',
        '목동동로': '양천구',
        '강남대로': '강남구',
        '테헤란로': '강남구',
        '삼성로': '강남구'
        // Add more as needed
    };

    for (const [road, district] of Object.entries(roadToDistrict)) {
        if (query.includes(road)) {
            return [district];
        }
    }

    return [];
};

/**
 * Find agencies by address or location query
 * Advanced Hybrid approach with fallback for pure addresses
 */
export const findAgenciesByAddress = async (
    query: string,
    category?: AgencyCategory
): Promise<AgencyInfo[]> => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return [];

    try {
        let results: AgencyInfo[] = [];
        const extractedAreas = new Set<string>();

        // Step 1: Extract districts from query directly
        extractSiGuGun(trimmedQuery).forEach(area => extractedAreas.add(area));

        // Step 2: Try to infer district from road name
        const inferredDistricts = inferDistrictFromAddress(trimmedQuery);
        inferredDistricts.forEach(district => extractedAreas.add(district));

        // Step 3: Try Naver search for additional context
        // Use original query first (broad search to find location)
        let naverResults = await searchAgencies(trimmedQuery);

        if (naverResults.length === 0 && !trimmedQuery.includes('서울') && !trimmedQuery.includes('구') && !trimmedQuery.includes('시')) {
            // Try with Seoul prefix for better context if no results found
            naverResults = await searchAgencies(`서울 ${trimmedQuery}`);
        }

        // Extract areas from Naver results to help with context
        if (naverResults.length > 0) {
            extractSiGuGun(naverResults[0].address).forEach(area => extractedAreas.add(area));
        }

        // Step 4: Match against curated jurisdiction data (Only for Immigration)
        if (category === 'immigration' && extractedAreas.size > 0) {
            const localMatches = immigrationData.filter(office => {
                const jurisdictions = office.jurisdiction || [];

                // Flexible matching:
                // 1. Matches if office is physically located in the area (Address match) -> e.g. "Seoul" finds Seoul Office & Southern Office
                // 2. Matches if office covers the area (Jurisdiction match) -> e.g. "Gwanak-gu" finds Seoul Office
                return Array.from(extractedAreas).some(area =>
                    office.address.includes(area) ||
                    jurisdictions.includes(area) ||
                    jurisdictions.some(j => j.includes(area) || area.includes(j))
                );
            });

            if (localMatches.length > 0) {
                results = localMatches.map(data => ({
                    name: data.name,
                    nameKo: data.name,
                    address: data.address,
                    addressKo: data.address,
                    phone: '1345',
                    lat: 0,
                    lng: 0,
                    category: 'immigration' as AgencyCategory,
                    services: ['관할구역 안내', '출입국 업무'],
                    district: Array.from(extractedAreas)[0] || '',
                    dong: '',
                    jurisdiction: data.jurisdiction
                } as AgencyInfo));
            }
        }

        // Step 5: Fallback - Search by category with inferred district if we have an area but no results
        // FIX: Enabled for ALL categories, not just immigration
        if (results.length === 0 && extractedAreas.size > 0) {
            const districtQuery = Array.from(extractedAreas)[0];
            const categoryResults = await searchAgencies(districtQuery, category);

            // Fix: Enforce correct category on fallback results
            const fixedCategoryResults = categoryResults.map(item => ({
                ...item,
                category: category || 'community'
            }));
            naverResults.push(...fixedCategoryResults);
        }

        // Step 6: Merge with Naver results with STRICT filtering
        const finalResults = [...results];
        const seenNames = new Set(finalResults.map(r => r.name));

        // Define keywords for strict filtering to ensure relevance
        const categoryKeywords: Record<string, string[]> = {
            immigration: ['출입국', '외국인', '이민'],
            community: ['주민센터', '행정복지센터', '동사무소', '자치센터'],
            plus: [], // Static list, generally won't use search
            support: [] // Static list, generally won't use search
        };

        // Define negative keywords to exclude (e.g. "EV Charging station" at a community center)
        const negativeKeywords: Record<string, string[]> = {
            community: [
                '전기차', '충전소', '주차장', 'ATM', '365', '무인', '어린이집', '도서관',
                '커피', '카페', '은행', '마트', '편의점', '택배', '식당', '약국', '병원', '의원', '내과', '치과', '부동산', '헤어', '미용실'
            ],
            immigration: ['행정사', '여행사']
        };

        const targetKeywords = category ? categoryKeywords[category] : [];
        const excludeKeywords = category ? negativeKeywords[category] : [];

        for (const item of naverResults) {
            const itemName = item.name.replace(/<[^>]*>/g, '');

            // 1. Suffix Filtering for Community Franchise Branches (e.g. "OOO Community Center Branch")
            // Most government offices end in '센터', '소', '청', never '점'.
            if (category === 'community' && itemName.endsWith('점')) {
                continue;
            }

            // 2. Exclusion Filtering (Blacklist)
            if (excludeKeywords && excludeKeywords.length > 0) {
                const hasNegative = excludeKeywords.some(kw => itemName.includes(kw));
                if (hasNegative) continue; // Skip if it contains negative keywords
            }

            // Strict filtering: If category is selected, item MUST contain at least one keyword
            if (category && targetKeywords && targetKeywords.length > 0) {
                const hasKeyword = targetKeywords.some(kw => itemName.includes(kw));

                if (!hasKeyword) continue; // Skip irrelevant results (e.g. E-mart)

                // If it passes filter, ensure category is displayed correctly
                item.category = category;
            } else if (category) {
                // Even if no specific keywords (unlikely if loop entered), force category
                item.category = category;
            }

            if (!seenNames.has(item.name)) {
                finalResults.push(item);
                seenNames.add(item.name);
            }
        }

        return finalResults;
    } catch (error) {
        console.error('[Agency] findAgenciesByAddress Error:', error);
        return [];
    }
};
