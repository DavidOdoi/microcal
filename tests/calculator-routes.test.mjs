import assert from 'node:assert/strict';
import test from 'node:test';
import { batchTwoPages } from '../lib/batch-two-pages.ts';
import { batchFourPages } from '../lib/batch-four-pages.ts';

const baseUrl = process.env.TEST_BASE_URL || 'http://127.0.0.1:3000';

for (const path of ['/calculators/fha-home-loan-calculator/', '/mortgages/fha-home-loan-calculator/']) {
  test(`${path} renders the FHA mortgage and insurance estimate`, async () => {
    const response = await fetch(new URL(path, baseUrl));
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, /Your FHA Home Loan Estimate/);
    assert.match(html, /\$1,994\.55/);
    assert.match(html, /\$5,066\.25/);
    assert.match(html, /What Are the FHA Loan Limits in 2026\?/);
    assert.match(html, /href="https:\/\/microfinancepost.com\/calculators\/fha-home-loan-calculator\/"/);
    assert.doesNotMatch(html, /This calculator is being built/);
  });
}
test('FHA calculator is discoverable and rejects the wrong category', async () => {
  const sitemap = await (await fetch(new URL('/sitemap.xml', baseUrl))).text();
  assert.ok(sitemap.includes('/calculators/fha-home-loan-calculator/'));
  assert.equal((await fetch(new URL('/savings/fha-home-loan-calculator/', baseUrl))).status, 404);
});

for (const path of ['/calculators/commercial-mortgage-calculator/', '/business/commercial-mortgage-calculator/']) {
  test(`${path} renders the commercial payment and balloon calculator`, async () => {
    const response = await fetch(new URL(path, baseUrl));
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, /Your Commercial Mortgage Estimate/);
    assert.match(html, /\$3,876\.49/);
    assert.match(html, /What Is a Balloon Payment on a Commercial Mortgage\?/);
    assert.match(html, /href="https:\/\/microfinancepost.com\/calculators\/commercial-mortgage-calculator\/"/);
    assert.doesNotMatch(html, /This calculator is being built/);
  });
}
test('commercial mortgage is discoverable and rejects the wrong category', async () => {
  const sitemap = await (await fetch(new URL('/sitemap.xml', baseUrl))).text();
  assert.ok(sitemap.includes('/calculators/commercial-mortgage-calculator/'));
  assert.equal((await fetch(new URL('/savings/commercial-mortgage-calculator/', baseUrl))).status, 404);
});

for (const path of ['/calculators/home-equity-loan-calculator/', '/home-equity/home-equity-loan-calculator/']) {
  test(`${path} renders the fixed-rate equity loan and supplied article`, async () => {
    const response = await fetch(new URL(path, baseUrl));
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, /Your Home Equity Loan Estimate/);
    assert.match(html, /\$286\.70/);
    assert.match(html, /\$70,000\.00/);
    assert.match(html, /Home Equity Loan vs\. HELOC/);
    assert.match(html, /href="https:\/\/microfinancepost.com\/calculators\/home-equity-loan-calculator\/"/);
    assert.doesNotMatch(html, /This calculator is being built/);
  });
}
test('home equity loan is in the sitemap and rejects an unrelated category', async () => {
  const sitemap = await (await fetch(new URL('/sitemap.xml', baseUrl))).text();
  assert.ok(sitemap.includes('/calculators/home-equity-loan-calculator/'));
  assert.equal((await fetch(new URL('/savings/home-equity-loan-calculator/', baseUrl))).status, 404);
});

for (const path of ['/calculators/rent-vs-buy-calculator/', '/mortgages/rent-vs-buy-calculator/']) {
  test(`${path} renders the working home comparison and supplied article`, async () => {
    const response = await fetch(new URL(path, baseUrl));
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, /Compare Costs/);
    assert.match(html, /Your Rent vs\. Buy Comparison/);
    assert.match(html, /\$2,113\.92/);
    assert.match(html, /Is It Better to Rent or Buy a Home\?/);
    assert.match(html, /href="https:\/\/microfinancepost.com\/calculators\/rent-vs-buy-calculator\/"/);
    assert.doesNotMatch(html, /This calculator is being built/);
  });
}
test('rent versus buy is discoverable and rejects the wrong category', async () => {
  const sitemap = await (await fetch(new URL('/sitemap.xml', baseUrl))).text();
  assert.ok(sitemap.includes('/calculators/rent-vs-buy-calculator/'));
  assert.equal((await fetch(new URL('/savings/rent-vs-buy-calculator/', baseUrl))).status, 404);
});

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

test('personal loan sample renders its uploaded guide and fee-aware example', async () => {
  const response = await fetch(new URL('/calculators/personal-loan-calculator/', baseUrl));
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Your Personal Loan Payments/);
  for (const amount of ['$395.01', '$14,250.00', '$750.00']) assert.ok(html.includes(amount), amount);
  const article = html.match(/<article class="finance-article">([\s\S]*?)<\/article>/)?.[1];
  assert.ok(article, 'personal loan article');
  for (const heading of ['Understanding the Personal Loan Calculator', 'Worked Example', 'Further Considerations', 'Common Mistakes to Avoid', 'Authoritative Sources']) {
    assert.ok(article.includes(heading), heading);
  }
  assert.match(article, /annual interest rate; term; origination fee; optional extra monthly principal/);
  assert.match(article, /href="\/calculators\/loan-comparison-calculator\/"/);
  assert.doesNotMatch(article, /Put the numbers into context/);
  assert.doesNotMatch(article, /Primary keyword|Suggested URL/);
});
