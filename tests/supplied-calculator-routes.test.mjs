import assert from 'node:assert/strict';
import test from 'node:test';

const baseUrl = process.env.TEST_BASE_URL || 'http://127.0.0.1:3000';
test('federal income tax aliases preserve the established URL and intro', async () => {
  for (const path of ['/calculators/federal-income-tax-calculator/', '/taxes/federal-income-tax-calculator/']) {
    const response = await fetch(new URL(path, baseUrl), { redirect: 'manual' });
    assert.equal(response.status, 308);
    assert.equal(response.headers.get('location'), '/calculators/income-tax-calculator/');
  }
  const html = await (await fetch(new URL('/calculators/income-tax-calculator/', baseUrl))).text();
  assert.ok(html.includes('Estimate federal regular income tax for tax year 2026 using your filing status, gross income, and standard or entered itemized deduction.'));
  assert.ok(html.includes('$3,820'));
  assert.doesNotMatch(html, /Put the numbers into context|What tax year does this calculator use\?/);
});
const cases = [
  { slug: 'illinois-paycheck-calculator', category: 'taxes', name: 'Illinois Paycheck Calculator', result: 'Your Illinois Paycheck Estimate', sample: '$2,190.57', heading: 'Illinois Paycheck Example: $65,000 Salary' },
  { slug: 'california-paycheck-calculator', category: 'taxes', name: 'California Paycheck Calculator', result: 'Your California Paycheck Estimate', sample: '$2,376.53', heading: 'California Paycheck Example: $80,000 Salary' },
  { slug: 'paycheck-calculator', category: 'taxes', name: 'Paycheck Calculator', result: 'Your Paycheck Estimate', sample: '$2,268.94', heading: 'Paycheck Calculators by State' },
  { slug: 'farm-loan-calculator', category: 'business', name: 'Farm Loan Calculator', result: 'Your Farm Loan Estimate', sample: '$1,013.82', heading: 'What Is a Farm Loan Calculator?' },
  { slug: 'idaho-paycheck-calculator', category: 'taxes', name: 'Idaho Paycheck Calculator', result: 'Your Idaho Paycheck Estimate', sample: '$1,841.15', heading: 'What Is an Idaho Paycheck Calculator?' },
  { slug: 'salary-to-hourly-calculator', category: 'taxes', name: 'Salary to Hourly Calculator', result: 'Your Salary Conversion', sample: '$31.25', heading: 'What Is a Salary to Hourly Calculator?' },
  { slug: 'new-york-paycheck-calculator', category: 'taxes', name: 'New York Paycheck Calculator', result: 'Your New York Paycheck Estimate', sample: '$3,945.90', heading: 'What Is a New York Paycheck Calculator?' },
  { slug: 'income-tax-calculator', category: 'taxes', name: 'Federal Income Tax Calculator', result: 'Your Federal Income Tax Estimate', sample: '$7,670.00', heading: 'What Is a Federal Income Tax Calculator?' },
  { slug: '401k-early-withdrawal-calculator', category: 'retirement', name: '401(k) Early Withdrawal Calculator', result: 'Your Withdrawal Estimate', sample: '$12,600.00', heading: 'What Is a 401(k) Early Withdrawal Calculator?' },
  { slug: 'social-security-benefits-calculator', category: 'retirement', name: 'Social Security Benefits Calculator', result: 'Your Social Security Estimate', sample: '$2,000.00', heading: 'What Is a Social Security Benefits Calculator?' },
  { slug: 'dscr-loan-calculator', category: 'business', name: 'DSCR Loan Calculator', result: 'Your DSCR Results', sample: '1.20', heading: 'What Is a DSCR Loan Calculator?' },
];

test('the national paycheck calculator and published state guides link to one another', async () => {
  const national = '/calculators/paycheck-calculator/';
  const hub = await (await fetch(new URL(national, baseUrl))).text();
  for (const state of ['california', 'idaho', 'illinois', 'new-york']) {
    const path = `/calculators/${state}-paycheck-calculator/`;
    assert.ok(hub.includes(`href="${path}"`));
    const guide = await (await fetch(new URL(path, baseUrl))).text();
    assert.ok(guide.includes(`href="${national}">US Paycheck Calculator`));
  }
});
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
      const faqs = article.match(/<h2>Frequently Asked Questions<\/h2>([\s\S]*?)(?:<h2>|$)/)?.[1];
      assert.ok(faqs);
      assert.equal((faqs.match(/<h3\b/g) || []).length, 3);
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

test('published state paystub guides have both entry points and reciprocal hub links', async () => {
  const { paycheckGuides } = await import('../lib/paycheck-guides.ts');
  const fetchPage = async path => {
    const response = await fetch(new URL(path, baseUrl));
    assert.equal(response.status, 200, path);
    return response.text();
  };

  const [hub, directory, sitemap] = await Promise.all([
    fetchPage('/calculators/paycheck-calculator/'), fetchPage('/calculators/'), fetchPage('/sitemap.xml'),
  ]);
  for (const guide of paycheckGuides) {
    const path = `/calculators/${guide.slug}/`;
    assert.ok(hub.includes(`href="${path}"`), path);
    assert.ok(directory.includes(guide.slug), path);
    assert.ok(sitemap.includes(`https://microfinancepost.com${path}`), path);
    const pages = await Promise.all([fetchPage(path), fetchPage(`/taxes/${guide.slug}/`)]);
    for (const html of pages) {
      assert.ok(html.includes(`rel="canonical" href="https://microfinancepost.com${path}"`), path);
      assert.ok(html.includes(`Your ${guide.state} Paycheck Estimate`), path);
      assert.ok(html.includes('Federal withholding from your paystub per paycheck'), path);
      assert.ok(html.includes('href="/calculators/paycheck-calculator/">US Paycheck Calculator'), path);
      assert.ok(html.includes('<h2>Frequently Asked Questions</h2>'), path);
      assert.ok(html.includes('<table>'), path);
      assert.equal(html.includes(`${guide.state} income tax withheld per paycheck`), !guide.noStateIncomeTax, path);
      if (guide.localTax) assert.ok(html.includes(`${guide.localTax} withheld per paycheck`), path);
    }
  }
});
