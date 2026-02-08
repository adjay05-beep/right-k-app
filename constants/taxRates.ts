export type TaxYear = '2024';

interface TaxBrackets {
    limit: number;
    rate: number;
    deduction: number;
}

export const TAX_RATES = {
    '2024': {
        pension: {
            rate: 0.09, // Total 9%
            employeeShare: 0.5, // 4.5%
            employerShare: 0.5, // 4.5%
            minIncome: 370000,
            maxIncome: 6170000, // From July 2024
        },
        health: {
            rate: 0.0709, // Total 7.09%
            employeeShare: 0.5, // 3.545%
        },
        care: {
            rate: 0.1295, // 12.95% of Health Insurance
        },
        employment: {
            employeeRate: 0.009, // 0.9%
        },
        incomeTax: [
            { limit: 14000000, rate: 0.06, deduction: 0 },
            { limit: 50000000, rate: 0.15, deduction: 1260000 },
            { limit: 88000000, rate: 0.24, deduction: 5760000 },
            { limit: 150000000, rate: 0.35, deduction: 15440000 },
            { limit: 300000000, rate: 0.38, deduction: 19940000 },
            { limit: 500000000, rate: 0.40, deduction: 25940000 },
            { limit: 1000000000, rate: 0.42, deduction: 35940000 },
            { limit: Infinity, rate: 0.45, deduction: 65940000 },
        ] as TaxBrackets[],
        // Simplified deduction for earned income (General approximation)
        incomeDeduction: [
            { limit: 5000000, rate: 0.7, deduction: 0 },
            { limit: 15000000, rate: 0.4, deduction: 3500000 },
            { limit: 45000000, rate: 0.15, deduction: 7500000 },
            { limit: 100000000, rate: 0.05, deduction: 12000000 },
            { limit: Infinity, rate: 0.02, deduction: 14750000 },
        ],
    },
};

export const NON_ELIGIBLE_VISAS = ['D-2', 'D-4', 'G-1', 'H-1']; // Expanded list
