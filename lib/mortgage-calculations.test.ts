import test from 'node:test';
import assert from 'node:assert/strict';
import { annualizeMortgageSchedule, calculateMortgage } from './mortgage-calculations.ts';

const example = { homePrice: 375000, downPayment: 75000, annualRate: 6, years: 30, annualTax: 3600, annualInsurance: 1200, monthlyPmi: 0, monthlyHoa: 0 };
test('mortgage example separates principal and interest from taxes and insurance', () => {
  const result = calculateMortgage(example);
  assert.equal(result.principal, 300000);
  assert.ok(Math.abs(result.monthlyPrincipalInterest - 1798.651575) < 0.001);
  assert.ok(Math.abs(result.monthlyTotal - 2198.651575) < 0.001);
  assert.ok(Math.abs(result.totalInterest - 347514.5675) < 0.01);
  assert.equal(result.schedule.length, 360);
  assert.equal(result.schedule.at(-1)?.balance, 0);
  const higherCosts = calculateMortgage({ ...example, annualTax: 6000, monthlyHoa: 150 });
  assert.equal(higherCosts.totalInterest, result.totalInterest);
  assert.ok(higherCosts.monthlyTotal > result.monthlyTotal);
});
test('mortgage zero interest and fully funded purchase stay finite', () => {
  const zero = calculateMortgage({ ...example, annualRate: 0 });
  assert.equal(zero.monthlyPrincipalInterest, 300000 / 360);
  assert.equal(zero.totalInterest, 0);
  const cash = calculateMortgage({ ...example, downPayment: 500000 });
  assert.equal(cash.principal, 0);
  assert.equal(cash.monthlyPrincipalInterest, 0);
  assert.equal(cash.monthlyTotal, 400);
  assert.ok(Number.isFinite(calculateMortgage({ ...example, annualRate: NaN, years: 0 }).monthlyTotal));
});

test('mortgage principal and interest match the pillar fixtures', () => {
  const cases = [
    [100000, 0, 10, 833.33], [200000, 5, 30, 1073.64], [240000, 6, 30, 1438.92],
    [240000, 6, 15, 2025.26], [300000, 6, 30, 1798.65], [400000, 6, 30, 2398.20],
    [500000, 7, 30, 3326.51], [0, 6, 30, 0],
  ];
  for (const [homePrice, annualRate, years, expected] of cases) {
    const result = calculateMortgage({ ...example, homePrice, downPayment: 0, annualRate, years });
    assert.ok(Math.abs(result.monthlyPrincipalInterest - expected) <= .01, String(homePrice));
  }
  const quick = calculateMortgage({ ...example, homePrice: 300000, downPayment: 60000, annualInsurance: 1800 });
  assert.equal(quick.monthlyTotal.toFixed(2), '1888.92');
  assert.equal(quick.schedule[0].interest.toFixed(2), '1200.00');
  assert.equal(quick.schedule[0].principalPaid.toFixed(2), '238.92');
  assert.equal(Math.round(quick.totalInterest), 278012);
  assert.equal(Math.round(calculateMortgage({ ...example, homePrice: 240000, downPayment: 0, years: 15 }).totalInterest), 124546);
});

test('mortgage PMI uses the editable estimate only below 20% down, with a manual override', () => {
  assert.equal(calculateMortgage({ ...example, homePrice: 300000, downPayment: 60000, annualPmiRate: .5 }).monthlyPmi, 0);
  assert.equal(calculateMortgage({ ...example, homePrice: 300000, downPayment: 30000, annualPmiRate: .5 }).monthlyPmi, 112.5);
  assert.equal(calculateMortgage({ ...example, monthlyPmi: 75 }).monthlyPmi, 75);
});

test('extra principal shortens payoff and annual rows reconcile with the final monthly payment', () => {
  const accelerated = calculateMortgage({ ...example, extraPrincipal: 250, firstPaymentDate: '2026-01-31' });
  const baseline = calculateMortgage(example);
  assert.ok(accelerated.payoffMonths < baseline.payoffMonths);
  assert.ok(accelerated.totalInterest < baseline.totalInterest);
  assert.ok(accelerated.schedule.at(-1)!.payment < accelerated.monthlyPrincipalInterest + 250);
  assert.equal(accelerated.schedule.at(-1)!.balance, 0);
  const annual = annualizeMortgageSchedule(accelerated.schedule);
  assert.ok(Math.abs(annual.reduce((sum, row) => sum + row.interest, 0) - accelerated.totalInterest) < .01);
  assert.ok(Math.abs(annual.reduce((sum, row) => sum + row.principalPaid, 0) - accelerated.principal) < .01);
  const short = calculateMortgage({ ...example, homePrice: 1200, downPayment: 0, annualRate: 0, years: 1, extraPrincipal: 500, firstPaymentDate: '2026-01-31' });
  assert.equal(short.payoffDate, '2026-02-28');
  assert.equal(short.schedule.at(-1)!.payment, 600);
});

test('state mortgage estimates include separately entered flood coverage without changing loan interest', () => {
  const louisiana = {
    ...example, homePrice: 215000, downPayment: 43000, annualTax: 1500, annualInsurance: 3600, annualFloodInsurance: 1200,
  };
  const result = calculateMortgage(louisiana);
  assert.equal(result.monthlyFloodInsurance, 100);
  assert.equal(result.monthlyTotal.toFixed(2), '1556.23');
  assert.equal(result.totalInterest, calculateMortgage({ ...louisiana, annualFloodInsurance: 0 }).totalInterest);
});
