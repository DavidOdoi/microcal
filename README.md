# MicroFinancePost

A personal finance calculator site built with Next.js, React, and TypeScript.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production build

```bash
npm run build
npm start
```

The app includes calculator categories, search, and interactive calculators. Calculator inputs are processed in the browser and are not saved.

## Validation

Run `npm test` for calculator math and `npm run lint` for lint checks.
With the app running locally, run `npm run test:routes` to verify that both
calculator URL forms render the completed input and results panels. Set
`TEST_BASE_URL` to test a server on a different port.
# microcal
