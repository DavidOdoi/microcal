export type PaycheckGuide = {
  state: string;
  slug: string;
  localTax?: string;
  noStateIncomeTax?: boolean;
};

export const paycheckGuides: readonly PaycheckGuide[] = [
  { state: 'Iowa', slug: 'iowa-paycheck-calculator' },
  { state: 'Indiana', slug: 'indiana-paycheck-calculator', localTax: 'Indiana county income tax' },
];

export function paycheckGuideDescription(guide: PaycheckGuide) {
  const taxes = guide.noStateIncomeTax ? 'federal withholding' : `federal and ${guide.state} withholding`;
  return `Estimate 2026 ${guide.state} take-home pay using ${taxes} from your paystub and estimated Social Security and Medicare.`;
}
