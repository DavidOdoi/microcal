'use client';

import { useMemo, useState } from 'react';
import { MortgageCalculator } from './MortgageCalculator';
import { AlertCircle, ArrowRight, TrendingUp } from 'lucide-react';

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

function toNumber(value: string, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function formatMoney(value: number) {
  return currency.format(value);
}

function formatPercent(value: number) {
  return `${value.toFixed(2)}%`;
}

function calculate401k(currentBalance: number, monthlyContribution: number, annualRate: number, years: number, employerMatchPercent: number) {
  const monthlyRate = annualRate / 100 / 12;
  const months = years * 12;
  let balance = currentBalance;
  let employeeContribution = 0;
  let employerContribution = 0;

  for (let month = 0; month < months; month += 1) {
    balance = balance * (1 + monthlyRate);
    employeeContribution = monthlyContribution;
    employerContribution = monthlyContribution * (employerMatchPercent / 100);
    balance += employeeContribution + employerContribution;
  }

  return {
    balance,
    monthlyContribution,
    employerContribution,
    totalContributions: currentBalance + monthlyContribution * months + employerContribution * months,
  };
}

function calculatePaycheck(grossPay: number, annualRate: number, stateRate: number, deductions: number) {
  const federal = grossPay * (annualRate / 100);
  const state = grossPay * (stateRate / 100);
  const net = grossPay - federal - state - deductions;

  return {
    federal,
    state,
    deductions,
    net,
  };
}

function calculateCreditCard(balance: number, apr: number, monthlyPayment: number) {
  const monthlyRate = apr / 100 / 12;
  let remaining = balance;
  let months = 0;

  while (remaining > 0 && months < 600) {
    remaining = remaining * (1 + monthlyRate) - monthlyPayment;
    months += 1;
    if (remaining < 0) {
      remaining = 0;
    }
  }

  return {
    months,
    totalPaid: monthlyPayment * months,
    interest: monthlyPayment * months - balance,
  };
}

function calculateCompoundInterest(principal: number, annualRate: number, years: number, monthlyContribution: number) {
  const monthlyRate = annualRate / 100 / 12;
  const months = years * 12;
  let balance = principal;

  for (let i = 0; i < months; i += 1) {
    balance = balance * (1 + monthlyRate);
    balance += monthlyContribution;
  }

  return {
    finalValue: balance,
    interestEarned: balance - (principal + monthlyContribution * months),
  };
}

function calculateBudget(income: number, fixedExpenses: number, wants: number, savings: number) {
  const remaining = income - fixedExpenses - wants - savings;

  return {
    remaining,
    essentials: fixedExpenses,
    wants,
    savings,
  };
}

export function CalculatorRenderer({ slug }: { slug: string }) {
  switch (slug) {
    case 'mortgage-calculator':
      return <MortgageCalculator />;
    case '401k-calculator':
      return <RetirementCalculator />;
    case 'paycheck-calculator':
      return <PaycheckCalculator />;
    case 'credit-card-payoff-calculator':
      return <CreditCardCalculator />;
    case 'compound-interest-calculator':
      return <CompoundInterestCalculator />;
    case 'savings-calculator':
      return <SavingsCalculator />;
    case 'budget-calculator':
      return <BudgetCalculator />;
    default:
      return <ComingSoonCalculator slug={slug} />;
  }
}

function Field({ label, value, onChange, min }: { label: string; value: string; onChange: (value: string) => void; min?: number }) {
  return (
    <label className="field-row">
      <span>{label}</span>
      <input type="number" min={min} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function ComingSoonCalculator({ slug }: { slug: string }) {
  return (
    <div className="empty-state">
      <AlertCircle size={28} />
      <h2>This calculator is being built</h2>
      <p>
        The <strong>{slug.replace(/-/g, ' ')}</strong> tool is in progress. The rest of the site is ready to use while we finish this one.
      </p>
    </div>
  );
}

function RetirementCalculator() {
  const [currentBalance, setCurrentBalance] = useState('120000');
  const [monthlyContribution, setMonthlyContribution] = useState('800');
  const [annualRate, setAnnualRate] = useState('7');
  const [years, setYears] = useState('20');
  const [matchPercent, setMatchPercent] = useState('50');

  const result = useMemo(
    () => calculate401k(toNumber(currentBalance), toNumber(monthlyContribution), toNumber(annualRate), toNumber(years), toNumber(matchPercent)),
    [currentBalance, monthlyContribution, annualRate, years, matchPercent],
  );

  return (
    <div className="calculator-panel">
      <div className="form-grid">
        <Field label="Current balance" value={currentBalance} onChange={setCurrentBalance} />
        <Field label="Monthly contribution" value={monthlyContribution} onChange={setMonthlyContribution} />
        <Field label="Annual return (%)" value={annualRate} onChange={setAnnualRate} />
        <Field label="Years" value={years} onChange={setYears} min={1} />
        <Field label="Employer match (%)" value={matchPercent} onChange={setMatchPercent} />
      </div>

      <div className="result-list" aria-live="polite"><h2>Your results</h2>
        <div>
          <small>Projected value</small>
          <strong>{formatMoney(result.balance)}</strong>
        </div>
        <div>
          <small>Employer match</small>
          <strong>{formatMoney(result.employerContribution * toNumber(years) * 12)}</strong>
        </div>
      </div>
    </div>
  );
}

function PaycheckCalculator() {
  const [grossPay, setGrossPay] = useState('6500');
  const [federalRate, setFederalRate] = useState('22');
  const [stateRate, setStateRate] = useState('5');
  const [deductions, setDeductions] = useState('400');

  const result = useMemo(
    () => calculatePaycheck(toNumber(grossPay), toNumber(federalRate), toNumber(stateRate), toNumber(deductions)),
    [grossPay, federalRate, stateRate, deductions],
  );

  return (
    <div className="calculator-panel">
      <div className="form-grid">
        <Field label="Gross pay" value={grossPay} onChange={setGrossPay} />
        <Field label="Federal tax (%)" value={federalRate} onChange={setFederalRate} />
        <Field label="State tax (%)" value={stateRate} onChange={setStateRate} />
        <Field label="Other deductions" value={deductions} onChange={setDeductions} />
      </div>

      <div className="result-list" aria-live="polite"><h2>Your results</h2>
        <div>
          <small>Net pay</small>
          <strong>{formatMoney(result.net)}</strong>
        </div>
        <div>
          <small>Federal tax</small>
          <strong>{formatMoney(result.federal)}</strong>
        </div>
        <div>
          <small>State tax</small>
          <strong>{formatMoney(result.state)}</strong>
        </div>
      </div>
    </div>
  );
}

function CreditCardCalculator() {
  const [balance, setBalance] = useState('5400');
  const [apr, setApr] = useState('19.5');
  const [monthlyPayment, setMonthlyPayment] = useState('275');

  const result = useMemo(
    () => calculateCreditCard(toNumber(balance), toNumber(apr), toNumber(monthlyPayment)),
    [balance, apr, monthlyPayment],
  );

  return (
    <div className="calculator-panel">
      <div className="form-grid">
        <Field label="Current balance" value={balance} onChange={setBalance} />
        <Field label="APR (%)" value={apr} onChange={setApr} />
        <Field label="Monthly payment" value={monthlyPayment} onChange={setMonthlyPayment} />
      </div>

      <div className="result-list" aria-live="polite"><h2>Your results</h2>
        <div>
          <small>Payoff time</small>
          <strong>{result.months} months</strong>
        </div>
        <div>
          <small>Total paid</small>
          <strong>{formatMoney(result.totalPaid)}</strong>
        </div>
        <div>
          <small>Interest</small>
          <strong>{formatMoney(result.interest)}</strong>
        </div>
      </div>
    </div>
  );
}

function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState('15000');
  const [annualRate, setAnnualRate] = useState('7');
  const [years, setYears] = useState('15');
  const [monthlyContribution, setMonthlyContribution] = useState('300');

  const result = useMemo(
    () => calculateCompoundInterest(toNumber(principal), toNumber(annualRate), toNumber(years), toNumber(monthlyContribution)),
    [principal, annualRate, years, monthlyContribution],
  );

  return (
    <div className="calculator-panel">
      <div className="form-grid">
        <Field label="Initial deposit" value={principal} onChange={setPrincipal} />
        <Field label="Annual return (%)" value={annualRate} onChange={setAnnualRate} />
        <Field label="Years" value={years} onChange={setYears} min={1} />
        <Field label="Monthly contribution" value={monthlyContribution} onChange={setMonthlyContribution} />
      </div>

      <div className="result-list" aria-live="polite"><h2>Your results</h2>
        <div>
          <small>Future value</small>
          <strong>{formatMoney(result.finalValue)}</strong>
        </div>
        <div>
          <small>Interest earned</small>
          <strong>{formatMoney(result.interestEarned)}</strong>
        </div>
      </div>
    </div>
  );
}

function SavingsCalculator() {
  const [principal, setPrincipal] = useState('5000');
  const [annualRate, setAnnualRate] = useState('4.5');
  const [years, setYears] = useState('8');
  const [monthlyContribution, setMonthlyContribution] = useState('200');

  const result = useMemo(
    () => calculateCompoundInterest(toNumber(principal), toNumber(annualRate), toNumber(years), toNumber(monthlyContribution)),
    [principal, annualRate, years, monthlyContribution],
  );

  return (
    <div className="calculator-panel">
      <div className="form-grid">
        <Field label="Starting balance" value={principal} onChange={setPrincipal} />
        <Field label="Annual yield (%)" value={annualRate} onChange={setAnnualRate} />
        <Field label="Years" value={years} onChange={setYears} min={1} />
        <Field label="Monthly deposit" value={monthlyContribution} onChange={setMonthlyContribution} />
      </div>

      <div className="result-list" aria-live="polite"><h2>Your results</h2>
        <div>
          <small>Estimated balance</small>
          <strong>{formatMoney(result.finalValue)}</strong>
        </div>
        <div>
          <small>Growth</small>
          <strong>{formatMoney(result.interestEarned)}</strong>
        </div>
      </div>
    </div>
  );
}

function BudgetCalculator() {
  const [income, setIncome] = useState('6200');
  const [fixed, setFixed] = useState('2300');
  const [wants, setWants] = useState('1500');
  const [savings, setSavings] = useState('1000');

  const result = useMemo(() => calculateBudget(toNumber(income), toNumber(fixed), toNumber(wants), toNumber(savings)), [income, fixed, wants, savings]);

  return (
    <div className="calculator-panel">
      <div className="form-grid">
        <Field label="Monthly income" value={income} onChange={setIncome} />
        <Field label="Fixed expenses" value={fixed} onChange={setFixed} />
        <Field label="Flexible spending" value={wants} onChange={setWants} />
        <Field label="Savings goals" value={savings} onChange={setSavings} />
      </div>

      <div className="result-list" aria-live="polite"><h2>Your results</h2>
        <div>
          <small>Remaining</small>
          <strong>{formatMoney(result.remaining)}</strong>
        </div>
        <div>
          <small>Needs</small>
          <strong>{formatMoney(result.essentials)}</strong>
        </div>
        <div>
          <small>Wants</small>
          <strong>{formatMoney(result.wants)}</strong>
        </div>
      </div>
    </div>
  );
}
