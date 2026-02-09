export interface VisaPolicy {
    code: string;
    name: string;
    description: string;
    category: 'Diplomatic' | 'ShortTerm' | 'Education' | 'Professional' | 'Resident' | 'Overseas' | 'Other';
    maxStay?: string;
    allowedActivities?: string[];
    restrictedActivities?: string[];
    salaryRequirement?: string; // e.g. "GNI * 2"
    notes?: string[];
    requiredDocuments?: {
        personal: string[];
        company: string[];
    };
}

export const VISA_TYPES: Record<string, VisaPolicy> = {
    // A & B: Diplomatic / Exempt
    'A-1': { code: 'A-1', name: '외교 (Diplomatic)', description: 'Diplomatic missions and families', category: 'Diplomatic' },
    'A-2': { code: 'A-2', name: '공무 (Official)', description: 'Official government business', category: 'Diplomatic' },
    'A-3': { code: 'A-3', name: '협정 (Agreements)', description: 'SOFA, etc.', category: 'Diplomatic' },
    'B-1': { code: 'B-1', name: '사증면제 (Visa Exempt)', description: 'Visa waiver agreement nationals', category: 'ShortTerm', maxStay: '90 days' },
    'B-2': { code: 'B-2', name: '관광통과 (Tourist/Transit)', description: 'Tourism or transit', category: 'ShortTerm' },

    // C: Short Term
    'C-1': { code: 'C-1', name: '일시취재 (Temporary News)', description: 'Temporary journalistic activities', category: 'ShortTerm' },
    'C-3': { code: 'C-3', name: '단기방문 (Short Term Visit)', description: 'Tourism, family visit, events', category: 'ShortTerm', maxStay: '90 days' },
    'C-4': { code: 'C-4', name: '단기취업 (Short Term Employment)', description: 'Short term profit activities (lecture, modeling)', category: 'ShortTerm' },

    // D: Education / Investment / Job Seek
    'D-1': { code: 'D-1', name: '문화예술 (Culture/Arts)', description: 'Academic or artistic activities', category: 'Education' },
    'D-2': {
        code: 'D-2',
        name: '유학 (Student)',
        description: 'Degree seeking students (Associate to PhD)',
        category: 'Education',
        allowedActivities: ['Part-time work (with permission)'],
        notes: ['D-2-1 to D-2-4 sub-types exist']
    },
    'D-4': {
        code: 'D-4',
        name: '일반연수 (General Training)',
        description: 'Language training, technical training',
        category: 'Education',
        allowedActivities: ['Part-time work (after 6 months, with permission)']
    },
    'D-7': { code: 'D-7', name: '주재 (Intra-Company Transfer)', description: 'Foreign company assignee', category: 'Professional' },
    'D-8': { code: 'D-8', name: '기업투자 (Corporate Investment)', description: 'FDI corporation investment/management', category: 'Professional' },
    'D-9': { code: 'D-9', name: '무역경영 (Trade Management)', description: 'International trade management', category: 'Professional' },
    'D-10': {
        code: 'D-10',
        name: '구직 (Job Seeker)',
        description: 'Job seeking or internship',
        category: 'Professional',
        maxStay: '6 months per extension',
        notes: ['Can switch to E-7'],
        requiredDocuments: {
            personal: ['여권 사본 (Passport)', '표준규격 사진 1매 (Photo)', '학력증명서 (Degree)', '구직활동계획서 (Job plan)'],
            company: ['해당 없음 (N/A for D-10)']
        }
    },

    // E: Professional
    'E-7-1': {
        code: 'E-7-1',
        name: '전문인력 (Professional)',
        description: '67 designated professional occupations',
        category: 'Professional',
        salaryRequirement: 'approx. 28.67M KRW (2025)',
        notes: ['Includes managers, developers, engineers']
    },
    'E-7-2': { code: 'E-7-2', name: '준전문인력 (Semi-Professional)', description: 'Office & Service (Duty free, Medical coord, Chef)', category: 'Professional', salaryRequirement: 'approx. 25.15M KRW' },
    'E-7-3': { code: 'E-7-3', name: '일반기능인력 (General Skilled)', description: 'Welding, Aircraft mechanism, etc.', category: 'Professional', salaryRequirement: 'approx. 25.15M KRW' },
    'E-7-4': {
        code: 'E-7-4',
        name: '숙련기능인력 (Skilled Worker)',
        description: 'Points-based selection for E-9/H-2 holders',
        category: 'Professional',
        salaryRequirement: '26M KRW+ (Consideration)',
        notes: [
            'K-Point E74: Max 300, Pass 200+',
            'Income (Max 120pt): Avg 2yr income',
            'Korean (Max 80pt): TOPIK 2-4 / KIIP 2-4',
            'Age: 19-26(40), 27-33(60), 34-40(30)',
            'E-7-4R: Regional residence required (Family can work simple labor)',
            'Incentive: Population decrease area (50% hiring ratio)'
        ],
        requiredDocuments: {
            personal: ['여권 및 외국인등록증 (Passport/ARC)', '표준규격 사진 1매', '점수제 입증 서류 (Points proofs)', '한국어능력증명서 (TOPIK 등)'],
            company: ['고용계약서 (Employment contract)', '납세증명서 (Tax cert)', '고용보험 가입자 명단 (Insurance list)']
        }
    },
    'E-9': { code: 'E-9', name: '비전문취업 (Non-Professional)', description: 'EPS workers (Manufacturing, Agriculture, etc.)', category: 'Professional' },

    // F: Resident / Marriage
    'F-1-D': {
        code: 'F-1-D',
        name: '워케이션 (Digital Nomad)',
        description: 'Remote work for overseas employers',
        category: 'Resident',
        salaryRequirement: '88.1M KRW+ (GNI x2)',
        restrictedActivities: ['Local employment prohibited']
    },
    'F-2-7': {
        code: 'F-2-7',
        name: '점수제 우수인재 (Points Resident)',
        description: 'Long-term residency for professionals/students',
        category: 'Resident',
        salaryRequirement: 'GNI linked (Score factor)',
        notes: [
            'Score: Max 120, Pass 80+',
            'Factors: Age(25), Edu(35), Korean(20), Income(10)',
            'K-STAR Track: STEM Master/PhD (KAIST/UNIST) + Recommendation',
            'Income > 40M waives 3yr stay requirement',
            'Risk: Downgrade to D-10 if unemployed/low income'
        ],
        requiredDocuments: {
            personal: ['여권 및 외국인등록증', '학위증명서', '소득금액증명원 (Income cert)', '근로소득원천징수영수증'],
            company: ['사업자등록증명', '고용보험 가입내역']
        }
    },
    'F-4': {
        code: 'F-4',
        name: '재외동포 (Overseas Korean)',
        description: 'Overseas Koreans and direct descendants',
        category: 'Overseas',
        notes: [
            'Simple labor allowed in regional areas (53 jobs)',
            'Simple labor fully allowed from Feb 2026',
            'Documents: Apostille/Consular verification required (FBI Check etc.)'
        ]
    },
    'F-5': {
        code: 'F-5',
        name: '영주 (Permanent Resident)',
        description: 'Permanent residence status',
        category: 'Resident',
        salaryRequirement: 'GNI x1 (~50M) or x2 (~100M)',
        notes: [
            'GNI ~49.95M KRW (2025)',
            'F-5-1 (Generic 5yr): GNI x2',
            'F-5-10 (STEM Bachelor/Master): GNI x1',
            'F-5-16 (F-2-7 3yr): GNI x2'
        ]
    },
    'F-6': {
        code: 'F-6',
        name: '결혼이민 (Marriage Migrant)',
        description: 'Spouse of Korean national',
        category: 'Resident',
        salaryRequirement: '23.6M (2p) - 36.6M (4p) KRW',
        allowedActivities: ['Full employment rights'],
        notes: [
            'Income: 30.1M (3p), 36.6M (4p) (2025)',
            'Exemptions for children (Income/Korean waived)',
            'Korean: TOPIK 1+ or Sejong Basic',
            'Assets (5%) can be converted to income'
        ]
    },

    // H: Visit Work
    'H-2': { code: 'H-2', name: '방문취업 (Work and Visit)', description: 'Work and visit for ethnic Koreans', category: 'Overseas' },

    // Specials
    'K-CULTURE': {
        code: 'K-CULTURE',
        name: 'K-컬처 연수 (Hallyu Visa)',
        description: 'Training in K-pop/culture academies',
        category: 'Education',
        notes: ['Requires agency/academy acceptance']
    }
};

export const FEES = {
    issuance: {
        single_short: { usd: 40, desc: '90 days or less' },
        single_long: { usd: 60, desc: '91 days or more' },
        double: { usd: 70, desc: '2 entries' },
        multiple: { usd: 90, desc: 'Multiple entries' },
        us_citizen_fixed: { usd: 45, desc: 'Reciprocity for US Citizens' }
    },
    domestic: {
        change_status: { krw: 100000, desc: 'Change of status' },
        extension: { krw: 60000, desc: 'Extension of stay' },
        alien_card: { krw: 30000, desc: 'ARC Issuance' },
        part_time_permit: { krw: 120000, desc: 'Time-restricted employment permit' } // Check verify, usually cheaper/free for students? Report says 120k for "Activity other than status"
    }
};

export const RESOURCES = {
    hikorea: 'https://www.hikorea.go.kr',
    visa_portal: 'https://www.visa.go.kr',
    call_center: '1345'
};
