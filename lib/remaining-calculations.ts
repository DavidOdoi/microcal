export type RemainingSlug =
  | 'personal-loan-calculator' | 'student-loan-calculator' | 'loan-comparison-calculator'
  | 'home-affordability-calculator' | 'refinance-calculator' | 'auto-loan-calculator' | 'lease-vs-buy-calculator'
  | 'investment-return-calculator' | 'retirement-calculator' | 'roth-ira-calculator'
  | 'income-tax-calculator' | 'capital-gains-tax-calculator' | 'debt-payoff-calculator' | 'net-worth-calculator';

export type InputValues = Record<string, number | string>;
export type CalculationOutput = { metrics: { label: string; value: string }[]; chart?: number[]; rows?: (string | number)[][]; tableHeaders?: string[]; note: string };

const usd = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(Number.isFinite(n) ? n : 0);
const clamp = (n: number, max = 1e12) => Number.isFinite(n) ? Math.min(max, Math.max(0, n)) : 0;
const n = (values: InputValues, key: string) => clamp(Number(values[key] ?? 0));
const text = (values: InputValues, key: string) => String(values[key] ?? '');
function payment(principal: number, apr: number, months: number): number {
  if (principal <= 0 || months <= 0) return 0;
  const r = clamp(apr, 100) / 1200;
  if (!r) return principal / months;
  const growth = Math.pow(1 + r, months);
  return Number.isFinite(growth) ? principal * r * growth / (growth - 1) : principal * r;
}
function amortization(principal: number, apr: number, months: number, extra = 0) {
  const pmt = payment(principal, apr, months);
  let balance = principal;
  let interestTotal = 0;
  let totalPaid = 0;
  const rows: (string | number)[][] = [];
  const chart = [balance];
  for (let month = 1; month <= Math.min(1200, months) && balance > 0; month += 1) {
    const starting = balance;
    const interest = balance * clamp(apr, 100) / 1200;
    const paid = Math.min(balance + interest, pmt + extra);
    const principalPaid = Math.max(0, paid - interest);
    balance = Math.max(0, balance - principalPaid);
    interestTotal += interest;
    totalPaid += paid;
    chart.push(balance);
    rows.push([month, usd(starting), usd(interest), usd(paid), usd(principalPaid), usd(balance)]);
  }
  return { payment: pmt, interest: interestTotal, totalPaid, monthsPaid: rows.length, balance, rows, chart };
}
function metric(label: string, value: string | number) { return { label, value: String(value) }; }
function standardDeduction(status: string) { return status === 'joint' ? 32200 : status === 'head' ? 24150 : 16100; }
const ordinaryBrackets = (status: string): [number, number][] => {
  if (status === 'joint') return [[24800,.1],[100800,.12],[211400,.22],[403550,.24],[512450,.32],[768700,.35],[Infinity,.37]];
  if (status === 'head') return [[17700,.1],[67450,.12],[105700,.22],[201750,.24],[256200,.32],[640600,.35],[Infinity,.37]];
  if (status === 'separate') return [[12400,.1],[50400,.12],[105700,.22],[201775,.24],[256225,.32],[384350,.35],[Infinity,.37]];
  return [[12400,.1],[50400,.12],[105700,.22],[201775,.24],[256225,.32],[640600,.35],[Infinity,.37]];
};
function ordinaryTax(taxable: number, status: string): number {
  const bands = ordinaryBrackets(status);
  let tax = 0; let floor = 0; let left = Math.max(0, taxable);
  for (const [cap, rate] of bands) { const inBand = Math.max(0, Math.min(left, cap - floor)); tax += inBand * rate; left -= inBand; floor = cap; if (left <= 0) break; }
  return tax;
}

