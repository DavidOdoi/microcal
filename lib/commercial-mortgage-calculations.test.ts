import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateCommercialMortgage } from './commercial-mortgage-calculations.ts';
const example = { propertyPrice: 750000, loanAmount: 500000, annualRate: 7, amortizationYears: 20, maturityYears: 20, upfrontFees: 0, annualNoi: 60000 };
test('commercial mortgage reproduces the supplied fully amortizing example and DSCR', () => {
  const result = calculateCommercialMortgage(example);
  assert.equal(result.monthlyPayment.toFixed(2), '3876.49');
  assert.equal(result.interestDuringTerm.toFixed(2), '430358.72');
  assert.equal(result.totalRepaymentWithBalloonAndFees.toFixed(2), '930358.72');
  assert.equal(result.balloon, 0);
  assert.equal(result.downPayment, 250000);
  assert.equal(result.ltv?.toFixed(2), '66.67');
  assert.equal(result.dscr?.toFixed(2), '1.29');
});
test('five-year maturity preserves the twenty-year payment and exposes the balloon', () => {
  const full = calculateCommercialMortgage(example);
  const short = calculateCommercialMortgage({ ...example, maturityYears: 5 });
  assert.equal(short.monthlyPayment, full.monthlyPayment);
  assert.equal(short.schedule.length, 60);
  const r = .07 / 12;
  const independentBalance = 500000 * Math.pow(1 + r, 60) - short.monthlyPayment * (Math.pow(1 + r, 60) - 1) / r;
  assert.ok(Math.abs(short.balloon - independentBalance) < 0.01);
  assert.ok(Math.abs(short.totalRepaymentWithBalloonAndFees - (500000 + short.interestDuringTerm)) < 0.01);
  assert.ok(short.interestDuringTerm < full.interestDuringTerm);
});
test('commercial loan fees and zero interest remain separate from debt service', () => {
  const result = calculateCommercialMortgage({ ...example, annualRate: 0, maturityYears: 5, upfrontFees: 2000 });
  assert.ok(Math.abs(result.balloon - 375000) < 0.01);
  assert.equal(result.interestDuringTerm, 0);
  assert.ok(Math.abs(result.totalRepaymentWithBalloonAndFees - 502000) < 0.01);
  assert.equal(calculateCommercialMortgage({ ...example, annualNoi: null }).dscr, null);
});
