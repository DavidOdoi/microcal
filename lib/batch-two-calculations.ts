const MAX_AMOUNT = 1_000_000_000_000;
const MAX_MONTHS = 1200;

export function cleanAmount(value: number): number {
  return Number.isFinite(value) ? Math.min(MAX_AMOUNT, Math.max(0, value)) : 0;
}

function cleanRate(value: number): number {
  return Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0;
}

export function calculateHighYieldSavings(input: {
  initialDeposit: number; apyPercent: number; monthlyContribution: number;
  durationMonths: number; monthlyWithdrawal: number; contributionTiming: 'beginning' | 'end';
}) {
  const initialDeposit = cleanAmount(input.initialDeposit);
  const apy = cleanRate(input.apyPercent) / 100;
  const contribution = cleanAmount(input.monthlyContribution);
  const withdrawal = cleanAmount(input.monthlyWithdrawal);
  const months = Math.min(MAX_MONTHS, Math.max(0, Math.floor(Number.isFinite(input.durationMonths) ? input.durationMonths : 0)));
  const monthlyRate = Math.pow(1 + apy, 1 / 12) - 1;
  let balance = initialDeposit;
  let interestEarned = 0;
  let additionalContributions = 0;
  let totalWithdrawals = 0;
  let withdrawalShortfall = 0;
  const chart = [{ month: 0, balance }];
  const yearlyBreakdown: { period: string; endingBalance: number; contributions: number; interest: number; withdrawals: number }[] = [];
  let periodContribution = 0;
  let periodInterest = 0;
  let periodWithdrawals = 0;

  for (let month = 1; month <= months; month += 1) {
    let monthInterest = 0;
    let monthWithdrawal = 0;
    if (input.contributionTiming === 'beginning') {
      balance += contribution;
      additionalContributions += contribution;
      periodContribution += contribution;
      monthWithdrawal = Math.min(balance, withdrawal);
      balance -= monthWithdrawal;
      monthInterest = balance * monthlyRate;
      balance += monthInterest;
    } else {
      monthInterest = balance * monthlyRate;
      balance += monthInterest;
      balance += contribution;
      additionalContributions += contribution;
      periodContribution += contribution;
      monthWithdrawal = Math.min(balance, withdrawal);
      balance -= monthWithdrawal;
    }
    interestEarned += monthInterest;
    totalWithdrawals += monthWithdrawal;
    withdrawalShortfall += withdrawal - monthWithdrawal;
    periodInterest += monthInterest;
    periodWithdrawals += monthWithdrawal;
    chart.push({ month, balance });

    if (month % 12 === 0 || month === months) {
      yearlyBreakdown.push({
        period: month % 12 === 0 ? `Year ${month / 12}` : `${month} months`,
        endingBalance: balance,
        contributions: periodContribution,
        interest: periodInterest,
        withdrawals: periodWithdrawals,
      });
      periodContribution = 0;
      periodInterest = 0;
      periodWithdrawals = 0;
    }
  }

  return {
    initialDeposit,
    additionalContributions,
    totalContributions: initialDeposit + additionalContributions,
    totalWithdrawals,
    withdrawalShortfall,
    interestEarned,
    futureBalance: balance,
    monthlyRate,
    durationMonths: months,
    interestSharePercent: balance > 0 ? (interestEarned / balance) * 100 : 0,
    chart,
    yearlyBreakdown,
  };
}

export interface AutoPayoffScheduleRow {
  month: number;
  startingBalance: number;
  interest: number;
  payment: number;
  principalPaid: number;
  endingBalance: number;
}

