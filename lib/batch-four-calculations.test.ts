import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateBusinessLoan, calculateHeloc, calculateSavingsRunway, calculateStudentLoanInterest } from './batch-four-calculations.ts';

const near = (actual: number, expected: number, tolerance = 0.02) => assert.ok(Math.abs(actual - expected) <= tolerance, `expected ${actual} to be within ${tolerance} of ${expected}`);

test('business loan $50,000 at 10% for five years matches independently computed monthly amortization', () => {
  const r = calculateBusinessLoan({ amount: 50_000, annualRatePercent: 10, term: 5, termUnit: 'years', frequency: 'monthly', feeValue: 0, feeMode: 'percent', feeTreatment: 'deducted', extraPayment: 0, firstPaymentDate: '2026-01-31' });
  near(r.scheduledPayment, 1062.35);
  near(r.paymentsTotal, 63_741.13);
  near(r.interestTotal, 13_741.13);
  assert.equal(r.schedule[1].date, '2026-02-28');
  assert.equal(r.schedule.at(-1)?.endingBalance, 0);
});

test('business loan fees change proceeds, financed principal, and total cost transparently', () => {
  const common = { amount: 10_000, annualRatePercent: 0, term: 12, termUnit: 'months' as const, frequency: 'monthly' as const, feeValue: 2, feeMode: 'percent' as const, extraPayment: 0, firstPaymentDate: '2026-01-01' };
  const deducted = calculateBusinessLoan({ ...common, feeTreatment: 'deducted' });
  const financed = calculateBusinessLoan({ ...common, feeTreatment: 'financed' });
  const upfront = calculateBusinessLoan({ ...common, feeTreatment: 'upfront' });
  near(deducted.netCashReceived, 9_800); near(deducted.scheduledPayment, 10_000 / 12);
  near(financed.principal, 10_200); near(financed.scheduledPayment, 850);
  near(upfront.netCashReceived, 10_000); near(upfront.totalFinancingCost, 200);
});

test('business loan frequency, zero rate, extra payment, and invalid values stay finite', () => {
  const r = calculateBusinessLoan({ amount: 1200, annualRatePercent: 0, term: 1, termUnit: 'years', frequency: 'weekly', feeValue: -10, feeMode: 'dollars', feeTreatment: 'upfront', extraPayment: 0, firstPaymentDate: 'bad-date' });
  assert.equal(r.periods, 52); near(r.scheduledPayment, 1200 / 52); assert.equal(r.schedule[0].date, '');
  const extra = calculateBusinessLoan({ amount: 1200, annualRatePercent: 12, term: 1, termUnit: 'years', frequency: 'monthly', feeValue: 0, feeMode: 'percent', feeTreatment: 'upfront', extraPayment: 50, firstPaymentDate: '2026-01-01' });
  assert.ok(extra.schedule.length < 12); assert.equal(extra.endingBalance, 0);
});

test('savings runway example depletes during the fourteenth monthly withdrawal', () => {
  const r = calculateSavingsRunway({ savings: 20_000, essentialExpenses: 2000, additionalSpending: 0, monthlyIncome: 500, annualReturnPercent: 0, annualInflationPercent: 0, annualIncomeGrowthPercent: 0, withdrawalTiming: 'end' });
  assert.equal(r.monthlyNetOutflow, 1500); assert.equal(r.depletedMonth, 14); assert.equal(r.balanceAtHorizon, 0);
});

test('savings runway reports non-depletion and applies annual inflation as an equivalent monthly change', () => {
  const stable = calculateSavingsRunway({ savings: 1000, essentialExpenses: 500, additionalSpending: 0, monthlyIncome: 600, annualReturnPercent: 0, annualInflationPercent: 0, annualIncomeGrowthPercent: 0, withdrawalTiming: 'beginning' });
  assert.equal(stable.depleted, false); assert.equal(stable.depletedMonth, null); assert.equal(stable.projectedMonths, 1200);
  const growing = calculateSavingsRunway({ savings: 20_000, essentialExpenses: 1000, additionalSpending: 0, monthlyIncome: 0, annualReturnPercent: 0, annualInflationPercent: 12, annualIncomeGrowthPercent: 0, withdrawalTiming: 'end' });
  near(growing.schedule[11].expenses, 1109.47, 0.1); near(growing.schedule[12].expenses, 1120, 0.1); assert.ok(Number.isFinite(growing.balanceAtHorizon));
});

test('savings runway zero balance, no-income and large input values remain bounded', () => {
  const zero = calculateSavingsRunway({ savings: 0, essentialExpenses: 500, additionalSpending: 0, monthlyIncome: 0, annualReturnPercent: 0, annualInflationPercent: 0, annualIncomeGrowthPercent: 0, withdrawalTiming: 'end' });
  assert.equal(zero.depletedMonth, 0); assert.equal(zero.schedule.length, 0);
  const huge = calculateSavingsRunway({ savings: 1e30, essentialExpenses: 0, additionalSpending: 0, monthlyIncome: 0, annualReturnPercent: 100, annualInflationPercent: 0, annualIncomeGrowthPercent: 0, withdrawalTiming: 'end' });
  assert.ok(huge.chart.every((p) => Number.isFinite(p.balance)));
});

