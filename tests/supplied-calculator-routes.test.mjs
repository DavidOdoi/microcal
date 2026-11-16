import assert from 'node:assert/strict';
import test from 'node:test';

const baseUrl = process.env.TEST_BASE_URL || 'http://127.0.0.1:3000';
const cases = [
  { slug: '401k-early-withdrawal-calculator', category: 'retirement', name: '401(k) Early Withdrawal Calculator', result: 'Your Withdrawal Estimate', sample: '$12,600.00', heading: 'What Is a 401(k) Early Withdrawal Calculator?' },
  { slug: 'social-security-benefits-calculator', category: 'retirement', name: 'Social Security Benefits Calculator', result: 'Your Social Security Estimate', sample: '$2,000.00', heading: 'What Is a Social Security Benefits Calculator?' },
  { slug: 'dscr-loan-calculator', category: 'business', name: 'DSCR Loan Calculator', result: 'Your DSCR Results', sample: '1.20', heading: 'What Is a DSCR Loan Calculator?' },
];
for (const entry of cases) {
  for (const path of [`/calculators/${entry.slug}/`, `/${entry.category}/${entry.slug}/`]) {
    test(`${path}: calculator, supplied guide, metadata, schema, and links`, async () => {
      const response = await fetch(new URL(path, baseUrl));
      assert.equal(response.status, 200);
      const html = await response.text();
      assert.ok(html.includes(entry.result)); assert.ok(html.includes(entry.sample));
      assert.equal((html.match(/<h1\b/g) || []).length, 1);
      assert.ok(html.includes(`<h1>${entry.name}</h1>`));
      assert.ok(html.includes(`rel="canonical" href="https://microfinancepost.com/calculators/${entry.slug}/"`));
      assert.match(html, /name="description" content="[^"]+"/);
      const article = html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/)?.[1];
      assert.ok(article); assert.ok(article.includes(entry.heading));
      assert.equal((article.match(/<h3\b/g) || []).length, 3);
      assert.doesNotMatch(article, /SEO settings|development instructions|UX recommendation|Progress:|Next calculator:/);
      const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
      assert.deepEqual(schema['@graph'].map((item) => item['@type']), ['WebApplication', 'BreadcrumbList']);
      assert.equal(schema['@graph'][0].name, entry.name);
      for (const href of new Set([...html.matchAll(/href="(\/[^"#]*)"/g)].map((match) => match[1]))) assert.equal((await fetch(new URL(href, baseUrl))).status, 200, href);
    });
  }
  test(`${entry.slug}: discovery and category validation`, async () => {
    for (const path of [`/${entry.category}/`, '/calculators/', `/search/?q=${entry.slug.split('-')[0]}`, '/sitemap.xml']) {
      const html = await (await fetch(new URL(path, baseUrl))).text();
      assert.ok(html.includes(`/${entry.slug}/`), path);
    }
    assert.equal((await fetch(new URL(`/savings/${entry.slug}/`, baseUrl))).status, 404);
  });
}
