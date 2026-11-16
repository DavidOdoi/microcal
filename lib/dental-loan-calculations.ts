export type DentalLoanInput = {
  treatmentCost: number;
  insurance: number;
  downPayment: number;
  annualRate: number;
  termMonths: number;
  fee: number;
  financeFee: boolean;
  extraPayment: number;
};

export function validateDentalLoan(input: DentalLoanInput): string[] {
  const errors: string[] = [];
  for (const [key, label] of [
    ['treatmentCost', 'Treatment cost'], ['insurance', 'Insurance contribution'],
    ['downPayment', 'Down payment'], ['fee', 'Loan fee'], ['extraPayment', 'Extra monthly payment'],
  ] as const) {
    if (!Number.isFinite(input[key]) || input[key] < 0 || input[key] > 1e9) errors.push(`${label} must be between $0 and $1 billion.`);
  }
  if (!Number.isFinite(input.annualRate) || input.annualRate < 0 || input.annualRate > 100) errors.push('Annual interest rate must be between 0% and 100%.');
  if (!Number.isInteger(input.termMonths) || input.termMonths < 1 || input.termMonths > 360) errors.push('Loan term must be a whole number from 1 to 360 months.');
  if (input.insurance + input.downPayment > input.treatmentCost) errors.push('Insurance and down payment together cannot exceed treatment cost.');
  return errors;
}

export function calculateDentalLoan(input: DentalLoanInput) {
  const errors = validateDentalLoan(input);
  if (errors.length) throw new RangeError(errors.join(' '));
  const treatmentBalance = input.treatmentCost - input.insurance - input.downPayment;
  const fee = treatmentBalance > 0 ? input.fee : 0;
  const principal = treatmentBalance + (input.financeFee ? fee : 0);
  const upfrontCost = input.downPayment + (input.financeFee ? 0 : fee);
  const monthlyRate = input.annualRate / 1200;
  // expm1/log1p keep the payment stable for rates close to zero.
  const monthlyPayment = monthlyRate === 0 ? principal / input.termMonths
    : principal * monthlyRate / -Math.expm1(-input.termMonths * Math.log1p(monthlyRate));
  function schedule(extra: number) {
    let balance = principal;
    let totalInterest = 0;
    const rows: { month: number; payment: number; principal: number; interest: number; balance: number }[] = [];
    for (let month = 1; month <= input.termMonths && balance > 0; month++) {
      const interest = balance * monthlyRate;
      const payment = month === input.termMonths ? balance + interest : Math.min(balance + interest, monthlyPayment + extra);
      const principalPaid = payment - interest;
      balance = Math.max(0, balance - principalPaid);
      if (balance < 1e-7) balance = 0;
      totalInterest += interest;
      rows.push({ month, payment, principal: principalPaid, interest, balance });
    }
    return { rows, totalInterest };
  }
  const baseline = schedule(0);
  const actual = input.extraPayment > 0 ? schedule(input.extraPayment) : baseline;
  const totalLoanPayments = actual.rows.reduce((sum, row) => sum + row.payment, 0);
  return {
    treatmentBalance, principal, fee, upfrontCost, monthlyPayment,
    plannedPayment: principal > 0 ? monthlyPayment + input.extraPayment : 0,
    totalInterest: actual.totalInterest, totalLoanPayments,
    totalOutOfPocket: upfrontCost + totalLoanPayments,
    months: actual.rows.length, monthsSaved: baseline.rows.length - actual.rows.length,
    interestSaved: Math.max(0, baseline.totalInterest - actual.totalInterest),
    schedule: actual.rows,
  };
}
