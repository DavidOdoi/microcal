'use client';

import { useState, type FormEvent } from 'react';
import { Calculator, RotateCcw } from 'lucide-react';
import { CalculatorLayout, CalculatorNumberField, PaymentSummary } from './CalculatorDesign';

export type ScenarioValues = Record<string, string>;
export type ScenarioField = { key: string; label: string; value: string; unit?: string; prefix?: string; min?: number; max?: number; step?: string; help?: string; advanced?: boolean; options?: [string, string][] };
export type ScenarioResult = { summary: { label: string; amount: string; period: string }; metrics: [string, string][]; notes?: string[]; schedule?: { caption: string; headers: string[]; rows: string[][] } };
export const scenarioMoney = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

/** Shared explicit-submit form for planning calculators; math stays in lib. */
export function ScenarioCalculator({ id, title, action = 'Calculate', fields, compute, validate }: {
  id: string; title: string; action?: string; fields: ScenarioField[];
  compute: (values: ScenarioValues) => ScenarioResult;
  validate?: (values: ScenarioValues) => string[];
}) {
  const defaults = Object.fromEntries(fields.map((field) => [field.key, field.value]));
  const [values, setValues] = useState(defaults);
  const [submitted, setSubmitted] = useState(defaults);
  const [errors, setErrors] = useState<string[]>([]);
  const result = compute(submitted);
  const changed = JSON.stringify(values) !== JSON.stringify(submitted);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const invalid = fields.flatMap((field) => {
      const raw = values[field.key];
      if (field.options) return field.options.some(([value]) => value === raw) ? [] : [`Choose a valid ${field.label.toLowerCase()}.`];
      const number = Number(raw);
      return raw.trim() === '' || !Number.isFinite(number) || number < (field.min ?? 0) || number > (field.max ?? 1e9) || (field.step === '1' && !Number.isInteger(number))
        ? [`${field.label}: enter ${field.step === '1' ? 'a whole number' : 'a number'} from ${field.min ?? 0} to ${field.max ?? 1e9}.`] : [];
    });
    const allErrors = invalid.length ? invalid : validate?.(values) ?? [];
    setErrors(allErrors);
    if (!allErrors.length) setSubmitted({ ...values });
  }
  function renderField(field: ScenarioField) {
    const change = (value: string) => setValues((previous) => ({ ...previous, [field.key]: value }));
    return <div key={field.key}>{field.options
      ? <label className="finance-field"><span>{field.label}</span><select value={values[field.key]} onChange={(event) => change(event.target.value)}>{field.options.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
      : <CalculatorNumberField label={field.label} value={values[field.key]} onChange={change} unit={field.unit} prefix={field.prefix} min={field.min} max={field.max ?? 1e9} step={field.step} />}
      {field.help && <p className="finance-note">{field.help}</p>}</div>;
  }
  return <CalculatorLayout id={id}>
    <form className="finance-input-panel" onSubmit={submit} noValidate>
      <h2>Enter your details</h2><div className="finance-fields">
        {fields.filter((field) => !field.advanced).map(renderField)}
        {fields.some((field) => field.advanced) && <details className="finance-advanced"><summary>Advanced settings</summary><div className="finance-fields">{fields.filter((field) => field.advanced).map(renderField)}</div></details>}
      </div>
      <div className="calculator-form-actions"><button className="calculator-calculate" type="submit"><Calculator size={18} aria-hidden="true" />{action}</button><button className="calculator-reset" type="button" onClick={() => { setValues({ ...defaults }); setSubmitted({ ...defaults }); setErrors([]); }}><RotateCcw size={17} aria-hidden="true" />Reset</button></div>
      {errors.length > 0 && <div className="calculator-status error" role="alert"><ul>{errors.map((error) => <li key={error}>{error}</li>)}</ul></div>}
    </form>
    <section className="finance-results-panel" aria-label={title} aria-live="polite"><h2>{title}</h2>
      <PaymentSummary {...result.summary} />
      <dl className="finance-breakdown">{result.metrics.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
      {changed && <p className="calculator-status">Inputs changed. Select {action} to update your results.</p>}
      {result.notes?.map((note) => <p className="finance-note" key={note}>{note}</p>)}
      {result.schedule && <details className="finance-schedule"><summary>View calculation details</summary><div className="finance-table-wrap"><table><caption>{result.schedule.caption}</caption><thead><tr>{result.schedule.headers.map((header) => <th scope="col" key={header}>{header}</th>)}</tr></thead><tbody>{result.schedule.rows.map((row, index) => <tr key={index}>{row.map((cell, column) => <td key={column}>{cell}</td>)}</tr>)}</tbody></table></div></details>}
    </section>
  </CalculatorLayout>;
}
