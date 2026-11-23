type ComparisonRow = {
  label: string;
  value: number;
  formattedValue: string;
  highlighted?: boolean;
};

type ComparisonGroup = {
  label: string;
  rows: ComparisonRow[];
};

export function ArticleComparisonChart({ title, scale, groups }: {
  title: string;
  scale: number;
  groups: ComparisonGroup[];
}) {
  return <figure className="finance-comparison-chart">
    <figcaption>{title}</figcaption>
    <div className="finance-comparison-groups">
      {groups.map((group) => <div key={group.label}>
        <strong className="finance-comparison-group-label">{group.label}</strong>
        <dl>
          {group.rows.map((row) => <div className="finance-comparison-row" key={row.label}>
            <dt>{row.label}</dt>
            <dd>
              {row.formattedValue}
              <span className="finance-comparison-track" aria-hidden="true">
                <span className={row.highlighted ? 'highlighted' : undefined} style={{ width: `${row.value / scale * 100}%` }} />
              </span>
            </dd>
          </div>)}
        </dl>
      </div>)}
    </div>
  </figure>;
}
