import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateRemaining, type InputValues, type RemainingSlug } from './remaining-calculations.ts';
import { remainingPages } from './remaining-pages.ts';

function run(slug: RemainingSlug, overrides: InputValues = {}) {
  const values = Object.fromEntries(remainingPages[slug].fields.map((field) => [field.key, field.value]));
  return calculateRemaining(slug, { ...values, ...overrides });
}
function metricValue(slug:RemainingSlug, label:string, overrides:InputValues={}) { return run(slug,overrides).metrics.find((m)=>m.label===label)?.value ?? ''; }
function moneyNumber(value:string){return Number(value.replace(/[$,]/g,''));}
function near(actual:number,expected:number,epsilon=.02){assert.ok(Math.abs(actual-expected)<=epsilon,`${actual} differs from ${expected}`);}

test('all remaining catalog calculators have distinct results, FAQ content, and usable input defaults',()=>{
  assert.equal(Object.keys(remainingPages).length,14);
  for(const [slug,page] of Object.entries(remainingPages)){
    assert.equal(page.faqs.length,3,`${slug} needs exactly three FAQs`);
    assert.ok(page.fields.length>=3,`${slug} needs functional inputs`);
    const output=calculateRemaining(slug as RemainingSlug,Object.fromEntries(page.fields.map((f)=>[f.key,f.value])));
    assert.ok(output.metrics.length>=2,`${slug} should return useful results`);
    assert.ok(output.metrics.every((m)=>!m.value.includes('NaN')&&!m.value.includes('Infinity')),`${slug} returned a non-finite result`);
  }
});

test('personal and student loan calculators match fixed-rate amortization examples',()=>{
  near(moneyNumber(metricValue('personal-loan-calculator','Estimated monthly payment')),484.01);
  near(moneyNumber(metricValue('student-loan-calculator','Estimated monthly payment')),277.55);
  const fee=run('personal-loan-calculator',{fee:'3',feeMode:'percent',feeTreatment:'financed'});
  assert.ok(moneyNumber(fee.metrics[0].value)>484.01); assert.ok(moneyNumber(fee.metrics[4].value)>0);
});

test('loan comparison changes with rate, term, and fees',()=>{
  const result=run('loan-comparison-calculator',{amountA:'20000',rateA:'8',termA:'3',feeA:'300',amountB:'20000',rateB:'7.5',termB:'4',feeB:'700'});
  assert.equal(result.rows?.length,2); assert.ok(result.metrics.some((m)=>m.label==='Lower estimated financing cost'));
  assert.ok(Number.isFinite(moneyNumber(result.metrics[2].value)));
});

test('home affordability accounts for debts, down payment, interest, taxes, and housing costs',()=>{
  const baseline=run('home-affordability-calculator');
  const lower=run('home-affordability-calculator',{debts:'2000',rate:'8',tax:'2',insurance:'300',hoa:'200'});
  assert.ok(moneyNumber(baseline.metrics[0].value)>0); assert.ok(moneyNumber(lower.metrics[0].value)<moneyNumber(baseline.metrics[0].value));
});

test('refinance estimate reports payment savings and break-even only when payment falls',()=>{
  const result=run('refinance-calculator');
  assert.ok(moneyNumber(result.metrics[2].value)>0); assert.notEqual(result.metrics[4].value,'No payment break-even');
  const worse=run('refinance-calculator',{newRate:'9'});
  assert.equal(worse.metrics[4].value,'No payment break-even');
});

test('auto loan computes amount financed and caps inputs at nonnegative finite amounts',()=>{
  const result=run('auto-loan-calculator');
  near(moneyNumber(result.metrics[0].value),31_120);
  assert.ok(moneyNumber(result.metrics[1].value)>0); assert.ok(result.rows && result.rows.length===60);
  const sanitized=run('auto-loan-calculator',{price:'-1e40',rate:'-4'});
  assert.ok(sanitized.metrics.every((m)=>!m.value.includes('NaN')));
});

test('lease and buy compare costs across the same term and include resale estimate',()=>{
  const result=run('lease-vs-buy-calculator');
  assert.ok(result.metrics.every((m)=>m.value.length>0)); assert.equal(result.chart?.length,2);
  const noResale=run('lease-vs-buy-calculator',{resale:'0'});
  assert.ok(moneyNumber(noResale.metrics[1].value)>moneyNumber(result.metrics[1].value));
});

