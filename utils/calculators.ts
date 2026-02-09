import { NON_ELIGIBLE_VISAS, TAX_RATES, TaxYear } from '../constants/taxRates';

// Countries eligible for Lump-sum Refund (E-9/E-7 typical) based on reciprocity
// This is a simplified list for the MVP.
export const ELIGIBLE_FOR_REFUND = [
  'PH', // Philippines
  'TH', // Thailand
  'ID', // Indonesia
  'LK', // Sri Lanka
  'VN', // Vietnam
  'MN', // Mongolia
  'UZ', // Uzbekistan
  'KH', // Cambodia
  'NP', // Nepal (Often subject to specific conditions, but including for demo as 'eligible' or we can exclude if user wants strict)
  'MM', // Myanmar
  'BD', // Bangladesh
  'PK', // Pakistan
  'CN', // China (Conditions apply, but often eligible for E-9)
];

const zeroResult = (gross: number) => ({
  netPay: gross,
  totalDeduction: 0,
  details: { pension: 0, health: 0, care: 0, employment: 0, tax: 0, localTax: 0 }
});

export type PensionResult = {
  isEligible: boolean;
  totalAmount: number;
  monthlyPremium: number;
};

/**
 * Calculates the National Pension amount and refund eligibility.
 * Applies the monthly income cap and floor.
 * Formula: (Income * 9%) * Months
 */
export const calculatePension = (
  visaType: string,
  monthlyIncome: number,
  months: number,
  nationality: string, // ISO code e.g., 'PH'
  year: TaxYear = '2024'
): PensionResult => {
  // 1. Check Visa Eligibility (E-9 is generally eligible to pay, but refund depends on country)
  if (NON_ELIGIBLE_VISAS.includes(visaType)) {
    return { isEligible: false, totalAmount: 0, monthlyPremium: 0 };
  }

  // 2. Check Nationality Eligibility for Lump-sum Refund
  // If not in the list, they might still pay pension but won't get the lump-sum refund upon departure.
  if (!ELIGIBLE_FOR_REFUND.includes(nationality)) {
    return { isEligible: false, totalAmount: 0, monthlyPremium: 0 };
  }

  const { pension } = TAX_RATES[year];

  // Apply Min/Max limits
  let incomeBase = monthlyIncome;
  if (incomeBase < pension.minIncome) incomeBase = pension.minIncome;
  if (incomeBase > pension.maxIncome) incomeBase = pension.maxIncome;

  // 국민연금: 기준소득월액 * 9% (총액: 사업장 4.5% + 본인 4.5% = 9% 적립됨)
  // The refund is the TOTAL amount paid (9%), not just the employee share.
  // Although technically it includes interest, we simulate the principal here.
  const monthlyPremium = Math.floor(incomeBase * pension.rate);
  const totalAmount = monthlyPremium * months;

  return { isEligible: true, totalAmount, monthlyPremium };
};

/**
 * Calculates Net Pay with proper deductions.
 * Assumes 'nonTaxableIncome' is 200,000 (meal) if not provided.
 * Uses a simplified Earned Income Tax calculation (annualized).
 */
export const calculateNetPay = (grossSalary: number, nonTaxableIncome: number = 200000, dependents: number = 1, year: TaxYear = '2024') => {
  const rates = TAX_RATES[year];
  const taxableIncome = grossSalary - nonTaxableIncome;

  if (taxableIncome <= 0) return zeroResult(grossSalary);

  // 1. National Pension (Capped)
  let pensionBase = taxableIncome;
  if (pensionBase < rates.pension.minIncome) pensionBase = rates.pension.minIncome;
  if (pensionBase > rates.pension.maxIncome) pensionBase = rates.pension.maxIncome;

  const pension = Math.floor(pensionBase * rates.pension.rate * rates.pension.employeeShare / 10) * 10; // 4.5%

  // 2. Health Insurance
  const health = Math.floor(taxableIncome * rates.health.rate * rates.health.employeeShare / 10) * 10; // 3.545%

  // 3. Long-term Care
  const care = Math.floor(health * rates.care.rate / 10) * 10; // 12.95% of health

  // 4. Employment Insurance
  const employment = Math.floor(taxableIncome * rates.employment.employeeRate / 10) * 10; // 0.9%

  // 5. Income Tax (Simplified Annualized Method)
  // Annual Salary approximation (Standard logic: Monthly Taxable * 12)
  const annualSalary = taxableIncome * 12;

  // Step A: Earned Income Deduction
  let deduction = 0;
  // Using 2024 general approximation steps
  if (annualSalary <= 5000000) deduction = annualSalary * 0.7;
  else if (annualSalary <= 15000000) deduction = 3500000 + (annualSalary - 5000000) * 0.4;
  else if (annualSalary <= 45000000) deduction = 7500000 + (annualSalary - 15000000) * 0.15;
  else if (annualSalary <= 100000000) deduction = 12000000 + (annualSalary - 45000000) * 0.05;
  else deduction = 14750000 + (annualSalary - 100000000) * 0.02;

  if (deduction > 20000000) deduction = 20000000; // Cap at 20M

  const earnedIncomeAmount = annualSalary - deduction;

  // Step B: Personal Deduction (Basic 1.5M per person)
  const personalDeduction = dependents * 1500000;

  // Step C: Tax Base
  let taxBase = earnedIncomeAmount - personalDeduction;
  if (taxBase < 0) taxBase = 0;

  // Step D: Calculated Tax (Progressive)
  let calculatedTax = 0;
  for (const bracket of rates.incomeTax) {
    if (taxBase > bracket.limit) continue;
    calculatedTax = taxBase * bracket.rate - bracket.deduction;
    break;
  }
  // Check if logic fell through (should be caught by Infinity bracket, but safety check)
  if (calculatedTax === 0 && taxBase > 14000000 && rates.incomeTax.length > 0) {
    // Re-run for safety or assume covered by loop. 
    // Since last bracket is Infinity, it is covered.
  }

  // Step E: Tax Credit (Simplified)
  let taxCredit = 0;
  if (calculatedTax <= 1300000) taxCredit = calculatedTax * 0.55;
  else taxCredit = 715000 + (calculatedTax - 1300000) * 0.3;

  // Cap credit (Unified limit simplification: 660,000 for >70M, 740,000 for others)
  const creditLimit = annualSalary > 70000000 ? 660000 : 740000;
  if (taxCredit > creditLimit) taxCredit = creditLimit;

  // Monthly Tax (Truncate to 10 won)
  const finalAnnualTax = calculatedTax - taxCredit;
  let monthlyTax = Math.floor(finalAnnualTax / 12 / 10) * 10;
  if (monthlyTax < 0) monthlyTax = 0; // Tax credit can't make tax negative

  // Local Tax (10% of income tax)
  const localTax = Math.floor(monthlyTax * 0.1 / 10) * 10;

  const totalDeduction = pension + health + care + employment + monthlyTax + localTax;
  const netPay = grossSalary - totalDeduction;

  return {
    netPay,
    totalDeduction,
    details: {
      pension,
      health,
      care,
      employment,
      tax: monthlyTax,
      localTax
    }
  };
};