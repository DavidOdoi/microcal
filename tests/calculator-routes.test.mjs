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
