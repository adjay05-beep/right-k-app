export interface VisaPolicy {
    code: string;
    category: 'Diplomatic' | 'ShortTerm' | 'Education' | 'Professional' | 'Resident' | 'Overseas' | 'Other';
}

export const VISA_TYPES: Record<string, VisaPolicy> = {
    // A & B: Diplomatic / Exempt
    'A-1': { code: 'A-1', category: 'Diplomatic' },
    'A-2': { code: 'A-2', category: 'Diplomatic' },
    'A-3': { code: 'A-3', category: 'Diplomatic' },
    'B-1': { code: 'B-1', category: 'ShortTerm' },
    'B-2': { code: 'B-2', category: 'ShortTerm' },

    // C: Short Term
    'C-1': { code: 'C-1', category: 'ShortTerm' },
    'C-3': { code: 'C-3', category: 'ShortTerm' },
    'C-4': { code: 'C-4', category: 'ShortTerm' },

    // D: Education / Investment / Job Seek
    'D-1': { code: 'D-1', category: 'Education' },
    'D-2': { code: 'D-2', category: 'Education' },
    'D-4': { code: 'D-4', category: 'Education' },
    'D-7': { code: 'D-7', category: 'Professional' },
    'D-8': { code: 'D-8', category: 'Professional' },
    'D-9': { code: 'D-9', category: 'Professional' },
    'D-10': { code: 'D-10', category: 'Professional' },

    // E: Professional
    'E-7-1': { code: 'E-7-1', category: 'Professional' },
    'E-7-2': { code: 'E-7-2', category: 'Professional' },
    'E-7-3': { code: 'E-7-3', category: 'Professional' },
    'E-7-4': { code: 'E-7-4', category: 'Professional' },
    'E-9': { code: 'E-9', category: 'Professional' },

    // F: Resident / Marriage
    'F-1-D': { code: 'F-1-D', category: 'Resident' },
    'F-2-7': { code: 'F-2-7', category: 'Resident' },
    'F-4': { code: 'F-4', category: 'Overseas' },
    'F-5': { code: 'F-5', category: 'Resident' },
    'F-6': { code: 'F-6', category: 'Resident' },

    // H: Visit Work
    'H-2': { code: 'H-2', category: 'Overseas' },

    // Specials
    'K-CULTURE': { code: 'K-CULTURE', category: 'Education' }
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
