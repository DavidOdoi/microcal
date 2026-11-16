import assert from 'node:assert/strict';
import test from 'node:test';
const baseUrl = process.env.TEST_BASE_URL || 'http://127.0.0.1:3000';
const cases = [
  { slug: 'us-inflation-calculator', category: 'savings', name: 'US Inflation Calculator', heading: 'US Inflation Calculator: Compare the Value of Money Over Time', result: 'Your Inflation Comparison', sample: '$18,695.88', articleHeading: 'What Is a US Inflation Calculator?' },
];
for (const entry of cases) {
  for (const path of [`/calculators/${entry.slug}/`, `/${entry.category}/${entry.slug}/`]) {
    test(`${path}: supplied content, calculation, SEO, schema, and expanded links`, async () => {
      const response = await fetch(new URL(path, baseUrl)); assert.equal(response.status, 200);
      const html = await response.text();
      assert.ok(html.includes(`<h1>${entry.heading}</h1>`)); assert.equal((html.match(/<h1\b/g) || []).length, 1);
      assert.ok(html.includes(entry.result)); assert.ok(html.includes(entry.sample));
      assert.ok(html.includes(`rel="canonical" href="https://microfinancepost.com/calculators/${entry.slug}/"`));
      assert.match(html, /name="description" content="[^"]+"/);
      const article = html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/)?.[1];
      assert.ok(article?.includes(entry.articleHeading));
      assert.doesNotMatch(article, /Codex implementation|Automated acceptance tests|Batch 2 progress|unverified Semrush/);
      const faqs = article.match(/<h2>Frequently Asked Questions<\/h2>([\s\S]*?)(?:<h2>|$)/)?.[1];
      assert.equal((faqs?.match(/<h3\b/g) || []).length, 3);
      const internal = new Set([...article.matchAll(/href="(\/[^"#]+)"/g)].map((match) => match[1]));
      const external = new Set([...article.matchAll(/href="(https:\/\/[^"#]+)"/g)].map((match) => match[1]));
      assert.ok(internal.size >= 3, 'contextual internal links'); assert.ok(external.size >= 3, 'authoritative external links');
      for (const href of internal) assert.equal((await fetch(new URL(href, baseUrl))).status, 200, href);
      for (const href of external) assert.equal(new URL(href).protocol, 'https:');
      const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
      assert.deepEqual(schema['@graph'].map((item) => item['@type']), ['WebApplication', 'BreadcrumbList']);
      assert.equal(schema['@graph'][0].name, entry.name);
    });
  }
  test(`${entry.slug}: category, directory, search, sitemap, and category guard`, async () => {
    for (const path of [`/${entry.category}/`, '/calculators/', `/search/?q=${entry.slug.split('-')[0]}`, '/sitemap.xml']) {
      const response = await fetch(new URL(path, baseUrl)); assert.equal(response.status, 200);
      assert.ok((await response.text()).includes(`/${entry.slug}/`), path);
    }
    const wrongCategory = entry.category === 'savings' ? 'business' : 'savings';
    assert.equal((await fetch(new URL(`/${wrongCategory}/${entry.slug}/`, baseUrl))).status, 404);
  });
}
