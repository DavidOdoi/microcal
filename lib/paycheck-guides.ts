export type PaycheckGuide = {
  state: string;
  slug: string;
  localTax?: string;
  combinedStateAndLocal?: boolean;
  noStateIncomeTax?: boolean;
  relatedStates?: readonly string[];
};

export const paycheckGuides: readonly PaycheckGuide[] = [
  { state: 'Oklahoma', slug: 'oklahoma-paycheck-calculator', relatedStates: ['arkansas-paycheck-calculator', 'kansas-paycheck-calculator'] },
  { state: 'North Carolina', slug: 'north-carolina-paycheck-calculator' },
  { state: 'New Mexico', slug: 'new-mexico-paycheck-calculator' },
  { state: 'New Hampshire', slug: 'new-hampshire-paycheck-calculator', noStateIncomeTax: true },
  { state: 'Nevada', slug: 'nevada-paycheck-calculator', noStateIncomeTax: true },
  { state: 'Nebraska', slug: 'nebraska-paycheck-calculator' },
  { state: 'Montana', slug: 'montana-paycheck-calculator' },
  { state: 'Missouri', slug: 'missouri-paycheck-calculator', localTax: 'Kansas City or St. Louis earnings tax' },
  { state: 'Mississippi', slug: 'mississippi-paycheck-calculator' },
  { state: 'Minnesota', slug: 'minnesota-paycheck-calculator' },
  { state: 'Massachusetts', slug: 'massachusetts-paycheck-calculator' },
  { state: 'Maryland', slug: 'maryland-paycheck-calculator', combinedStateAndLocal: true },
  { state: 'Maine', slug: 'maine-paycheck-calculator' },
  { state: 'Louisiana', slug: 'louisiana-paycheck-calculator' },
  { state: 'Hawaii', slug: 'hawaii-paycheck-calculator' },
  { state: 'Florida', slug: 'florida-paycheck-calculator', noStateIncomeTax: true },
  { state: 'Delaware', slug: 'delaware-paycheck-calculator', localTax: 'Wilmington wage tax' },
  { state: 'Connecticut', slug: 'connecticut-paycheck-calculator' },
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
  const stateTax = guide.combinedStateAndLocal ? `${guide.state} state and local` : guide.state;
  const taxes = guide.noStateIncomeTax ? 'federal withholding' : `federal and ${stateTax} withholding`;
  return `Estimate 2026 ${guide.state} take-home pay using ${taxes} from your paystub and estimated Social Security and Medicare.`;
}
