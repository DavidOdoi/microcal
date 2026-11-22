import assert from 'node:assert/strict';
import test from 'node:test';

const baseUrl = process.env.TEST_BASE_URL || 'http://127.0.0.1:3000';
const origin = 'https://microfinancepost.com';

test('category navigation points directly to every category landing page', async () => {
  const home = await fetch(new URL('/', baseUrl));
  assert.equal(home.status, 200);
  const html = await home.text();
  const nav = html.match(/<nav class="desktop-category-nav" aria-label="Categories">([\s\S]*?)<\/nav>/)?.[1];
  assert.ok(nav, 'category navigation is rendered in the header');
  const links = [...nav.matchAll(/href="([^"]+)"/g)].map((match) => match[1]);
  const expected = [
    '/loans/', '/business/', '/student-loans/', '/home-equity/', '/mortgages/', '/auto-loans/',
    '/savings/', '/investments/', '/retirement/', '/taxes/', '/debt/', '/budgeting/',
  ];
  assert.deepEqual([...links].sort(), [...expected].sort());

  for (const path of links) {
    const response = await fetch(new URL(path, baseUrl), { redirect: 'manual' });
    assert.equal(response.status, 200, path);
    const page = await response.text();
    const categoryNav = page.match(/<nav class="desktop-category-nav" aria-label="Categories">([\s\S]*?)<\/nav>/)?.[1];
    const currentLink = categoryNav?.match(/<a\b[^>]*aria-current="page"[^>]*>/)?.[0];
    assert.ok(currentLink?.includes(`href="${path}"`), `${path} is marked as the current page`);
  }
});

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
  assert.ok(html.includes('<meta name="google-site-verification" content="f3Vd7topcQTp-5X6zpLxNf8RNBpGoPfeDUwA7nLEeuk"'));
  for (const path of ['/favicon.ico', '/favicon.png', '/apple-touch-icon.png']) {
    const response = await fetch(new URL(path, baseUrl));
    assert.equal(response.status, 200, path);
    assert.match(response.headers.get('content-type'), /image\//, path);
    assert.ok((await response.arrayBuffer()).byteLength > 100, path);
  }
});