export function calculateAutoPayoff(input: {
  principal: number; annualRatePercent: number; monthlyPayment: number;
  extraMonthlyPayment: number; oneTimeAdditionalPayment: number;
}) {
  const principal = cleanAmount(input.principal);
  const annualRate = cleanRate(input.annualRatePercent) / 100;
  const monthlyPayment = cleanAmount(input.monthlyPayment);
  const extraMonthlyPayment = cleanAmount(input.extraMonthlyPayment);
  const oneTimeAdditionalPayment = Math.min(principal, cleanAmount(input.oneTimeAdditionalPayment));
  const monthlyRate = annualRate / 12;

  const simulate = (extra: number, lumpSum: number) => {
    let balance = Math.max(0, principal - lumpSum);
    let interestTotal = 0;
    let totalPaid = lumpSum;
    const schedule: AutoPayoffScheduleRow[] = [];
    let completed = balance === 0;
    const firstInterest = balance * monthlyRate;
    const amortizes = completed || monthlyPayment + extra > firstInterest;
    if (!amortizes) return { completed: false, amortizes: false, months: 0, interestTotal: 0, totalPaid, schedule, remainingBalance: balance };

    for (let month = 1; month <= MAX_MONTHS && balance > 0; month += 1) {
      const startingBalance = balance;
      const interest = balance * monthlyRate;
      const due = balance + interest;
      const payment = Math.min(due, monthlyPayment + extra);
      const principalPaid = Math.max(0, payment - interest);
      balance = Math.max(0, due - payment);
      interestTotal += interest;
      totalPaid += payment;
      schedule.push({ month, startingBalance, interest, payment, principalPaid, endingBalance: balance });
      if (balance < 0.005) balance = 0;
      if (balance === 0) completed = true;
    }

    return { completed, amortizes, months: schedule.length, interestTotal, totalPaid, schedule, remainingBalance: balance };
  };

  const standard = simulate(0, 0);
  const accelerated = simulate(extraMonthlyPayment, oneTimeAdditionalPayment);
  const interestSaved = standard.completed && accelerated.completed ? Math.max(0, standard.interestTotal - accelerated.interestTotal) : null;
  const monthsSaved = standard.completed && accelerated.completed ? Math.max(0, standard.months - accelerated.months) : null;
  return { principal, monthlyRate, standard, accelerated, interestSaved, monthsSaved, maxMonths: MAX_MONTHS };
}

export function addMonthsToDate(dateString: string, months: number): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString) || !Number.isFinite(months)) return null;
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, 1));
  date.setUTCMonth(date.getUTCMonth() + Math.max(0, Math.floor(months)));
  const lastDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate();
  date.setUTCDate(Math.min(day, lastDay));
  return date.toISOString().slice(0, 10);
}

export type LoanMethod = 'simple' | 'amortizing';
export type PaymentFrequency = 1 | 12 | 26 | 52;

export function calculateLoanInterest(input: {
  principal: number; annualRatePercent: number; termYears: number;
  method: LoanMethod; paymentsPerYear: PaymentFrequency;
}) {
  const principal = cleanAmount(input.principal);
  const annualRate = cleanRate(input.annualRatePercent) / 100;
  const termYears = Number.isFinite(input.termYears) ? Math.min(100, Math.max(0, input.termYears)) : 0;
  const frequency = input.paymentsPerYear;
  const paymentCount = Math.min(5200, Math.ceil(termYears * frequency));
  if (paymentCount === 0 || principal === 0) {
    return { principal, payment: 0, totalInterest: 0, totalRepayment: principal, paymentCount, periodicRate: annualRate / frequency, schedule: [] as AutoPayoffScheduleRow[] };
  }

  if (input.method === 'simple') {
    const totalInterest = principal * annualRate * termYears;
    const totalRepayment = principal + totalInterest;
    const payment = totalRepayment / paymentCount;
    const principalPerPayment = principal / paymentCount;
    const interestPerPayment = totalInterest / paymentCount;
    const schedule = Array.from({ length: paymentCount }, (_, index) => ({
      month: index + 1,
      startingBalance: Math.max(0, principal - principalPerPayment * index),
      interest: interestPerPayment,
      payment,
      principalPaid: principalPerPayment,
      endingBalance: Math.max(0, principal - principalPerPayment * (index + 1)),
    }));
    return { principal, payment, totalInterest, totalRepayment, paymentCount, periodicRate: annualRate / frequency, schedule };
  }

  const periodicRate = annualRate / frequency;
  const payment = periodicRate === 0
    ? principal / paymentCount
    : principal * (periodicRate * Math.pow(1 + periodicRate, paymentCount)) / (Math.pow(1 + periodicRate, paymentCount) - 1);
  let balance = principal;
  let totalInterest = 0;
  let totalRepayment = 0;
  const schedule: AutoPayoffScheduleRow[] = [];
  for (let index = 1; index <= paymentCount && balance > 0; index += 1) {
    const startingBalance = balance;
    const interest = balance * periodicRate;
    const actualPayment = Math.min(payment, balance + interest);
    const principalPaid = Math.max(0, actualPayment - interest);
    balance = Math.max(0, balance + interest - actualPayment);
    if (balance < 0.005) balance = 0;
    totalInterest += interest;
    totalRepayment += actualPayment;
    schedule.push({ month: index, startingBalance, interest, payment: actualPayment, principalPaid, endingBalance: balance });
  }
  return { principal, payment, totalInterest, totalRepayment, paymentCount: schedule.length, periodicRate, schedule };
}
