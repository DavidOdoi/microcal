import type { ReactNode } from 'react';
import { ShieldCheck } from 'lucide-react';

export function CalculatorTemplate({
  inputs,
  results,
  guide,
}: {
  inputs: ReactNode;
  results?: ReactNode;
  guide?: ReactNode;
}) {
  return (
    <div className="container-site calculator-shell">
      {results ? <div className="calculator-grid">
        <section className="panel panel-input" aria-label="Calculator inputs">
          {inputs}
        </section>
        <section className="panel panel-results" aria-label="Results">
          {results}
        </section>
      </div> : inputs}

      <p className="privacy-note">
        <ShieldCheck size={16} /> Calculations run in your browser. We never store what you enter.
      </p>

      {guide ? <article className="guide-block">{guide}</article> : null}
    </div>
  );
}
