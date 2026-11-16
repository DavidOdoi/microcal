'use client';
import { calculateSocialSecurity, validateSocialSecurity, type SocialSecurityInput } from '@/lib/social-security-calculations';
import { ScenarioCalculator, scenarioMoney as money, type ScenarioValues, type ScenarioField } from './ScenarioCalculator';
const age = (months: number) => `${Math.floor(months / 12)} years${months % 12 ? ` ${months % 12} months` : ''}`;
const fields: ScenarioField[] = [
  { key: 'birth', label: 'Year of birth', min: 1943, max: 2010, step: '1', value: '1964' },
  { key: 'years', label: 'Claiming age', unit: 'years', min: 62, max: 70, step: '1', value: '67' },
  { key: 'months', label: 'Additional claiming months', unit: 'months', max: 11, step: '1', value: '0' },
  { key: 'mode', label: 'Benefit estimate method', value: 'statement', options: [['statement', 'Full retirement benefit from SSA statement'], ['aime2026', '2026 eligibility formula using AIME']] },
  { key: 'benefit', label: 'Monthly benefit at full retirement age', prefix: '$', max: 100000, value: '2000', help: 'Use your SSA estimate at full retirement age in a consistent dollar basis, not your current salary.' },
  { key: 'aime', label: 'Average indexed monthly earnings (AIME)', prefix: '$', max: 100000, value: '4000', advanced: true, help: 'Used only in 2026 eligibility mode, normally for birth year 1964. Highest 35 years of indexed earnings ÷ 420, rounded down to whole dollars.' },
  { key: 'cola', label: 'One-time COLA assumption', unit: '%', max: 20, value: '0', advanced: true, help: 'Optional scenario adjustment applied once to the benefit, not to bend points. Avoid adding a COLA already included in your statement estimate.' },
];
function parse(v: ScenarioValues): SocialSecurityInput { return { birthYear: +v.birth, claimYears: +v.years, claimMonths: +v.months, mode: v.mode as SocialSecurityInput['mode'], fullBenefit: +v.benefit, aime: +v.aime, colaPercent: +v.cola }; }
export function SocialSecurityBenefitsCalculator() {
  return <ScenarioCalculator id="social-security-benefits-calculator" title="Your Social Security Estimate" action="Calculate Benefits" fields={fields} validate={(v) => validateSocialSecurity(parse(v))} compute={(v) => {
    const r = calculateSocialSecurity(parse(v));
    return { summary: { label: 'Estimated gross monthly benefit', amount: money(r.monthlyBenefit), period: `At ${v.years}y ${v.months}m` },
      metrics: [['Full retirement age', age(r.fraMonths)], ['Base full retirement benefit / PIA', money(r.basePia)], ['After one-time COLA assumption', money(r.adjustedPia)], ['Claiming adjustment', `${r.benefitPercent.toFixed(2)}%`], ['Estimated annual benefit', money(r.annualBenefit)], ...r.comparisons.map((c): [string, string] => [`Monthly benefit at ${age(c.ageMonths)}`, money(c.monthly)])] as [string, string][],
      notes: ['Gross worker retirement estimate, before taxes, Medicare, earnings-test withholding, or spousal/survivor benefits. Eligibility and credits are not determined. MicroFinancePost is not affiliated with SSA.', '2026 bend points apply only to the 2026 eligibility cohort. January 1 birth-date rules, historical COLAs, future earnings indexing, and delayed-credit payment timing are not modeled. Use your SSA statement for other cohorts. Benefits floor to whole dollars after the modeled adjustments. Future COLAs are not predicted.'],
    };
  }} />;
}
