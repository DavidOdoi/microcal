import type { ReactNode } from 'react';
import { CalendarDays } from 'lucide-react';

/** Shared structure for existing and future calculator interfaces. */
export function CalculatorLayout({ children, id, className = '' }: { children: ReactNode; id?: string; className?: string }) {
  return <div id={id} className={`finance-calculator-grid ${className}`}>{children}</div>;
}

export function CalculatorNumberField({ label, value, onChange, unit, prefix, min = 0, max, step = 'any' }: {
  label: string; value: string; onChange: (value: string) => void;
  unit?: string; prefix?: string; min?: number; max?: number; step?: string;
}) {
  return <label className="finance-field">
    <span>{label}</span>
    <span className="calculator-input-group">
      {prefix && <span className="calculator-input-prefix" aria-hidden="true">{prefix}</span>}
      <input type="number" inputMode="decimal" aria-label={unit ? `${label} (${unit})` : label} min={min} max={max} step={step} value={value} onChange={(event) => onChange(event.target.value)} />
      {unit && <span className="calculator-input-unit" aria-hidden="true">{unit}</span>}
    </span>
  </label>;
}

export function PaymentSummary({ label, amount, period, secondary = false }: {
  label: string; amount: string; period: string; secondary?: boolean;
}) {
  return <div className={`calculator-payment-summary${secondary ? ' secondary' : ''}`}>
    <CalendarDays size={23} aria-hidden="true" />
    <div><span>{label}</span><strong>{amount}</strong></div>
    <span className="calculator-period">{period}</span>
  </div>;
}
