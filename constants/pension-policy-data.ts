export interface PensionCountry {
    code: string;
    name: string;
    status: 'eligible' | 'ineligible' | 'conditional';
    condition?: string; // e.g. "Over 1 year contribution"
    agreement?: boolean; // True if via Social Security Agreement
}

export const PENSION_COUNTRIES: PensionCountry[] = [
    // Agreement Countries (Refund Possible)
    { code: 'US', name: 'United States', status: 'eligible', agreement: true },
    { code: 'DE', name: 'Germany', status: 'eligible', agreement: true },
    { code: 'CA', name: 'Canada', status: 'eligible', agreement: true },
    { code: 'FR', name: 'France', status: 'eligible', agreement: true },
    { code: 'HU', name: 'Hungary', status: 'eligible', agreement: true },
    { code: 'AU', name: 'Australia', status: 'eligible', agreement: true },
    { code: 'IN', name: 'India', status: 'eligible', agreement: true },
    { code: 'TR', name: 'Turkey', status: 'eligible', agreement: true },
    { code: 'PH', name: 'Philippines', status: 'eligible' }, // Reciprocity (Usually assumed eligible for E-9s)
    { code: 'LK', name: 'Sri Lanka', status: 'eligible' }, // Reciprocity

    // Reciprocity Countries
    { code: 'HK', name: 'Hong Kong', status: 'eligible' },
    { code: 'ID', name: 'Indonesia', status: 'eligible' },
    { code: 'KZ', name: 'Kazakhstan', status: 'eligible' },

    // Conditional
    { code: 'TH', name: 'Thailand', status: 'conditional', condition: '> 1 year of contribution' },
    { code: 'ZW', name: 'Zimbabwe', status: 'conditional', condition: '> 1 year of contribution' },

    // Excluded (Agreement but no refund - Aggregation only or specifically excluded)
    { code: 'GB', name: 'United Kingdom', status: 'ineligible' },
    { code: 'JP', name: 'Japan', status: 'ineligible' },
    { code: 'CN', name: 'China', status: 'ineligible' },
    { code: 'UZ', name: 'Uzbekistan', status: 'ineligible' },
    { code: 'IE', name: 'Ireland', status: 'ineligible' },
    { code: 'DK', name: 'Denmark', status: 'ineligible' },
    { code: 'ES', name: 'Spain', status: 'ineligible' },
    { code: 'VN', name: 'Vietnam', status: 'ineligible' }, // Generally ineligible unless E-9 (Special Law covers E-9)
    { code: 'MN', name: 'Mongolia', status: 'ineligible' }, // Generally ineligible unless E-9
    { code: 'KH', name: 'Cambodia', status: 'ineligible' }, // Generally ineligible unless E-9
    { code: 'NP', name: 'Nepal', status: 'ineligible' }, // Generally ineligible unless E-9
    { code: 'MM', name: 'Myanmar', status: 'ineligible' }, // Generally ineligible unless E-9
    { code: 'BD', name: 'Bangladesh', status: 'ineligible' }, // Generally ineligible unless E-9
    { code: 'PK', name: 'Pakistan', status: 'ineligible' }, // Generally ineligible unless E-9
];

export const SPECIAL_VISA_ELIGIBILITY = ['E-8', 'E-9', 'H-2'];

export const PENSION_RATES = {
    contributionRate: 0.09, // 9% total (4.5% Employee + 4.5% Employer)
    interestRate2024: 0.030, // 3.0%
    interestRate2025: 0.026, // 2.6%
    futureRate: 0.025, // Estimate
};

export const PENSION_PROCEDURES = [
    {
        title: 'steps.preparation',
        items: [
            'steps.prep_item_1',
            'steps.prep_item_2',
            'steps.prep_item_3'
        ]
    },
    {
        title: 'steps.airport_claim',
        items: [
            'steps.airport_item_1',
            'steps.airport_item_2',
            'steps.airport_item_3',
            'steps.airport_item_4'
        ]
    },
    {
        title: 'steps.overseas_claim',
        items: [
            'steps.overseas_item_1',
            'steps.overseas_item_2',
            'steps.overseas_item_3'
        ]
    }
];
