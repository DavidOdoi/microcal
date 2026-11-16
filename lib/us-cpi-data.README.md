# US CPI data snapshot

`us-cpi-data.ts` contains the 113 annual-average (`M13`) observations for
1913–2025 from BLS series **CUUR0000SA0**: CPI-U, all items, U.S. city average,
not seasonally adjusted, with a 1982–84 reference base of 100.

Primary source: https://data.bls.gov/timeseries/CUUR0000SA0

The values were extracted from the SQLite database distributed with the public
Python `cpi` package, version **2.1.0**, obtained from PyPI on 2026-11-16. Direct
BLS access was unavailable in the build environment. The package's series
metadata and published annual observations are retained; monthly values were
not averaged or substituted for annual observations.

Distribution: `cpi-2.1.0-py3-none-any.whl`

SHA-256: `42090aa6d930f4448381ce249bf9bf460f494853a0f244bd4f8d758d092579d3`

Extraction query:

```sql
SELECT year, value FROM indexes
WHERE series = 'CUUR0000SA0' AND period = 'M13' AND year <= 2025
ORDER BY year;
```

To refresh, obtain a newer source snapshot, confirm the series and `M13`
period, preserve existing observations unless BLS revises them, and update
the documented coverage, validation, and tests. Do not synthesize an annual
average for an incomplete calendar year. The calculator uses the committed
snapshot locally and does not send visitor inputs to BLS or another service.
