import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import vm from 'node:vm';
const pages = ['index.html','success.html','privacy.html','terms.html','refunds.html','rate.html'];
const context = vm.createContext({ URLSearchParams });
vm.runInContext(readFileSync('checkout-return.js','utf8'), context);
const parse = context.FontSmoothCheckout.parseCheckoutReturn;
const base = '?status=succeeded&payment_id=pay_test123';
const key = 'TEST-NOT-A-REAL-LICENSE-12345678';
test('only a current, unambiguous succeeded return can display a key', () => {
  const cases = [
    ['', 'missing'], ['?license_key='+key, 'unconfirmed'],
    ['?status=active&payment_id=pay_test123&license_key='+key, 'unconfirmed'],
    [base, 'missing-key'], [base+'&license_key='+key, 'key'],
    [base+'&license_key=short', 'missing-key'],
    [base+'&license_key='+key+','+key, 'missing-key'],
    [base+'&license_key=%3Cscript%3Ealert(1)%3C%2Fscript%3E', 'missing-key'],
    [base+'&status=failed&license_key='+key, 'unconfirmed'],
    [base+'&license_key='+key+'&license_key='+key, 'unconfirmed'],
    ['?status=succeeded&payment_id=invalid&license_key='+key, 'unconfirmed'],
    ['?status=pending&license_key='+key, 'pending'],
    ['?status=processing&license_key='+key, 'pending'],
    ['?status=failed&license_key='+key, 'incomplete'],
    ['?status=cancelled&license_key='+key, 'incomplete']
  ];
  for (const [query, expected] of cases) {
    const result = parse(query);
    assert.equal(result.state, expected, query);
    assert.equal(result.key, expected === 'key' ? key : '', query);
  }
});
test('identity, support, price and local resources are consistent', () => {
  for (const name of [...pages, 'README.md']) {
    const html = readFileSync(name, 'utf8');
    assert.ok(!html.includes('productionszema@gmail.com'), name);
    assert.ok(!html.includes('$7.99'), name);
    assert.ok(html.includes('Amanuel Yohannes'), name);
    assert.ok(html.includes('serviceamanuel@gmail.com'), name);
    if (!name.endsWith('.html')) continue;
    assert.equal((html.match(/<main\b/g)||[]).length, 1, name);
    for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const value = match[1].replaceAll('&amp;','&');
      if (/^(https?:|mailto:|#)/.test(value)) continue;
      assert.ok(existsSync(value.split(/[?#]/)[0]), name + ': ' + value);
    }
  }
});
test('the live product, quantity and redirect are unchanged', () => {
  const html = readFileSync('index.html','utf8');
  const href = html.match(/data-checkout href="([^"]+)"/)[1].replaceAll('&amp;','&');
  const url = new URL(href);
  assert.equal(url.origin, 'https://checkout.dodopayments.com');
  assert.equal(url.pathname, '/buy/pdt_0Nno8gkTr9QPA5THt1474');
  assert.equal(url.searchParams.get('quantity'), '1');
  assert.equal(url.searchParams.get('redirect_url'), 'https://zematools.github.io/success.html');
  assert.ok(html.includes('$5.99'));
});
