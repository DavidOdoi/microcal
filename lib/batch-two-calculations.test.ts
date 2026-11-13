import test from 'node:test';
import assert from 'node:assert/strict';
import { addMonthsToDate, calculateAutoPayoff, calculateHighYieldSavings, calculateLoanInterest } from './batch-two-calculations.ts';

test('HYSA APY example compounds 10,000 to 10,816 after two years', () => {
  const result = calculateHighYieldSavings({ initialDeposit: 10000, apyPercent: 4, monthlyContribution: 0, durationMonths: 24, monthlyWithdrawal: 0, contributionTiming: 'end' });
  assert.equal(Math.round(result.futureBalance), 10816);
  assert.equal(Math.round(result.interestEarned), 816);
  assert.equal(result.chart.length, 25);
  assert.equal(result.yearlyBreakdown.length, 2);
});

test('HYSA converts APY to an effective monthly rate and beginning deposits earn an extra period', () => {
  const end = calculateHighYieldSavings({ initialDeposit: 1000, apyPercent: 12, monthlyContribution: 100, durationMonths: 12, monthlyWithdrawal: 0, contributionTiming: 'end' });
  const beginning = calculateHighYieldSavings({ initialDeposit: 1000, apyPercent: 12, monthlyContribution: 100, durationMonths: 12, monthlyWithdrawal: 0, contributionTiming: 'beginning' });
  assert.ok(Math.abs(end.monthlyRate - (Math.pow(1.12, 1 / 12) - 1)) < 1e-12);
  assert.ok(beginning.futureBalance > end.futureBalance);
  assert.equal(end.totalContributions, 2200);
});

test('HYSA zero APY, zero duration, invalid and negative values stay finite and nonnegative', () => {
  const zero = calculateHighYieldSavings({ initialDeposit: -200, apyPercent: Number.NaN, monthlyContribution: 100, durationMonths: 0, monthlyWithdrawal: -1, contributionTiming: 'end' });
  assert.equal(zero.futureBalance, 0);
  assert.equal(zero.interestEarned, 0);
  const noInterest = calculateHighYieldSavings({ initialDeposit: 1000, apyPercent: 0, monthlyContribution: 100, durationMonths: 12, monthlyWithdrawal: 0, contributionTiming: 'end' });
  assert.equal(noInterest.futureBalance, 2200);
});

test('HYSA withdrawals cannot create a negative balance and shortfall is reported', () => {
  const result = calculateHighYieldSavings({ initialDeposit: 100, apyPercent: 0, monthlyContribution: 0, durationMonths: 2, monthlyWithdrawal: 80, contributionTiming: 'end' });
  assert.equal(result.futureBalance, 0);
  assert.equal(result.totalWithdrawals, 100);
  assert.equal(result.withdrawalShortfall, 60);
});

function independentAutoSimulation(balance: number, annualRate: number, regular: number, extra: number, lump: number) {
  let amount = Math.max(0, balance - lump);
  let interestSum = 0;
  let months = 0;
  while (amount > 0 && months < 1200) {
    const interest = amount * annualRate / 1200;
    const due = amount + interest;
    const paid = Math.min(due, regular + extra);
    amount = due - paid;
    interestSum += interest;
    months += 1;
  }
  return { months, interestSum, complete: amount < .005 };
}

test('auto payoff example matches an independent monthly amortization loop', () => {
  const result = calculateAutoPayoff({ principal: 15000, annualRatePercent: 6, monthlyPayment: 350, extraMonthlyPayment: 100, oneTimeAdditionalPayment: 0 });
  const standard = independentAutoSimulation(15000, 6, 350, 0, 0);
  const extra = independentAutoSimulation(15000, 6, 350, 100, 0);
  assert.equal(result.standard.months, standard.months);
  assert.ok(Math.abs(result.standard.interestTotal - standard.interestSum) < 1e-8);
  assert.equal(result.accelerated.months, extra.months);
  assert.ok(Math.abs(result.accelerated.interestTotal - extra.interestSum) < 1e-8);
  assert.ok(result.interestSaved! > 0);
  assert.ok(result.monthsSaved! > 0);
});

test('auto payoff handles zero interest, one-time principal payments, and a capped final payment', () => {
  const result = calculateAutoPayoff({ principal: 1000, annualRatePercent: 0, monthlyPayment: 300, extraMonthlyPayment: 0, oneTimeAdditionalPayment: 100 });
  assert.equal(result.accelerated.months, 3);
  assert.equal(result.accelerated.interestTotal, 0);
  assert.equal(result.accelerated.schedule.at(-1)?.payment, 300);
  assert.equal(result.accelerated.schedule.at(-1)?.endingBalance, 0);
});

