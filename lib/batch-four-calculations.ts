const MAX_MONEY = 1e12;
const MAX_PERIODS = 5200;

export function safeMoney(value: number): number {
  return Number.isFinite(value) ? Math.min(MAX_MONEY, Math.max(0, value)) : 0;
}

function safePercent(value: number): number {
  return Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0;
}

function paymentFor(principal: number, periodicRate: number, periods: number): number {
  if (principal <= 0 || periods <= 0) return 0;
  if (periodicRate <= 0) return principal / periods;
  const growth = Math.pow(1 + periodicRate, periods);
  return Number.isFinite(growth) ? principal * periodicRate * growth / (growth - 1) : principal * periodicRate;
}

function monthlyDate(date: Date, delta: number): Date {
  const day = date.getUTCDate();
  const result = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + delta, 1));
  const lastDay = new Date(Date.UTC(result.getUTCFullYear(), result.getUTCMonth() + 1, 0)).getUTCDate();
  result.setUTCDate(Math.min(day, lastDay));
  return result;
}

export type BusinessFrequency = 'monthly' | 'quarterly' | 'weekly';
export type BusinessFeeTreatment = 'deducted' | 'upfront' | 'financed';

export function calculateBusinessLoan(input: {
  amount: number; annualRatePercent: number; term: number; termUnit: 'months' | 'years'; frequency: BusinessFrequency;
  feeValue: number; feeMode: 'percent' | 'dollars'; feeTreatment: BusinessFeeTreatment; extraPayment: number;
  firstPaymentDate: string;
}) {
  const amount = safeMoney(input.amount);
  const periodsPerYear = input.frequency === 'weekly' ? 52 : input.frequency === 'quarterly' ? 4 : 12;
  const termYears = safeMoney(input.term) * (input.termUnit === 'months' ? 1 / 12 : 1);
  const periods = Math.min(MAX_PERIODS, Math.max(0, Math.round(termYears * periodsPerYear)));
  const feeRaw = safeMoney(input.feeValue);
  const fee = Math.min(amount, input.feeMode === 'percent' ? amount * safePercent(feeRaw) / 100 : feeRaw);
  const principal = Math.min(MAX_MONEY, amount + (input.feeTreatment === 'financed' ? fee : 0));
  const netCashReceived = input.feeTreatment === 'deducted' ? amount - fee : amount;
  const periodicRate = safePercent(input.annualRatePercent) / 100 / periodsPerYear;
  const scheduledPayment = paymentFor(principal, periodicRate, periods);
  let balance = principal;
  let interestTotal = 0;
  let paymentsTotal = 0;
  const schedule: { period: number; date: string; startingBalance: number; interest: number; payment: number; principalPaid: number; endingBalance: number }[] = [];
  for (let period = 1; period <= periods && balance > 0; period += 1) {
    const startingBalance = balance;
    const interest = balance * periodicRate;
    const payment = Math.min(balance + interest, scheduledPayment + safeMoney(input.extraPayment));
    const principalPaid = Math.max(0, payment - interest);
    balance = Math.max(0, balance - principalPaid);
    interestTotal += interest;
    paymentsTotal += payment;
    const date = new Date(`${input.firstPaymentDate || new Date().toISOString().slice(0, 10)}T12:00:00Z`);
    if (Number.isFinite(date.getTime())) {
      if (input.frequency === 'monthly') date.setTime(monthlyDate(date, period - 1).getTime());
      else if (input.frequency === 'quarterly') date.setTime(monthlyDate(date, 3 * (period - 1)).getTime());
      else date.setUTCDate(date.getUTCDate() + 7 * (period - 1));
    }
    schedule.push({ period, date: Number.isFinite(date.getTime()) ? date.toISOString().slice(0, 10) : '', startingBalance, interest, payment, principalPaid, endingBalance: balance });
  }
  const totalFees = fee;
  return { amount, principal, fee, feeTreatment: input.feeTreatment, netCashReceived, periodsPerYear, periods, periodicRate, scheduledPayment, paymentsTotal, interestTotal, totalFees, totalFinancingCost: interestTotal + totalFees, schedule, paidOff: balance <= 0, endingBalance: balance };
}