test('HELOC $40,000 interest-only draw transitions to a 15-year repayment payment', () => {
  const r = calculateHeloc({ balance: 40_000, annualRatePercent: 8, drawMonths: 60, repaymentYears: 15, drawPaymentType: 'interest-only', drawPrincipalPayment: 0, additionalDraw: 0, extraPrincipal: 0, monthlyFee: 0, annualFee: 0 });
  near(r.drawPayment, 266.67); near(r.repaymentPayment, 382.26); near(r.endingDrawBalance, 40_000); near(r.totalInterest, 16_000 + r.repaymentInterest);
  assert.equal(r.schedule[59].phase, 'Draw'); assert.equal(r.schedule[60].phase, 'Repayment'); assert.equal(r.repaymentEndingBalance, 0);
});

test('HELOC draws, extra principal, fees, principal payments, and future-rate scenarios affect projections', () => {
  const common = { balance: 40_000, annualRatePercent: 8, drawMonths: 12, repaymentYears: 5, drawPaymentType: 'principal-interest' as const, drawPrincipalPayment: 500, additionalDraw: 5000, extraPrincipal: 100, monthlyFee: 5, annualFee: 120 };
  const base = calculateHeloc(common);
  const higherRate = calculateHeloc({ ...common, repaymentRatePercent: 12 });
  assert.ok(base.endingDrawBalance < 45_000); assert.equal(base.totalFees, base.schedule.length * 15); assert.ok(higherRate.repaymentPayment > base.repaymentPayment);
  assert.ok(base.paymentIncrease > 0); assert.equal(base.repaymentEndingBalance, 0);
});

test('HELOC zero rates and non-amortizing draw payment remain finite and expose balance growth', () => {
  const r = calculateHeloc({ balance: 1200, annualRatePercent: 0, drawMonths: 12, repaymentYears: 1, drawPaymentType: 'principal-interest', drawPrincipalPayment: 50, additionalDraw: 0, extraPrincipal: 0, monthlyFee: 0, annualFee: 0 });
  near(r.endingDrawBalance, 600); near(r.repaymentPayment, 50); assert.ok(r.schedule.every((row) => Number.isFinite(row.endingBalance)));
});

test('student daily interest uses 365.25 and 30 days for the worked example', () => {
  const r = calculateStudentLoanInterest({ principal: 20_000, annualRatePercent: 6, startDate: '2026-01-01', endDate: '2026-01-31', unpaidInterest: 0, paymentAmount: 0, paymentDate: '', interestTreatment: 'accruing', capitalize: false, capitalizationDate: '' });
  assert.equal(r.days, 30); near(r.dailyInterest, 3.28542, 0.0001); near(r.accruedInterest, 98.56); near(r.totalOutstanding, 20_098.56);
});

test('student payment is applied first to unpaid interest then principal on selected date', () => {
  const r = calculateStudentLoanInterest({ principal: 20_000, annualRatePercent: 6, startDate: '2026-01-01', endDate: '2026-01-31', unpaidInterest: 20, paymentAmount: 100, paymentDate: '2026-01-15', interestTreatment: 'accruing', capitalize: false, capitalizationDate: '' });
  near(r.paymentToInterest, 20 + (20_000 * 0.06 / 365.25) * 14); near(r.paymentToPrincipal, 100 - r.paymentToInterest); assert.ok(r.principal < 20_000); assert.equal(r.days, 30);
});

test('student loan supports selected subsidy and explicit capitalization, and rejects bad dates', () => {
  const common = { principal: 10_000, annualRatePercent: 5, startDate: '2026-01-01', endDate: '2026-01-11', unpaidInterest: 50, paymentAmount: 0, paymentDate: '', interestTreatment: 'subsidized' as const };
  const subsidized = calculateStudentLoanInterest({ ...common, capitalize: false, capitalizationDate: '' });
  assert.equal(subsidized.accruedInterest, 0); assert.equal(subsidized.unpaidInterest, 50);
  const capitalized = calculateStudentLoanInterest({ ...common, interestTreatment: 'accruing', capitalize: true, capitalizationDate: '2026-01-05' });
  const eventRow = capitalized.schedule.find((row) => row.date === '2026-01-05');
  assert.equal(eventRow?.unpaidInterest, 0); assert.ok(capitalized.principal > 10_050); assert.ok(capitalized.totalOutstanding > 10_050);
  const invalid = calculateStudentLoanInterest({ ...common, endDate: '2025-12-31', capitalize: false, capitalizationDate: '' });
  assert.equal(invalid.valid, false); assert.equal(invalid.days, 0); assert.ok(Number.isFinite(invalid.dailyInterest));
});
