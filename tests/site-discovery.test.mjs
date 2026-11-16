import assert from 'node:assert/strict';
import test from 'node:test';

const baseUrl = process.env.TEST_BASE_URL || 'http://127.0.0.1:3000';
const origin = 'https://microfinancepost.com';

test('robots advertises the canonical sitemap and permits crawling', async () => {
  const response = await fetch(new URL('/robots.txt', baseUrl));
  assert.equal(response.status, 200);
  const robots = await response.text();
  assert.match(robots, /^Sitemap: https:\/\/microfinancepost\.com\/sitemap\.xml$/m);
  assert.match(robots, /User-agent: Googlebot\s+Allow: \//);
  assert.doesNotMatch(robots, /^Disallow: \/\s*$/m);
});

test('every sitemap entry is unique, directly reachable, indexable, and canonical when specified', async () => {
  const response = await fetch(new URL('/sitemap.xml', baseUrl));
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /xml/);
  const xml = await response.text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  assert.ok(urls.length > 20);
  assert.equal(new Set(urls).size, urls.length);
  for (const location of urls) {
    const url = new URL(location);
    assert.equal(url.origin, origin);
    assert.equal(url.search, ''); assert.equal(url.hash, '');
    assert.notEqual(url.pathname, '/search/');
    const page = await fetch(new URL(url.pathname, baseUrl), { redirect: 'manual' });
    assert.equal(page.status, 200, location);
    assert.doesNotMatch(page.headers.get('x-robots-tag') || '', /noindex/i, location);
    const html = await page.text();
    assert.doesNotMatch(html, /<meta name="robots" content="[^"]*noindex/i, location);
    assert.doesNotMatch(html, /This calculator is being built|<h1>Page not found<\/h1>/, location);
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1];
    if (canonical) assert.equal(canonical, location, location);
  }
});

test('homepage exposes the new icon formats and working calculator labels', async () => {
  const html = await (await fetch(new URL('/', baseUrl))).text();
  assert.match(html, /Calculators ready to use/);
  assert.match(html, /Popular calculators/);
  assert.doesNotMatch(html, /Calculators on the way|Calculators planned/);
  assert.match(html, /href="\/favicon\.ico\?v=money-1"/);
  assert.match(html, /href="\/favicon\.png\?v=money-1"/);
  assert.match(html, /rel="apple-touch-icon"/);
  for (const path of ['/favicon.ico', '/favicon.png', '/apple-touch-icon.png']) {
    const response = await fetch(new URL(path, baseUrl));
    assert.equal(response.status, 200, path);
    assert.match(response.headers.get('content-type'), /image\//, path);
    assert.ok((await response.arrayBuffer()).byteLength > 100, path);
  }
});
