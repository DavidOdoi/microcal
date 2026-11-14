import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateRentVsBuy, type RentBuyInput } from './rent-vs-buy-calculations.ts';
const example: RentBuyInput = { price: 300000, down: 60000, rate: 6, term: 30, rent: 1800, horizon: 5, tax: 3600, insurance: 1500, maintenance: 250, hoa: 0, pmi: 0, renterInsurance: 0, closing: 3, selling: 6, homeGrowth: 0, rentGrowth: 0, returnRate: 0 };
test('rent versus buy reproduces the supplied monthly example and keeps equity', () => {
  const result = calculateRentVsBuy(example);
  assert.ok(Math.abs(result.mortgage.monthlyPrincipalInterest - 1438.92126) < 0.001);
  assert.ok(Math.abs(result.firstMonthlyBuy - 2113.92126) < 0.001);
  assert.equal(result.firstMonthlyRent, 1800);
  assert.equal(result.closingCosts, 9000);
  assert.equal(result.rows.length, 5);
  assert.ok(result.rows[4].loanBalance < 240000);
  assert.ok(result.buyerAssets < result.renterAssets);
});
test('principal repayment is an asset transfer rather than an additional loss', () => {
  const result = calculateRentVsBuy({ ...example, price: 100000, down: 20000, rate: 0, term: 10, rent: 0, horizon: 1, tax: 0, insurance: 0, maintenance: 0, closing: 0, selling: 0 });
  assert.ok(Math.abs(result.buyingAdvantage) < 0.01);
  assert.ok(Math.abs(result.buyerAssets - 28000) < 0.01);
});
test('cash buyer invests avoided rent; mortgage payments stop at payoff', () => {
  const cash = calculateRentVsBuy({ ...example, price: 100000, down: 100000, rent: 1000, horizon: 1, tax: 0, insurance: 0, maintenance: 0, closing: 0, selling: 0 });
  assert.equal(cash.buyerAssets, 112000);
  assert.equal(cash.renterAssets, 100000);
  const paid = calculateRentVsBuy({ ...example, price: 12000, down: 0, rate: 0, term: 1, horizon: 2, tax: 0, insurance: 0, maintenance: 0, closing: 0, selling: 0 });
  assert.equal(paid.rows[1].loanBalance, 0);
  assert.equal(paid.buyingCashOut, 12000);
  const withInsurance = calculateRentVsBuy({ ...example, price: 12000, down: 0, rate: 0, term: 1, horizon: 2, tax: 0, insurance: 0, maintenance: 0, pmi: 100, closing: 0, selling: 0 });
  assert.equal(withInsurance.buyingCashOut, 13200);
});
test('growth, investment returns and selling costs change the comparison', () => {
  const base = calculateRentVsBuy(example);
  assert.ok(calculateRentVsBuy({ ...example, homeGrowth: 3 }).buyerAssets > base.buyerAssets);
  assert.ok(calculateRentVsBuy({ ...example, returnRate: 4 }).renterAssets > base.renterAssets);
  assert.ok(calculateRentVsBuy({ ...example, selling: 0 }).buyerAssets > base.buyerAssets);
  assert.ok(calculateRentVsBuy({ ...example, homeGrowth: -10 }).buyerAssets < base.buyerAssets);
});