test('auto loan final installment never exceeds the remaining principal and accrued interest', () => {
  const result = calculateAutoPayoff({ principal: 1000, annualRatePercent: 6, monthlyPayment: 350, extraMonthlyPayment: 0, oneTimeAdditionalPayment: 0 });
  const last = result.standard.schedule.at(-1)!;
  assert.equal(last.endingBalance, 0);
  assert.ok(last.payment <= last.startingBalance + last.interest + 1e-9);
  assert.ok(last.payment < 350);
});

test('auto payoff warns when required payment does not cover interest and guards non-amortizing schedules', () => {
  const result = calculateAutoPayoff({ principal: 10000, annualRatePercent: 24, monthlyPayment: 100, extraMonthlyPayment: 0, oneTimeAdditionalPayment: 0 });
  assert.equal(result.standard.amortizes, false);
  assert.equal(result.standard.completed, false);
  assert.equal(result.standard.schedule.length, 0);
  assert.equal(result.accelerated.schedule.length, 0);
});

test('auto payoff caps huge lump payments at principal and handles missing or negative values', () => {
  const result = calculateAutoPayoff({ principal: 500, annualRatePercent: -3, monthlyPayment: 0, extraMonthlyPayment: -1, oneTimeAdditionalPayment: 999999 });
  assert.equal(result.accelerated.completed, true);
  assert.equal(result.accelerated.totalPaid, 500);
  assert.equal(result.accelerated.months, 0);
});

test('payment dates handle month ends and invalid dates', () => {
  assert.equal(addMonthsToDate('2024-01-31', 1), '2024-02-29');
  assert.equal(addMonthsToDate('2025-01-31', 1), '2025-02-28');
  assert.equal(addMonthsToDate('not-a-date', 1), null);
});

test('simple-interest loan matches the $10,000, 8%, three-year example', () => {
  const result = calculateLoanInterest({ principal: 10000, annualRatePercent: 8, termYears: 3, method: 'simple', paymentsPerYear: 12 });
  assert.equal(result.totalInterest, 2400);
  assert.equal(result.totalRepayment, 12400);
  assert.ok(Math.abs(result.payment - (12400 / 36)) < 1e-12);
});

test('amortizing loan computes a separate payment and fully pays principal', () => {
  const result = calculateLoanInterest({ principal: 10000, annualRatePercent: 8, termYears: 3, method: 'amortizing', paymentsPerYear: 12 });
  assert.ok(result.payment > 300 && result.payment < 400);
  assert.ok(result.totalInterest > 0 && result.totalInterest < 2400);
  assert.equal(result.schedule.at(-1)?.endingBalance, 0);
  assert.equal(result.schedule.length, 36);
});

test('loan interest handles zero rate, missing inputs, negatives, and large balances', () => {
  const zero = calculateLoanInterest({ principal: 1200, annualRatePercent: 0, termYears: 1, method: 'amortizing', paymentsPerYear: 12 });
  assert.equal(zero.payment, 100);
  assert.equal(zero.totalInterest, 0);
  const bad = calculateLoanInterest({ principal: -5, annualRatePercent: Number.NaN, termYears: Number.NaN, method: 'simple', paymentsPerYear: 12 });
  assert.equal(bad.totalRepayment, 0);
  const large = calculateLoanInterest({ principal: 1e12, annualRatePercent: 1, termYears: 1, method: 'simple', paymentsPerYear: 12 });
  assert.ok(Number.isFinite(large.totalRepayment));
});

test('payment-frequency changes amortizing payment count and conversion', () => {
  const monthly = calculateLoanInterest({ principal: 1200, annualRatePercent: 0, termYears: 1, method: 'amortizing', paymentsPerYear: 12 });
  const biweekly = calculateLoanInterest({ principal: 1200, annualRatePercent: 0, termYears: 1, method: 'amortizing', paymentsPerYear: 26 });
  assert.equal(monthly.paymentCount, 12);
  assert.equal(biweekly.paymentCount, 26);
  assert.ok(biweekly.payment < monthly.payment);
});

test('annual and monthly frequencies use their corresponding periodic rates', () => {
  const monthly = calculateLoanInterest({ principal: 10000, annualRatePercent: 12, termYears: 1, method: 'amortizing', paymentsPerYear: 12 });
  const annual = calculateLoanInterest({ principal: 10000, annualRatePercent: 12, termYears: 1, method: 'amortizing', paymentsPerYear: 1 });
  assert.equal(monthly.periodicRate, 0.01);
  assert.equal(annual.periodicRate, 0.12);
});
