export type LoanInput = {
  amount: number;
  annualRate: number;
  term: number;
  termUnit: 'years' | 'months';
  paymentsPerYear: 12 | 26 | 52;
  fee: number;
  feeTreatment: 'upfront' | 'financed';
  extraPayment: number;
};

export type ScheduledLoanInput = Omit<LoanInput, 'paymentsPerYear'> & { paymentsPerYear: 1 | 4 | 12 | 26 | 52 };

export function validateScheduledLoan(input: ScheduledLoanInput): string[] {
  const errors: string[] = [];
  if (!Number.isFinite(input.amount) || input.amount <= 0 || input.amount > 1e9) errors.push('Loan amount must be above $0 and no more than $1 billion.');
  if (!Number.isFinite(input.annualRate) || input.annualRate < 0 || input.annualRate > 100) errors.push('Annual interest rate must be between 0% and 100%.');
  if (!['years', 'months'].includes(input.termUnit)) errors.push('Choose years or months for the loan term.');
  const maxTerm = input.termUnit === 'months' ? 600 : 50;
  if (!Number.isFinite(input.term) || input.term <= 0 || input.term > maxTerm) errors.push(`Loan term must be above zero and no more than ${maxTerm} ${input.termUnit === 'months' ? 'months' : 'years'}.`);
  if (![1, 4, 12, 26, 52].includes(input.paymentsPerYear)) errors.push('Choose a supported regular payment frequency.');
  if (!['upfront', 'financed'].includes(input.feeTreatment)) errors.push('Choose an upfront or financed fee.');
  for (const [key, label] of [['fee', 'Loan fee'], ['extraPayment', 'Extra payment']] as const) {
    if (!Number.isFinite(input[key]) || input[key] < 0 || input[key] > 1e9) errors.push(`${label} must be between $0 and $1 billion.`);
  }
  return errors;
}

export function calculateScheduledLoan(input: ScheduledLoanInput) {
  const errors = validateScheduledLoan(input);
  if (errors.length) throw new RangeError(errors.join(' '));
  const years = input.term / (input.termUnit === 'months' ? 12 : 1);
  const rawCount = years * input.paymentsPerYear;
  const paymentCount = Math.max(1, Math.ceil(rawCount - 1e-10));
  const principal = input.amount + (input.feeTreatment === 'financed' ? input.fee : 0);
  const upfrontFee = input.feeTreatment === 'upfront' ? input.fee : 0;
  const periodicRate = input.annualRate / 100 / input.paymentsPerYear;
  const logGrowth = Math.log1p(periodicRate);
  const payment = periodicRate === 0 ? principal / paymentCount
    : principal * periodicRate / -Math.expm1(-paymentCount * Math.log1p(periodicRate));
  function amortize(extra: number) {
    let balance = principal;
    let totalInterest = 0;
    const schedule: { period: number; payment: number; principal: number; interest: number; balance: number }[] = [];
    for (let period = 1; period <= paymentCount && balance > 0; period++) {
      const interest = balance * periodicRate;
      const startingBalance = balance;
      if (period === paymentCount || balance + interest <= payment + extra) balance = 0;
      else {
        // Equivalent closed-form balance avoids amplifying early rounding errors
        // across long schedules, especially at high annual payment rates.
        const scheduledBalance = periodicRate === 0 ? principal * (1 - period / paymentCount)
          : principal * (-Math.expm1((period - paymentCount) * logGrowth) / -Math.expm1(-paymentCount * logGrowth));
        const extraReduction = periodicRate === 0 ? extra * period : extra * (Math.expm1(period * logGrowth) / periodicRate);
        balance = Math.max(0, scheduledBalance - extraReduction);
      }
      const principalPaid = startingBalance - balance;
      const actualPayment = principalPaid + interest;
      totalInterest += interest;
      schedule.push({ period, payment: actualPayment, principal: principalPaid, interest, balance });
    }
    return { totalInterest, schedule };
  }
  const baseline = amortize(0);
  const result = input.extraPayment > 0 ? amortize(input.extraPayment) : baseline;
  const totalPayments = result.schedule.reduce((sum, row) => sum + row.payment, 0);
  return {
    principal, upfrontFee, payment, plannedPayment: payment + input.extraPayment,
    paymentCount, roundedTerm: Math.abs(rawCount - paymentCount) > 1e-8,
    totalInterest: result.totalInterest, totalPayments, totalRepayment: totalPayments + upfrontFee,
    actualPaymentCount: result.schedule.length, paymentsSaved: baseline.schedule.length - result.schedule.length,
    interestSaved: Math.max(0, baseline.totalInterest - result.totalInterest), schedule: result.schedule,
  };
}

// Preserve the general calculator's existing public frequencies and behavior.
export function validateLoan(input: LoanInput): string[] {
  const errors = validateScheduledLoan(input);
  if (![12, 26, 52].includes(input.paymentsPerYear)) errors.push('Choose monthly, biweekly, or weekly payments.');
  return errors;
}
export function calculateLoan(input: LoanInput) {
  const errors = validateLoan(input);
  if (errors.length) throw new RangeError(errors.join(' '));
  return calculateScheduledLoan(input);
}
