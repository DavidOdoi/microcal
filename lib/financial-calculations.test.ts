import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateCd, calculateDti, calculateEmergencyFund, cdTermMonths, resetCalculatorValues, roundCurrency } from './financial-calculations.ts';

test('DTI uses qualifying obligations, gross monthly income, and percentage conversion', () => {
  const result = calculateDti({ grossMonthlyIncome: 5000, housingPayment: 1500, housingType: 'mortgage', carPayment: 0, studentLoanPayment: 0, personalLoanPayment: 0, creditCardMinimums: 0, otherDebt: 0, proposedLoanPayment: 0 });
  assert.equal(result.qualifyingDebt, 1500);
  assert.equal(result.dtiPercent, 30);
  assert.equal(result.remainingPercent, 70);
});

test('DTI excludes rent from qualifying debt and avoids division by zero', () => {
  const result = calculateDti({ grossMonthlyIncome: 0, housingPayment: 1800, housingType: 'rent', carPayment: -50, studentLoanPayment: 0, personalLoanPayment: 0, creditCardMinimums: 0, otherDebt: 0, proposedLoanPayment: 0 });
  assert.equal(result.qualifyingDebt, 0);
  assert.equal(result.dtiPercent, null);
  assert.equal(result.rentExcluded, true);
});

test('DTI adds a proposed payment only to projected DTI', () => {
  const result = calculateDti({ grossMonthlyIncome: 5000, housingPayment: 1000, housingType: 'mortgage', carPayment: 0, studentLoanPayment: 0, personalLoanPayment: 0, creditCardMinimums: 0, otherDebt: 0, proposedLoanPayment: 500 });
  assert.equal(result.dtiPercent, 20);
  assert.equal(result.projectedDtiPercent, 30);
});

test('emergency fund example and month ceiling are correct', () => {
  const result = calculateEmergencyFund({ housing: 1000, groceries: 200, utilities: 100, transportation: 100, insurance: 0, essentialDebt: 100, otherEssential: 0, currentSavings: 2000, monthlyContribution: 500, targetMonths: 6 });
  assert.equal(result.monthlyExpenses, 1500);
  assert.equal(result.target, 9000);
  assert.equal(result.remaining, 7000);
  assert.equal(result.monthsToGoal, 14);
  assert.equal(result.progressPercent, 22.22222222222222);
});

test('emergency fund handles no contribution, met goal, invalid and negative inputs', () => {
  const noContribution = calculateEmergencyFund({ housing: 100, groceries: 0, utilities: 0, transportation: 0, insurance: 0, essentialDebt: 0, otherEssential: 0, currentSavings: 0, monthlyContribution: 0, targetMonths: 3 });
  assert.equal(noContribution.monthsToGoal, null);
  const metGoal = calculateEmergencyFund({ housing: 100, groceries: 0, utilities: 0, transportation: 0, insurance: 0, essentialDebt: 0, otherEssential: 0, currentSavings: 500, monthlyContribution: 0, targetMonths: 3 });
  assert.equal(metGoal.monthsToGoal, 0);
  const invalid = calculateEmergencyFund({ housing: Number.NaN, groceries: -10, utilities: 0, transportation: 0, insurance: 0, essentialDebt: 0, otherEssential: 0, currentSavings: -50, monthlyContribution: 0, targetMonths: 3 });
  assert.equal(invalid.monthlyExpenses, 0);
  assert.equal(invalid.target, 0);
});

test('CD APY mode produces $10,816 maturity on $10,000 at 4% for two years', () => {
  const result = calculateCd({ principal: 10000, annualRatePercent: 4, termMonths: 24, mode: 'apy', compounding: 12, earlyWithdrawalPenalty: 0 });
  assert.equal(Math.round(result.maturityValue), 10816);
  assert.equal(Math.round(result.interestEarned), 816);
  assert.equal(result.effectiveAnnualYield, 0.04);
});

test('CD nominal mode compounds according to frequency and reports effective APY', () => {
  const monthly = calculateCd({ principal: 10000, annualRatePercent: 4, termMonths: 12, mode: 'nominal', compounding: 12, earlyWithdrawalPenalty: 0 });
  assert.ok(Math.abs(monthly.maturityValue - 10407.42) < 0.01);
  assert.ok(Math.abs(monthly.effectiveAnnualYield - (Math.pow(1 + .04 / 12, 12) - 1)) < 1e-12);
});

test('CD penalty is based only on entered contract amount, capped at maturity', () => {
  const result = calculateCd({ principal: 1000, annualRatePercent: 4, termMonths: 12, mode: 'apy', compounding: 12, earlyWithdrawalPenalty: 1200 });
  assert.equal(result.estimatedPenalty, result.maturityValue);
  assert.equal(result.netAfterPenalty, 0);
});

test('CD rejects non-finite and negative values without NaN or Infinity', () => {
  const result = calculateCd({ principal: -100, annualRatePercent: Number.NaN, termMonths: Number.POSITIVE_INFINITY, mode: 'nominal', compounding: 12, earlyWithdrawalPenalty: -5 });
  assert.ok(Number.isFinite(result.maturityValue));
  assert.equal(result.principal, 0);
  assert.equal(result.interestEarned, 0);
});

test('month and year terms convert to months consistently', () => {
  assert.equal(cdTermMonths(24, 'months'), 24);
  assert.equal(cdTermMonths(2, 'years'), 24);
});

test('currency output rounds to cents and sanitizes non-finite results', () => {
  assert.equal(roundCurrency(1.005), 1.01);
  assert.equal(roundCurrency(10.004), 10);
  assert.equal(roundCurrency(Number.NaN), 0);
});

test('reset values return a fresh copy of the calculator defaults', () => {
  const defaults = { deposit: '10000', term: '24' };
  const reset = resetCalculatorValues(defaults);
  assert.deepEqual(reset, defaults);
  assert.notEqual(reset, defaults);
  reset.deposit = '0';
  assert.equal(defaults.deposit, '10000');
});
