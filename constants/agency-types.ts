export type AgencyCategory =
    | 'immigration'      // 출입국·외국인청/사무소 (Searchable)
    | 'community'        // 주민센터 (Searchable)
    | 'plus'             // 다문화이주민플러스센터 (Static List)
    | 'support';         // 외국인주민지원센터/글로벌센터 (Static List)

export type AgencyInfo = {
    name: string;
    address: string;
    phone: string;
    lat: number;
    lng: number;
    category: AgencyCategory;
    services: string[];
    district: string;
    dong: string;
    nameKo?: string;
    addressKo?: string;
    districtKo?: string;
    dongKo?: string;
    jurisdiction?: string[];
    updatedAt?: string;
};

// Service tags by category for easy reference
export const AGENCY_SERVICES: Record<AgencyCategory, string[]> = {
    immigration: [
        'Foreign Registration',
        'Visa Extension',
        'Residence Permit'
    ],
    community: [
        'Residence Report',
        'Seal Certificate',
        'Civil Petitions'
    ],
    plus: [
        'One-Stop Service',
        'Visa & Employment',
        'Interpretation'
    ],
    support: [
        'Daily Life Support',
        'Legal Counseling',
        'Cultural Programs'
    ]
};