export function calculateSavingsRunway(input: {
  savings: number; essentialExpenses: number; additionalSpending: number; monthlyIncome: number;
  annualReturnPercent: number; annualInflationPercent: number; annualIncomeGrowthPercent: number;
  withdrawalTiming: 'beginning' | 'end'; horizonYears?: number;
}) {
  const startingBalance = safeMoney(input.savings);
  const essentials = safeMoney(input.essentialExpenses);
  const extraSpending = safeMoney(input.additionalSpending);
  const income = safeMoney(input.monthlyIncome);
  const annualReturn = safePercent(input.annualReturnPercent) / 100;
  const inflation = safePercent(input.annualInflationPercent) / 100;
  const incomeGrowth = safePercent(input.annualIncomeGrowthPercent) / 100;
  const horizonYears = Math.min(100, Math.max(1, Math.floor(input.horizonYears ?? 100)));
  const horizonMonths = horizonYears * 12;
  const returnMonthly = Math.pow(1 + annualReturn, 1 / 12) - 1;
  const inflationMonthly = Math.pow(1 + inflation, 1 / 12) - 1;
  const incomeMonthly = Math.pow(1 + incomeGrowth, 1 / 12) - 1;
  let balance = startingBalance;
  let currentExpenses = essentials + extraSpending;
  let currentIncome = income;
  let depletedMonth: number | null = balance <= 0 ? 0 : null;
  const chart: { month: number; balance: number; expenses: number; income: number }[] = [{ month: 0, balance, expenses: currentExpenses, income: currentIncome }];
  const schedule: { month: number; startingBalance: number; expenses: number; income: number; netWithdrawal: number; interest: number; endingBalance: number }[] = [];
  for (let month = 1; month <= Math.min(horizonMonths, MAX_PERIODS) && balance > 0; month += 1) {
    const starting = balance;
    let interest = 0;
    if (input.withdrawalTiming === 'beginning') {
      balance = Math.max(0, balance - currentExpenses + currentIncome);
      interest = balance * returnMonthly;
      balance += interest;
    } else {
      interest = balance * returnMonthly;
      balance += interest;
      balance = Math.max(0, balance - currentExpenses + currentIncome);
    }
    schedule.push({ month, startingBalance: starting, expenses: currentExpenses, income: currentIncome, netWithdrawal: currentExpenses - currentIncome, interest, endingBalance: balance });
    chart.push({ month, balance, expenses: currentExpenses, income: currentIncome });
    if (balance <= 0) depletedMonth = month;
    currentExpenses *= 1 + inflationMonthly;
    currentIncome *= 1 + incomeMonthly;
  }
  const firstNetOutflow = essentials + extraSpending - income;
  return {
    startingBalance, monthlyNetOutflow: firstNetOutflow, returnMonthly, horizonMonths, horizonYears,
    depletedMonth, depleted: depletedMonth !== null, noImmediateWithdrawal: firstNetOutflow <= 0,
    balanceAtHorizon: balance, projectedMonths: schedule.length, chart, schedule,
  };
}

export function calculateHeloc(input: {
  balance: number; annualRatePercent: number; drawMonths: number; repaymentYears: number;
  drawPaymentType: 'interest-only' | 'principal-interest'; drawPrincipalPayment: number;
  additionalDraw: number; extraPrincipal: number; monthlyFee: number; annualFee: number;
  repaymentRatePercent?: number | null;
}) {
  const startBalance = safeMoney(input.balance) + safeMoney(input.additionalDraw);
  const drawMonths = Math.min(1200, Math.max(0, Math.floor(input.drawMonths)));
  const repaymentMonths = Math.min(1200, Math.max(0, Math.round(safeMoney(input.repaymentYears) * 12)));
  const drawRate = safePercent(input.annualRatePercent) / 1200;
  const repaymentAnnual = input.repaymentRatePercent === null || input.repaymentRatePercent === undefined
    ? safePercent(input.annualRatePercent) : safePercent(input.repaymentRatePercent);
  const repaymentRate = repaymentAnnual / 1200;
  const feesPerMonth = safeMoney(input.monthlyFee) + safeMoney(input.annualFee) / 12;
  let balance = startBalance;
  let drawInterest = 0;
  const schedule: { month: number; phase: 'Draw' | 'Repayment'; startingBalance: number; ratePercent: number; interest: number; principalPaid: number; payment: number; fees: number; endingBalance: number }[] = [];
  const chart: { month: number; payment: number; fees: number; balance: number }[] = [];
  for (let month = 1; month <= drawMonths; month += 1) {
    const startingBalance = balance;
    const interest = balance * drawRate;
    drawInterest += interest;
    const requestedPayment = input.drawPaymentType === 'principal-interest' ? safeMoney(input.drawPrincipalPayment) : interest;
    const payment = Math.min(balance + interest, requestedPayment + safeMoney(input.extraPrincipal));
    const principalPaid = payment - interest;
    balance = Math.max(0, balance - principalPaid);
    schedule.push({ month, phase: 'Draw', startingBalance, ratePercent: drawRate * 1200, interest, principalPaid, payment, fees: feesPerMonth, endingBalance: balance });
    chart.push({ month, payment, fees: feesPerMonth, balance });
  }
  const firstDrawInterest = startBalance * drawRate;
  const drawPayment = input.drawPaymentType === 'interest-only'
    ? Math.min(startBalance + firstDrawInterest, firstDrawInterest + safeMoney(input.extraPrincipal))
    : Math.min(startBalance + firstDrawInterest, safeMoney(input.drawPrincipalPayment) + safeMoney(input.extraPrincipal));
  const repaymentPayment = paymentFor(balance, repaymentRate, repaymentMonths);
  const repaymentStartingBalance = balance;
  let repaymentInterest = 0;
  let repaymentPayments = 0;
  for (let index = 1; index <= repaymentMonths && balance > 0; index += 1) {
    const month = drawMonths + index;
    const startingBalance = balance;
    const interest = balance * repaymentRate;
    const payment = Math.min(balance + interest, repaymentPayment + safeMoney(input.extraPrincipal));
    const principalPaid = Math.max(0, payment - interest);
    balance = Math.max(0, balance - principalPaid);
    repaymentInterest += interest;
    repaymentPayments += payment;
    schedule.push({ month, phase: 'Repayment', startingBalance, ratePercent: repaymentAnnual, interest, principalPaid, payment, fees: feesPerMonth, endingBalance: balance });
    chart.push({ month, payment, fees: feesPerMonth, balance });
  }
  const drawFees = drawMonths * feesPerMonth;
  const repaymentFees = schedule.filter((row) => row.phase === 'Repayment').length * feesPerMonth;
  const drawMonthlyCost = drawPayment + feesPerMonth;
  const repaymentMonthlyCost = repaymentPayment + feesPerMonth;
  return {
    startBalance, endingDrawBalance: repaymentStartingBalance, repaymentEndingBalance: balance, drawMonths, repaymentMonths,
    drawRatePercent: drawRate * 1200, repaymentRatePercent: repaymentAnnual,
    drawPayment, repaymentPayment, drawMonthlyCost, repaymentMonthlyCost,
    paymentIncrease: repaymentMonthlyCost - drawMonthlyCost, drawInterest, repaymentInterest,
    totalInterest: drawInterest + repaymentInterest, totalFees: drawFees + repaymentFees,
    totalRepayment: startBalance + drawInterest + repaymentInterest + drawFees + repaymentFees,
    feesPerMonth, schedule, chart, paidOff: balance <= 0,
  };
}

