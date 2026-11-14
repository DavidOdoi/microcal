import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateFhaLoan, type FhaLoanInput } from './fha-loan-calculations.ts';
const example: FhaLoanInput = { homePrice: 300000, downPayment: 10500, annualRate: 6.5, years: 30, upfrontMipRate: 1.75, annualMipRate: .55, financeUpfrontMip: true, mipDuration: 'auto', annualTax: 0, annualInsurance: 0, monthlyHoa: 0, closingCosts: 0, countyLimit: 541287 };
test('FHA example finances upfront MIP but calculates annual MIP on base principal', () => {
  const result = calculateFhaLoan(example);
  assert.equal(result.baseLoan, 289500);
  assert.equal(result.upfrontMip, 5066.25);
  assert.equal(result.financedLoan, 294566.25);
  assert.ok(Math.abs(result.initialMonthlyMip - 132.6875) < 1e-8);
  const r = .065 / 12;
  const payment = 294566.25 * r / (1 - Math.pow(1 + r, -360));
  assert.ok(Math.abs(result.monthlyPrincipalInterest - payment) < 1e-8);
  assert.equal(result.firstMonthlyPayment.toFixed(0), '1995');
  assert.equal(result.mipMonths, 360);
  assert.ok(result.schedule[12].mip < result.schedule[0].mip);
});
test('FHA insurance duration uses original base LTV rather than financed balance', () => {
  const result = calculateFhaLoan({ ...example, downPayment: 30000 });
  assert.equal(result.baseLtv, 90);
  assert.equal(result.mipMonths, 132);
  assert.ok(result.schedule[131].mip > 0);
  assert.equal(result.schedule[132].mip, 0);
  assert.equal(calculateFhaLoan({ ...example, downPayment: 30000, mipDuration: 'term' }).mipMonths, 360);
});
test('cash upfront MIP and entered fees are kept out of financed principal', () => {
  const financed = calculateFhaLoan(example);
  const cash = calculateFhaLoan({ ...example, financeUpfrontMip: false, closingCosts: 2000 });
  assert.equal(cash.financedLoan, 289500);
  assert.equal(cash.cashAtClosing, 10500 + 5066.25 + 2000);
  assert.ok(cash.monthlyPrincipalInterest < financed.monthlyPrincipalInterest);
  assert.equal(cash.initialMonthlyMip, financed.initialMonthlyMip);
});
test('county limit checks exclude upfront MIP and zero-interest cases stay finite', () => {
  assert.equal(calculateFhaLoan({ ...example, homePrice: 600000, downPayment: 60000 }).exceedsEnteredCountyLimit, false);
  assert.equal(calculateFhaLoan({ ...example, homePrice: 600000, downPayment: 50000 }).exceedsEnteredCountyLimit, true);
  assert.equal(calculateFhaLoan({ ...example, annualRate: 0 }).loanInterest, 0);
  const cash = calculateFhaLoan({ ...example, downPayment: 300000 });
  assert.equal(cash.initialMonthlyMip, 0);
  assert.equal(cash.firstMonthlyPayment, 0);
});