test('investment and Roth projections handle monthly contributions, timing, fees, and inflation',()=>{
  const result=calculateRemaining('investment-return-calculator',{start:'10000',contribution:'0',return:'4',fee:'0',years:'2',inflation:'0',timing:'end'});
  near(moneyNumber(result.metrics[0].value),10_816);
  const roth=run('roth-ira-calculator',{contribution:'500',years:'25'});
  assert.ok(moneyNumber(roth.metrics[0].value)>10_000); assert.ok(moneyNumber(roth.metrics[1].value)>0);
  const timing=run('investment-return-calculator',{timing:'beginning'});
  assert.ok(moneyNumber(timing.metrics[0].value)>moneyNumber(run('investment-return-calculator').metrics[0].value));
});

test('retirement projection models accumulation and monthly portfolio income',()=>{
  const result=run('retirement-calculator');
  assert.ok(moneyNumber(result.metrics[0].value)>120_000);
  assert.ok(moneyNumber(result.metrics[4].value)>0);
  const noSavings=run('retirement-calculator',{savings:'0',contribution:'0',growth:'0'});
  assert.equal(moneyNumber(noSavings.metrics[0].value),0);
});

test('2026 federal tax estimate applies standard deduction and progressive bracket rates',()=>{
  const result=calculateRemaining('income-tax-calculator',{income:'75000',status:'single',deduction:'standard',itemized:'0'});
  near(moneyNumber(result.metrics[0].value),7_670);
  assert.equal(result.metrics[1].value,'$58,900.00');
  assert.equal(result.metrics[4].value,'22%');
  const zero=calculateRemaining('income-tax-calculator',{income:'10000',status:'single',deduction:'standard',itemized:'0'});
  assert.equal(moneyNumber(zero.metrics[0].value),0);
});

test('capital-gains estimate stacks long-term rates above ordinary taxable income and handles short-term rates',()=>{
  const long=calculateRemaining('capital-gains-tax-calculator',{gain:'20000',taxableIncome:'60000',holding:'long',status:'single'});
  near(moneyNumber(long.metrics[0].value),3_000);
  const short=calculateRemaining('capital-gains-tax-calculator',{gain:'20000',taxableIncome:'60000',holding:'short',status:'single'});
  near(moneyNumber(short.metrics[0].value),4_400);
  const zeroBand=calculateRemaining('capital-gains-tax-calculator',{gain:'10000',taxableIncome:'20000',holding:'long',status:'single'});
  assert.equal(moneyNumber(zeroBand.metrics[0].value),0);
});

test('debt snowball and avalanche schedules stay finite and avalanche lowers interest in a known scenario',()=>{
  const inputs={balance1:'5000',rate1:'18',balance2:'3000',rate2:'12',balance3:'1000',rate3:'24',budget:'600'};
  const avalanche=calculateRemaining('debt-payoff-calculator',{...inputs,strategy:'avalanche'});
  const snowball=calculateRemaining('debt-payoff-calculator',{...inputs,strategy:'snowball'});
  assert.ok(avalanche.rows && avalanche.chart); assert.ok(moneyNumber(avalanche.metrics[4].value)<=moneyNumber(snowball.metrics[4].value));
  const impossible=calculateRemaining('debt-payoff-calculator',{...inputs,budget:'1'});
  assert.ok(impossible.metrics[0].value.includes('Payment does not cover'));
});

test('net worth subtracts liabilities and remains meaningful when assets are zero',()=>{
  const result=calculateRemaining('net-worth-calculator',{cash:'12000',investments:'18000',home:'300000',vehicles:'22000',retirement:'85000',otherAssets:'5000',mortgage:'240000',studentDebt:'18000',autoDebt:'10000',cards:'2500',otherDebt:'0'});
  assert.equal(result.metrics[0].value,'$442,000.00'); assert.equal(result.metrics[1].value,'$270,500.00'); assert.equal(result.metrics[2].value,'$171,500.00');
  const zero=calculateRemaining('net-worth-calculator',{}); assert.equal(zero.metrics[2].value,'$0.00');
});
