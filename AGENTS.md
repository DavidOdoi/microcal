# Calculator design and content

- Use the shared calculator design in `components/calculators/CalculatorDesign.tsx` and the calculator rules in `app/globals.css` for every new or redesigned calculator. HELOC is the reference implementation.
- Use white input cards, a pale green results card, compact fields with visible units, green primary actions, and responsive two-column layouts that stack on mobile. Keep advanced inputs and schedules accessible in expandable sections.
- Reuse `CalculatorLayout`, `CalculatorNumberField`, and `PaymentSummary` where applicable. Keep calculation logic in `lib` and preserve its tested formulas when changing presentation.
- Existing calculators share the same visual tokens and `finance-*` classes. Extend these shared styles rather than introducing a separate visual theme per calculator.
- HELOC uses an explicit Calculate Payment action and Reset. Keep results labeled as awaiting recalculation when inputs change.
- Preserve page intros unless the user asks to change them. When the user supplies replacement supporting content, preserve their wording and structure, replace the old article and FAQs, and add relevant internal links around existing phrases without adding filler.
- Verify both `/calculators/[slug]/` and the calculator's canonical category URL. Run calculator tests, route checks against the running app, lint, and a production build. For visual changes, check desktop and mobile, input changes, calculation, reset, and validation in a browser.
