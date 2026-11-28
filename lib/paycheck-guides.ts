export type PaycheckGuide = {
  state: string;
  slug: string;
  localTax?: string;
  noStateIncomeTax?: boolean;
};

export const paycheckGuides: readonly PaycheckGuide[] = [
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
