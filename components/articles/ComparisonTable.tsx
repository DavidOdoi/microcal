import styles from './ComparisonArticle.module.css';

export type ComparisonTableRow = {
  href?: string;
  name: string;
  values: string[];
  links?: Record<string, string>;
};

export function ComparisonTable({ headingId, caption, rowHeader, columns, rows, emphasizedColumn }: {
  headingId: string;
  caption: string;
  rowHeader: string;
  columns: string[];
  rows: ComparisonTableRow[];
  emphasizedColumn?: string;
}) {
  return (
    <div className={styles.tableFrame} role="region" aria-labelledby={headingId} tabIndex={0}>
      <table className={styles.table} role="table">
        <caption className={styles.srOnly}>{caption}</caption>
        <thead role="rowgroup">
          <tr role="row">
            <th scope="col" role="columnheader">{rowHeader}</th>
            {columns.map((column) => <th key={column} scope="col" role="columnheader">{column}</th>)}
          </tr>
        </thead>
        <tbody role="rowgroup">
          {rows.map(({ href, name, values, links }) => (
            <tr key={name} role="row">
              <th scope="row" role="rowheader">{href ? <a href={href}>{name}</a> : name}</th>
              {columns.map((column, index) => (
                <td key={column} role="cell" className={column === emphasizedColumn ? styles.emphasizedValue : undefined}>
                  <span className={styles.cellLabel} aria-hidden="true">{column}</span>
                  <span>{links?.[column]
                    ? <a href={links[column]} aria-label={`${name}: ${values[index]}`}>{values[index]}</a>
                    : values[index]}
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