export function calculateRemaining(slug: RemainingSlug, v: InputValues): CalculationOutput {
  switch (slug) {
    case 'personal-loan-calculator':
    case 'student-loan-calculator': {
      const feeMode = text(v, 'feeMode') || 'dollars';
      const feeTreatment = text(v, 'feeTreatment') || 'financed';
      const fee = Math.min(n(v, 'amount'), feeMode === 'percent' ? n(v, 'fee') * n(v, 'amount') / 100 : n(v, 'fee'));
      const principal = n(v, 'amount') + (feeTreatment === 'financed' ? fee : 0);
      const result = amortization(principal, n(v, 'rate'), Math.round(n(v, 'term') * (text(v, 'termUnit') === 'years' ? 12 : 1)), n(v, 'extra'));
      return { metrics: [metric('Estimated monthly payment', usd(result.payment)), metric('Total scheduled payments', usd(result.totalPaid)), metric('Total interest', usd(result.interest)), metric('Origination fee', usd(fee)), metric('Total borrowing cost', usd(result.interest + fee)), metric('Principal used for schedule', usd(principal))], chart: result.chart, rows: result.rows, tableHeaders: ['Month','Starting balance','Interest','Payment','Principal paid','Ending balance'], note: 'Fixed-rate monthly amortization estimate. Fees, deferment, income-driven terms, subsidies, capitalization, and lender-specific rules may change actual student or personal loan costs.' };
    }
    case 'loan-comparison-calculator': {
      const a = amortization(n(v,'amountA'), n(v,'rateA'), Math.round(n(v,'termA') * 12));
      const b = amortization(n(v,'amountB'), n(v,'rateB'), Math.round(n(v,'termB') * 12));
      const costA = a.interest + n(v,'feeA'); const costB = b.interest + n(v,'feeB');
      const rows = [['Offer A',usd(a.payment),usd(a.interest),usd(n(v,'feeA')),usd(costA),a.monthsPaid],['Offer B',usd(b.payment),usd(b.interest),usd(n(v,'feeB')),usd(costB),b.monthsPaid]];
      return { metrics: [metric('Lower estimated financing cost', costA === costB ? 'Same in this estimate' : costA < costB ? 'Offer A' : 'Offer B'), metric('Payment difference (A − B)', usd(a.payment - b.payment)), metric('Cost difference (A − B)', usd(costA - costB))], rows, tableHeaders: ['Offer','Monthly payment','Interest','Fees','Interest + fees','Payments'], chart: [a.payment,b.payment], note: 'Compare offers using consistent loan amounts and include lender fees. This model assumes fixed rates and monthly fully amortizing payments.' };
    }
    case 'home-affordability-calculator': {
      const income = n(v,'income') / 12; const debts = n(v,'debts'); const dti = Math.min(60, n(v,'dti')) / 100;
      const allowedHousing = Math.max(0, income * dti - debts);
      const rate = n(v,'rate'); const months = Math.min(1200, Math.round(n(v,'term')*12));
      const taxMonthlyPerDollar = n(v,'tax') / 100 / 12;
      const fixed = n(v,'insurance') + n(v,'hoa');
      let low = 0, high = 1e9;
      for (let i=0;i<60;i+=1) { const price=(low+high)/2; const loan=Math.max(0,price-n(v,'down')); const housing=payment(loan,rate,months)+price*taxMonthlyPerDollar+fixed; if(housing<=allowedHousing) low=price; else high=price; }
      const loan = Math.max(0,low-n(v,'down'));
      const pi=payment(loan,rate,months); const housing=pi+low*taxMonthlyPerDollar+fixed;
      return { metrics: [metric('Estimated maximum home price',usd(low)),metric('Estimated loan amount',usd(loan)),metric('Down payment entered',usd(Math.min(n(v,'down'),low))),metric('Principal and interest / month',usd(pi)),metric('Estimated housing cost / month',usd(housing)),metric('Front-end DTI used',`${(income ? housing/income*100 : 0).toFixed(1)}%`)], chart: [0,low*.25,low*.5,low*.75,low], note: 'Affordability estimate uses your DTI target and entered housing costs. It excludes many underwriting rules, closing costs, maintenance, utilities, mortgage insurance, taxes beyond the entered estimate, and lender approval criteria.' };
    }
    case 'refinance-calculator': {
      const balance=n(v,'balance'); const oldMonths=Math.round(n(v,'remaining')*12); const newMonths=Math.round(n(v,'newTerm')*12);
      const old=amortization(balance,n(v,'oldRate'),oldMonths); const next=amortization(balance,n(v,'newRate'),newMonths);
      const costs=n(v,'closing'); const monthlySavings=old.payment-next.payment; const breakEven=monthlySavings>0?Math.ceil(costs/monthlySavings):null;
      return { metrics:[metric('Current estimated payment',usd(old.payment)),metric('New estimated payment',usd(next.payment)),metric('Monthly payment change',usd(monthlySavings)),metric('Closing costs entered',usd(costs)),metric('Simple break-even',breakEven===null?'No payment break-even':`${breakEven} months`),metric('Interest difference over terms',usd(old.interest-next.interest-costs))], chart:[old.payment,next.payment], note:'Simple break-even divides entered closing costs by monthly payment reduction. It does not account for the old loan balance schedule, taxes, fees rolled into the balance, prepayment charges, or how long you keep the new loan.' };
    }
    case 'auto-loan-calculator': {
      const price=n(v,'price'); const tax=price*n(v,'tax')/100; const fees=n(v,'fees'); const down=n(v,'down'); const trade=n(v,'trade'); const rebate=n(v,'rebate');
      const amount=Math.max(0,price+tax+fees-down-trade-rebate); const r=amortization(amount,n(v,'rate'),Math.round(n(v,'term')*12));
      return { metrics:[metric('Amount financed',usd(amount)),metric('Estimated monthly payment',usd(r.payment)),metric('Total of loan payments',usd(r.totalPaid)),metric('Estimated total interest',usd(r.interest)),metric('Sales tax entered',usd(tax)),metric('Upfront cash / trade / rebate',usd(down+trade+rebate))], chart:r.chart, rows:r.rows, tableHeaders:['Month','Starting balance','Interest','Payment','Principal paid','Ending balance'], note:'Estimate assumes a fixed-rate monthly loan. Taxes are applied to the vehicle price as entered; local tax rules, trade-in treatment, dealer products, registration charges, and lender fees vary.' };
    }
    case 'lease-vs-buy-calculator': {
      const months=Math.max(1,Math.min(120,Math.round(n(v,'months')))); const lease=n(v,'leasePayment')*months+n(v,'leaseDue')+n(v,'leaseFees')+n(v,'mileageFee')+n(v,'leaseMaintenance')*months;
      const financed=Math.max(0,n(v,'price')-n(v,'down')); const buy=amortization(financed,n(v,'rate'),months); const ownership= n(v,'down')+buy.totalPaid+n(v,'buyMaintenance')*months-n(v,'resale');
      return { metrics:[metric('Estimated lease cost for term',usd(lease)),metric('Estimated buy cost after resale',usd(ownership)),metric('Cost difference (lease − buy)',usd(lease-ownership)),metric('Lease monthly payment',usd(n(v,'leasePayment'))),metric('Buy loan payment',usd(buy.payment)),metric('Estimated resale value',usd(n(v,'resale')))], chart:[lease,ownership], note:'Comparison spans the entered lease term. Buying cost includes the down payment, loan payments, entered maintenance, and estimated resale value; it excludes insurance, taxes not entered, financing fees, vehicle depreciation uncertainty, and time value of money.' };
    }
    case 'investment-return-calculator':
    case 'roth-ira-calculator': {
      const start=n(v,'start'); const monthly=n(v,'contribution'); const years=Math.min(100,n(v,'years')); const months=Math.round(years*12); const rate=(n(v,'return')-n(v,'fee'))/100; const mr=Math.pow(1+rate,1/12)-1;
      let balance=start; const chart=[balance]; const rows:(string|number)[][]=[]; let invested=start;
      for(let i=1;i<=months;i+=1){ if(text(v,'timing')==='beginning') balance+=monthly; balance*=1+mr; if(text(v,'timing')!=='beginning') balance+=monthly; invested+=monthly; if(i%12===0||i===months){rows.push([i/12,usd(invested),usd(balance),usd(balance-invested)]); chart.push(balance);} }
      const inflation=n(v,'inflation')/100; const real=balance/Math.pow(1+inflation,years);
      return { metrics:[metric('Projected ending balance',usd(balance)),metric('Total contributions',usd(invested)),metric('Estimated growth',usd(balance-invested)),metric('Inflation-adjusted value',usd(real)),metric('Assumed net annual return',`${rate.toFixed(2)}%`)], chart, rows, tableHeaders:['Year','Contributed','Projected balance','Growth'], note:slug==='roth-ira-calculator'?'Illustration assumes contributions qualify, remain invested, and grow at a constant assumed return. Roth IRA eligibility, contribution limits, withdrawal rules, taxes, and fees depend on current law and personal circumstances; this is not an eligibility test.':'Investment returns are uncertain and may be negative. The estimate applies a constant return and monthly contributions; it does not model volatility, taxes, asset allocation, or actual fund expenses beyond the entered fee.' };
    }
    case 'retirement-calculator': {
      const years=Math.max(0,Math.min(80,n(v,'retireYears'))); const months=years*12; const rate=n(v,'growth')/100/12; let balance=n(v,'savings'); const chart=[balance];
      for(let m=0;m<months;m+=1){balance=balance*(1+rate)+n(v,'contribution');if(m%12===11)chart.push(balance);}
      const annualNeed=Math.max(0,n(v,'spending')*12-n(v,'socialSecurity')*12); const withdrawalMonths=Math.max(1,Math.round(n(v,'retirementYears')*12)); const drawRate=n(v,'retirementReturn')/1200; const sustainable=drawRate>0?balance*drawRate/(1-Math.pow(1+drawRate,-withdrawalMonths)):balance/withdrawalMonths;
      return {metrics:[metric('Projected savings at retirement',usd(balance)),metric('Monthly spending goal',usd(n(v,'spending'))),metric('Monthly Social Security / pension',usd(n(v,'socialSecurity'))),metric('Monthly amount needed from savings',usd(annualNeed/12)),metric('Estimated portfolio-supported monthly draw',usd(sustainable)),metric('Difference vs goal',usd(sustainable-annualNeed/12))],chart,note:'Projection assumes steady contributions and returns before and during retirement. It excludes taxes, inflation unless reflected in your spending estimate, market volatility, healthcare shocks, and benefit eligibility; it is not a guaranteed safe withdrawal rate.'};
    }
    case 'income-tax-calculator': {
      const status=text(v,'status'); const gross=n(v,'income'); const deduction=text(v,'deduction')==='itemized'?n(v,'itemized'):standardDeduction(status); const taxable=Math.max(0,gross-deduction); const tax=ordinaryTax(taxable,status); const marginal=ordinaryBrackets(status).find(([cap])=>taxable<=cap)?.[1]??.37;
      return {metrics:[metric('Estimated federal income tax',usd(tax)),metric('Taxable income estimate',usd(taxable)),metric('Standard / entered deduction',usd(deduction)),metric('Average rate on gross income',`${(gross?tax/gross*100:0).toFixed(2)}%`),metric('Marginal bracket rate',`${(marginal*100).toFixed(0)}%`),metric('After-tax income estimate',usd(gross-tax))],note:'Uses 2026 federal ordinary income brackets and the standard deduction for the selected filing status, or your entered itemized deduction. Excludes credits, payroll taxes, state/local tax, qualified dividends, capital gains, and many deductions; not a tax return.'};
    }
    case 'capital-gains-tax-calculator': {
      const status=text(v,'status'); const ordinary=n(v,'taxableIncome'); const gain=n(v,'gain'); const isLong=text(v,'holding')==='long';
      const ordinaryCost=ordinaryTax(ordinary,status); let gainTax:number;
      if(!isLong) gainTax=ordinaryTax(ordinary+gain,status)-ordinaryCost;
      else { const zero=status==='joint'?98900:status==='head'?66200:status==='separate'?49450:49450; const top=status==='joint'?613700:status==='head'?579600:status==='separate'?306850:545500; const at0=Math.max(0,Math.min(gain,zero-ordinary)); const at15=Math.max(0,Math.min(gain-at0,top-Math.max(ordinary,zero))); const at20=Math.max(0,gain-at0-at15); gainTax=at15*.15+at20*.2; }
      return {metrics:[metric('Estimated federal tax on gain',usd(gainTax)),metric('Gain entered',usd(gain)),metric('Estimated after-tax gain',usd(gain-gainTax)),metric('Holding period',isLong?'Long-term scenario':'Short-term scenario'),metric('Ordinary taxable income',usd(ordinary)),metric('Effective rate on entered gain',`${(gain?gainTax/gain*100:0).toFixed(2)}%`)],note:'2026 federal estimate only. Long-term rate bands use filing status and ordinary taxable income entered; short-term gains are added to ordinary income. Excludes state tax, net investment income tax, collectibles, depreciation recapture, losses, special exclusions, and other adjustments.'};
    }
    case 'debt-payoff-calculator': {
      const debts=[{name:'Debt 1',bal:n(v,'balance1'),rate:n(v,'rate1')},{name:'Debt 2',bal:n(v,'balance2'),rate:n(v,'rate2')},{name:'Debt 3',bal:n(v,'balance3'),rate:n(v,'rate3')}].filter((d)=>d.bal>0);
      const budget=n(v,'budget'); const mode=text(v,'strategy'); let months=0,totalInterest=0; const chart=[debts.reduce((s,d)=>s+d.bal,0)]; const rows:(string|number)[][]=[]; const remaining=debts.map((d)=>({...d}));
      while(remaining.some((d)=>d.bal>0.01)&&months<1200&&budget>0){months++; for(const d of remaining)d.bal+=d.bal*d.rate/1200; const interest=remaining.reduce((s,d)=>s+d.bal*d.rate/1200,0); totalInterest+=interest; const mins=remaining.reduce((s,d)=>s+Math.min(d.bal,Math.max(25,d.bal*.02)),0); if(budget<mins)break; let available=budget-mins; for(const d of remaining)d.bal-=Math.min(d.bal,Math.max(25,d.bal*.02)); const ordered=[...remaining].sort((a,b)=>mode==='snowball'?a.bal-b.bal:b.rate-a.rate); for(const d of ordered){const extra=Math.min(d.bal,available); d.bal-=extra;available-=extra;} const total=remaining.reduce((s,d)=>s+d.bal,0); chart.push(total); if(months%3===0||total<.01)rows.push([months,usd(total),usd(interest)]); }
      const payoff=remaining.every((d)=>d.bal<=.01);
      return {metrics:[metric('Payoff estimate',payoff?`${months} months`:'Payment does not cover modeled minimums'),metric('Monthly debt budget',usd(budget)),metric('Strategy',mode==='snowball'?'Snowball: smallest balance first':'Avalanche: highest rate first'),metric('Estimated remaining balance',usd(remaining.reduce((s,d)=>s+d.bal,0))),metric('Interest estimate',usd(totalInterest))],chart,rows,tableHeaders:['Month','Combined balance','Interest estimate'],note:'Illustration uses three debts and a minimum payment of the greater of $25 or 2% of each current balance. Real creditor minimums, fees, promotional rates, and payment allocation vary; replace these assumptions with current statements.'};
    }
    case 'net-worth-calculator': {
      const assets=['cash','investments','home','vehicles','retirement','otherAssets'].reduce((s,k)=>s+n(v,k),0); const debts=['mortgage','studentDebt','autoDebt','cards','otherDebt'].reduce((s,k)=>s+n(v,k),0); const liquid=n(v,'cash')+n(v,'investments');
      return {metrics:[metric('Total assets',usd(assets)),metric('Total liabilities',usd(debts)),metric('Estimated net worth',usd(assets-debts)),metric('Cash and investments',usd(liquid)),metric('Debt-to-asset ratio',`${(assets?debts/assets*100:0).toFixed(1)}%`)],chart:[assets,debts,assets-debts],note:'Snapshot of the values and balances entered on the same date. Home, vehicle, and investment values are estimates; net worth is not the same as cash available to spend and does not account for taxes or selling costs.'};
    }
  }
}
