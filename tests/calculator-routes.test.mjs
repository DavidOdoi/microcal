import assert from 'node:assert/strict';
import test from 'node:test';
import { batchTwoPages } from '../lib/batch-two-pages.ts';
import { batchFourPages } from '../lib/batch-four-pages.ts';

const baseUrl = process.env.TEST_BASE_URL || 'http://127.0.0.1:3000';

// A successful status and page title alone also pass for the old placeholder.
// Check that both public URL forms actually render the calculator and results.
for (const [slug, page] of Object.entries({ ...batchTwoPages, ...batchFourPages })) {
  for (const path of [`/calculators/${slug}/`, `/${page.category}/${slug}/`]) {
    test(`${path} renders the completed calculator`, async () => {
      const response = await fetch(new URL(path, baseUrl));
      assert.equal(response.status, 200);
      const html = await response.text();
      assert.ok(html.includes(`<h1>${page.name}</h1>`), 'calculator heading');
      assert.match(html, /class="finance-input-panel"/, 'input panel');
      assert.match(html, /<input\b[^>]*type="number"/, 'numeric inputs');
      assert.match(html, /class="finance-results-panel"/, 'live results panel');
      assert.doesNotMatch(html, /This calculator is being built/);
      const canonical = `https://microfinancepost.com/${page.category}/${slug}/`;
      assert.ok(html.includes(`<link rel="canonical" href="${canonical}"`), 'canonical URL');
    });
  }
}

test('every published calculator also works through the navigation URL', async () => {
  const response = await fetch(new URL('/sitemap.xml', baseUrl));
  assert.equal(response.status, 200);
  const sitemap = await response.text();
  const slugs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((match) => new URL(match[1]).pathname.split('/').filter(Boolean).at(-1))
    .filter((slug) => slug?.endsWith('-calculator'));
  assert.ok(slugs.length > 0, 'sitemap must publish calculator pages');
  for (const slug of slugs) {
    const path = `/calculators/${slug}/`;
    const calculator = await fetch(new URL(path, baseUrl));
    assert.equal(calculator.status, 200, path);
    const html = await calculator.text();
    assert.match(html, /<input\b[^>]*type="number"/, `${path} must have calculator inputs`);
    assert.doesNotMatch(html, /This calculator is being built/, path);
  }
});

test('HELOC uses the supplied article and the new payment summary', async () => {
  const response = await fetch(new URL('/calculators/heloc-payment-calculator/', baseUrl));
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Calculate Payment/);
  assert.match(html, /Your HELOC Payments/);
  for (const amount of ['$266.67', '$382.26', '$44,806.95', '$84,806.95']) {
    assert.ok(html.includes(amount), `default estimate ${amount}`);
  }
  const article = html.match(/<article class="finance-article">([\s\S]*?)<\/article>/)?.[1];
  assert.ok(article, 'supporting article');
  assert.match(article, /What Is a HELOC Payment\?/);
  assert.match(article, /How Does a HELOC Payment Calculator Work\?/);
  assert.match(article, /HELOC Payment Calculation Example/);
  assert.match(article, /How much is the monthly payment on a \$50,000 HELOC\?/);
  assert.match(article, /Final Thoughts/);
  assert.equal((article.match(/<table>/g) || []).length, 2);
  assert.match(article, /href="\/calculators\/refinance-calculator\/"/);
  assert.match(article, /href="\/calculators\/budget-calculator\/"/);
  assert.match(article, /href="\/loans\/loan-interest-calculator\/"/);
  assert.doesNotMatch(article, /Sources and methodology/);
  assert.doesNotMatch(article, /Do HELOC payments increase after the draw period\?/);
});
