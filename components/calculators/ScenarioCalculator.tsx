'use client';

import { useState, type FormEvent, type KeyboardEvent, type ReactNode } from 'react';
import { Calculator, RotateCcw } from 'lucide-react';
import { CalculatorLayout, CalculatorNumberField, PaymentSummary } from './CalculatorDesign';

export type ScenarioValues = Record<string, string>;
export type ScenarioField = { key: string; label: string; value: string; type?: 'number' | 'date'; optional?: boolean; unit?: string; prefix?: string; min?: number; max?: number; step?: string; help?: string; advanced?: boolean; section?: string; options?: [string, string][] };
export type ScenarioResult = { summary: { label: string; amount: string; period: string }; secondarySummary?: { label: string; amount: string; period: string }; metrics: [string, string][]; notes?: string[]; summaryVisual?: ReactNode; schedule?: { caption: string; headers: string[]; rows: string[][] } };
export const scenarioMoney = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

/** Shared explicit-submit form for planning calculators; math stays in lib. */
export function ScenarioCalculator({ id, title, action = 'Calculate', fields, compute, validate, copyResults = false }: {
  id: string; title: string; action?: string; fields: ScenarioField[];
  compute: (values: ScenarioValues) => ScenarioResult;
  validate?: (values: ScenarioValues) => string[];
  copyResults?: boolean;
}) {
  const defaults = Object.fromEntries(fields.map((field) => [field.key, field.value]));
  const [values, setValues] = useState(defaults);
  const [submitted, setSubmitted] = useState(defaults);
  const [errors, setErrors] = useState<string[]>([]);
  const [copyStatus, setCopyStatus] = useState('');
  const [activeSection, setActiveSection] = useState(0);
  const [invalidField, setInvalidField] = useState<string | null>(null);
  const sections = Array.from(new Set(fields.map(field => field.section ?? 'Details')));
  const hasTabs = sections.length > 1;
  const result = compute(submitted);
  const changed = JSON.stringify(values) !== JSON.stringify(submitted);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const invalid = fields.flatMap((field) => {
      const raw = values[field.key];
      if (field.optional && raw.trim() === '') return [];
      if (field.type === 'date') {
        const parsed = new Date(`${raw}T00:00:00Z`);
        return /^\d{4}-\d{2}-\d{2}$/.test(raw) && Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === raw ? [] : [{ field, message: `${field.label}: enter a valid calendar date.` }];
      }
      if (field.options) return field.options.some(([value]) => value === raw) ? [] : [{ field, message: `Choose a valid ${field.label.toLowerCase()}.` }];
      const number = Number(raw);
      return raw.trim() === '' || !Number.isFinite(number) || number < (field.min ?? 0) || number > (field.max ?? 1e9) || (field.step === '1' && !Number.isInteger(number))
        ? [{ field, message: `${field.label}: enter ${field.step === '1' ? 'a whole number' : 'a number'} from ${field.min ?? 0} to ${field.max ?? 1e9}.` }] : [];
    });
    const allErrors = invalid.length ? invalid.map(({ message }) => message) : validate?.(values) ?? [];
    if (hasTabs) setInvalidField(invalid[0]?.field.key ?? null);
    if (hasTabs && invalid.length) setActiveSection(sections.indexOf(invalid[0].field.section ?? 'Details'));
    setErrors(allErrors);
    setCopyStatus('');
    if (!allErrors.length) setSubmitted({ ...values });
  }
  function moveTab(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const offsets: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1 };
    const offset = offsets[event.key];
    if (offset === undefined && event.key !== 'Home' && event.key !== 'End') return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? sections.length - 1 : (index + offset + sections.length) % sections.length;
    setActiveSection(next);
    event.currentTarget.parentElement?.querySelectorAll('button')[next]?.focus();
  }
  function renderField(field: ScenarioField) {
    const change = (value: string) => {
      setValues((previous) => ({ ...previous, [field.key]: value }));
      setCopyStatus('');
    };
    return <div key={field.key}>{field.type === 'date'
      ? <label className="finance-field"><span>{field.label}</span><input type="date" value={values[field.key]} onChange={(event) => change(event.target.value)} /></label>
      : field.options
      ? <label className="finance-field"><span>{field.label}</span><select value={values[field.key]} onChange={(event) => change(event.target.value)}>{field.options.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
      : <CalculatorNumberField label={field.label} value={values[field.key]} onChange={change} unit={field.unit} prefix={field.prefix} min={field.min} max={field.max ?? 1e9} step={field.step} />}
      {field.help && <p className="finance-note">{field.help}</p>}</div>;
  }
  function renderFields(sectionFields: ScenarioField[]) {
    const advanced = sectionFields.filter(field => field.advanced);
    return <div className="finance-fields">
      {sectionFields.filter(field => !field.advanced).map(renderField)}
      {advanced.length > 0 && <details className="finance-advanced" open={advanced.some(field => field.key === invalidField) || undefined}>
        <summary>Advanced settings</summary><div className="finance-fields">{advanced.map(renderField)}</div>
      </details>}
    </div>;
  }
  async function copy() {
    const { summary, metrics, notes } = result;
    const lines = [title, `${summary.label}: ${summary.amount} ${summary.period.toLowerCase()}`, ...metrics.map(([label, value]) => `${label}: ${value}`), ...(notes ?? [])];
    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      setCopyStatus('Paycheck results copied.');
    } catch {
      setCopyStatus('Clipboard access was unavailable. You can select and copy the results.');
    }
  }
  return <CalculatorLayout id={id}>
    <form className="finance-input-panel" onSubmit={submit} noValidate>
      {hasTabs ? <>
        <div className="finance-scenario-tabs" role="tablist" aria-label="Paycheck inputs">
          {sections.map((section, index) => <button key={section} type="button" role="tab"
            id={`${id}-tab-${index}`} aria-selected={activeSection === index} aria-controls={`${id}-panel-${index}`}
            tabIndex={activeSection === index ? 0 : -1} onClick={() => setActiveSection(index)}
            onKeyDown={event => moveTab(event, index)}>{section}</button>)}
        </div>
        {sections.map((section, index) => <div key={section} role="tabpanel" id={`${id}-panel-${index}`}
          aria-labelledby={`${id}-tab-${index}`} hidden={activeSection !== index}>
          <h2>{section}</h2>
          {renderFields(fields.filter(field => (field.section ?? 'Details') === section))}
        </div>)}
      </> : <><h2>Enter your details</h2>{renderFields(fields)}</>}
      <div className="calculator-form-actions"><button className="calculator-calculate" type="submit"><Calculator size={18} aria-hidden="true" />{action}</button><button className="calculator-reset" type="button" onClick={() => { setValues({ ...defaults }); setSubmitted({ ...defaults }); setErrors([]); setCopyStatus(''); setInvalidField(null); setActiveSection(0); }}><RotateCcw size={17} aria-hidden="true" />Reset</button></div>
      {errors.length > 0 && <div className="calculator-status error" role="alert"><ul>{errors.map((error) => <li key={error}>{error}</li>)}</ul></div>}
    </form>
    <section className="finance-results-panel" aria-label={title} aria-live="polite"><h2>{title}</h2>
      {result.summaryVisual ?? <PaymentSummary {...result.summary} />}
      {result.secondarySummary && <PaymentSummary {...result.secondarySummary} />}
      <dl className="finance-breakdown">{result.metrics.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
      {changed && <p className="calculator-status">Inputs changed. Select {action} to update your results.</p>}
      {result.notes?.map((note) => <p className="finance-note" key={note}>{note}</p>)}
      {copyResults && <div className="calculator-form-actions">
        <button className="calculator-reset" type="button" disabled={changed} onClick={copy}>Copy results</button>
        {copyStatus && <p className="finance-note">{copyStatus}</p>}
      </div>}
      {result.schedule && <details className="finance-schedule"><summary>View calculation details</summary><div className="finance-table-wrap"><table><caption>{result.schedule.caption}</caption><thead><tr>{result.schedule.headers.map((header) => <th scope="col" key={header}>{header}</th>)}</tr></thead><tbody>{result.schedule.rows.map((row, index) => <tr key={index}>{row.map((cell, column) => <td key={column}>{cell}</td>)}</tr>)}</tbody></table></div></details>}
    </section>
  </CalculatorLayout>;
}