export function calculateStudentLoanInterest(input: {
  principal: number; annualRatePercent: number; startDate: string; endDate: string;
  unpaidInterest: number; paymentAmount: number; paymentDate: string;
  interestTreatment: 'accruing' | 'subsidized'; capitalize: boolean; capitalizationDate: string;
}) {
  let principal = safeMoney(input.principal);
  let unpaidInterest = safeMoney(input.unpaidInterest);
  const rate = safePercent(input.annualRatePercent) / 100;
  const parseDate = (value: string) => {
    const date = new Date(`${value}T00:00:00Z`);
    return Number.isFinite(date.getTime()) ? date : null;
  };
  const start = parseDate(input.startDate);
  const end = parseDate(input.endDate);
  const paymentDate = parseDate(input.paymentDate);
  const capitalizationDate = parseDate(input.capitalizationDate);
  if (!start || !end || end < start || (end.getTime() - start.getTime()) / 86400000 > 36525) return { valid: false, days: 0, principal, dailyInterest: principal * rate / 365.25, accruedInterest: 0, unpaidInterest, paymentToInterest: 0, paymentToPrincipal: 0, totalOutstanding: principal + unpaidInterest, schedule: [] as { date: string; principal: number; interest: number; unpaidInterest: number }[] };
  const days = Math.floor((end.getTime() - start.getTime()) / 86400000);
  const dailyInterest = principal * rate / 365.25;
  let accruedInterest = 0;
  let paymentToInterest = 0;
  let paymentToPrincipal = 0;
  let paymentRemaining = safeMoney(input.paymentAmount);
  const schedule: { date: string; principal: number; interest: number; unpaidInterest: number }[] = [];
  for (let day = 1; day <= Math.min(days, 36525); day += 1) {
    const date = new Date(start.getTime() + day * 86400000);
    if (input.interestTreatment === 'accruing' && principal > 0) {
      const todayInterest = principal * rate / 365.25;
      accruedInterest += todayInterest;
      unpaidInterest += todayInterest;
    }
    if (paymentRemaining > 0 && paymentDate && date.getTime() === paymentDate.getTime()) {
      const toInterest = Math.min(unpaidInterest, paymentRemaining);
      unpaidInterest -= toInterest;
      paymentRemaining -= toInterest;
      paymentToInterest += toInterest;
      const toPrincipal = Math.min(principal, paymentRemaining);
      principal -= toPrincipal;
      paymentRemaining -= toPrincipal;
      paymentToPrincipal += toPrincipal;
    }
    if (input.capitalize && capitalizationDate && date.getTime() === capitalizationDate.getTime()) {
      principal += unpaidInterest;
      unpaidInterest = 0;
    }
    if (day === 1 || day === days || (paymentDate && date.getTime() === paymentDate.getTime()) || (input.capitalize && capitalizationDate && date.getTime() === capitalizationDate.getTime())) {
      schedule.push({ date: date.toISOString().slice(0, 10), principal, interest: accruedInterest, unpaidInterest });
    }
  }
  return { valid: true, days, principal, dailyInterest, accruedInterest, unpaidInterest, paymentToInterest, paymentToPrincipal, totalOutstanding: principal + unpaidInterest, schedule };
}
