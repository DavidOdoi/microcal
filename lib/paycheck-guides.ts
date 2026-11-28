export type PaycheckGuide = {
  state: string;
  slug: string;
  localTax?: string;
  noStateIncomeTax?: boolean;
};

export const paycheckGuides: readonly PaycheckGuide[] = [
  { state: 'Colorado', slug: 'colorado-paycheck-calculator', localTax: 'Occupational privilege tax' },
  { state: 'Arkansas', slug: 'arkansas-paycheck-calculator' },
  { state: 'Arizona', slug: 'arizona-paycheck-calculator' },
  { state: 'Alaska', slug: 'alaska-paycheck-calculator', noStateIncomeTax: true },
  { state: 'Alabama', slug: 'alabama-paycheck-calculator', localTax: 'Local occupational tax' },
  { state: 'Georgia', slug: 'georgia-paycheck-calculator' },
  { state: 'Michigan', slug: 'michigan-paycheck-calculator', localTax: 'Local income tax' },
  { state: 'New Jersey', slug: 'new-jersey-paycheck-calculator' },
  { state: 'Ohio', slug: 'ohio-paycheck-calculator', localTax: 'Municipal and school district income tax' },
  { state: 'Kentucky', slug: 'kentucky-paycheck-calculator', localTax: 'Local occupational tax' },
  { state: 'Kansas', slug: 'kansas-paycheck-calculator' },
  { state: 'Iowa', slug: 'iowa-paycheck-calculator' },
  { state: 'Indiana', slug: 'indiana-paycheck-calculator', localTax: 'Indiana county income tax' },
];

export function paycheckGuideDescription(guide: PaycheckGuide) {
  const taxes = guide.noStateIncomeTax ? 'federal withholding' : `federal and ${guide.state} withholding`;
  return `Estimate 2026 ${guide.state} take-home pay using ${taxes} from your paystub and estimated Social Security and Medicare.`;
}
