'use client';

import { useState } from 'react';
import { Check, Copy, RotateCcw } from 'lucide-react';
import { remainingPages } from '@/lib/remaining-pages';
import { calculateRemaining, type InputValues, type RemainingSlug } from '@/lib/remaining-calculations';

const usd = (n: number) => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:2}).format(Number.isFinite(n)?n:0);
function Chart({ values, title }: { values:number[]; title:string }) {
  if (!values.length) return null;
  const min=Math.min(0,...values), max=Math.max(1,...values), span=max-min||1;
  const points=values.map((v,i)=>`${values.length===1?50:i/(values.length-1)*100},${49-(v-min)/span*43}`).join(' ');
  return <div className="cd-chart-wrap"><h3>{title}</h3><svg className="cd-chart" viewBox="0 0 100 55" role="img" aria-label={title}><line x1="0" y1="49" x2="100" y2="49"/><polyline points={points}/></svg><div className="cd-chart-labels"><span>Initial</span><span>Projected</span></div></div>;
}

export function RemainingCalculator({ slug }: { slug: RemainingSlug }) {
  const page=remainingPages[slug];
  const initial=Object.fromEntries(page.fields.map((field)=>[field.key,field.value]));
  const [values,setValues]=useState<Record<string,string>>(initial);
  const inputValues:InputValues=values;
  const result=calculateRemaining(slug,inputValues);
  const errors=page.fields.filter((field)=>field.type!=='select').filter((field)=>{
    const raw=values[field.key]??''; const parsed=Number(raw);
    return raw.trim()===''||!Number.isFinite(parsed)||parsed<0||(field.max!==undefined&&parsed>Number(field.max));
  }).map((field)=>`${field.label}: enter a value from 0${field.max?` to ${field.max}`:''}.`);
  const copy=`${page.name}\n${result.metrics.map((item)=>`${item.label}: ${item.value}`).join('\n')}`;
  const [copied,setCopied]=useState(false);
  return <div className="finance-calculator-grid">
    <section className="finance-input-panel"><div className="finance-panel-heading"><div><span className="finance-kicker">Interactive estimate</span><h2>Enter your details</h2></div><div className="finance-utilities"><button className="finance-utility-button" type="button" onClick={()=>setValues({...initial})}><RotateCcw size={15}/>Reset</button><button className="finance-utility-button" type="button" onClick={async()=>{try{await navigator.clipboard.writeText(copy);setCopied(true);window.setTimeout(()=>setCopied(false),1500);}catch{setCopied(false);}}}>{copied?<Check size={15}/>:<Copy size={15}/>} {copied?'Copied':'Copy results'}</button></div></div>
      <div className="finance-fields">{page.fields.map((field)=>{const id=`remaining-${slug}-${field.key}`;return field.type==='select'?<label className="finance-field" key={field.key} htmlFor={id}><span>{field.label}</span><select id={id} value={values[field.key]??field.value} onChange={(e)=>setValues((old)=>({...old,[field.key]:e.target.value}))}>{field.options?.map(([value,label])=><option value={value} key={value}>{label}</option>)}</select>{field.help&&<small>{field.help}</small>}</label>:<label className="finance-field" key={field.key} htmlFor={id}><span>{field.label}</span><input id={id} type="number" inputMode="decimal" min="0" max={field.max} step={field.step??'any'} value={values[field.key]??field.value} onChange={(e)=>setValues((old)=>({...old,[field.key]:e.target.value}))}/>{field.help&&<small>{field.help}</small>}</label>;})}</div>
    </section>
    <section className="finance-results-panel" aria-live="polite"><span className="finance-kicker">Your estimate</span><h2>{page.name.replace(' Calculator','')} results</h2>{errors.length>0&&<div className="finance-note warning" role="alert"><strong>Check the highlighted values:</strong><ul>{errors.map((error)=><li key={error}>{error}</li>)}</ul></div>}
      <div className="finance-result-grid">{result.metrics.map((item,index)=><div className={index===0?'finance-result-metric primary':'finance-result-metric'} key={item.label}><span>{item.label}</span><strong>{item.value}</strong></div>)}</div>
      {result.chart&&<Chart values={result.chart} title={`${page.name} projection`}/>}
      {result.rows&&result.tableHeaders&&<details className="finance-schedule"><summary>View projection schedule ({result.rows.length} rows)</summary><div className="finance-table-wrap"><table><thead><tr>{result.tableHeaders.map((header)=><th key={header}>{header}</th>)}</tr></thead><tbody>{result.rows.map((row,i)=><tr key={i}>{row.map((cell,j)=><td key={j}>{cell}</td>)}</tr>)}</tbody></table></div></details>}
      <p className="finance-note">{result.note}</p>
    </section>
  </div>;
}
