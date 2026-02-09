export type AgencyCategory =
    | 'immigration'      // 출입국·외국인청/사무소
    | 'community'        // 주민센터
    | 'global'           // 글로벌센터
    | 'multicultural'    // 가족센터 (다문화가족지원센터)
    | 'worker';          // 외국인노동자지원센터

export type AgencyInfo = {
    name: string;
    address: string;
    phone: string;
    lat: number;
    lng: number;
    category: AgencyCategory;
    services: string[];
    district: string; // 구 name for better matching
    dong: string; // 동 name for better matching
    nameKo?: string;
    addressKo?: string;
    districtKo?: string;
    dongKo?: string;
};

// Service tags by category for easy reference
export const AGENCY_SERVICES: Record<AgencyCategory, string[]> = {
    immigration: [
        'Foreign Registration & ARC',
        'Visa Change & Extension',
        'Residence Permit',
        'Immigration Consultation'
    ],
    community: [
        'Residence Report',
        'Seal Certificate',
        'Civil Complaints',
        'Address Change'
    ],
    global: [
        'Multilingual Consultation',
        'Employment Support',
        'Legal Counseling',
        'Startup Support'
    ],
    multicultural: [
        'Korean Language Education',
        'Interpretation Service',
        'Child Development Support',
        'Employment Connection'
    ],
    worker: [
        'Labor Consultation',
        'Living Support',
        'Legal Counseling',
        'Emergency Assistance'
    ]
};
