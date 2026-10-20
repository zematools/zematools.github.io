import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const pages = ['index.html','success.html','privacy.html','terms.html','refunds.html','rate.html'];
const key = 'TEST-NOT-A-REAL-LICENSE-12345678';
const success = '/success.html?status=succeeded&payment_id=pay_test123&license_key='+key+'&email=test%40example.invalid';
test('all pages: responsive layout, accessible controls and local links', async ({ page }, testInfo) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of pages) {
      await page.goto('/'+path);
      await page.evaluate(() => document.fonts.ready);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), path+' at '+width).toBe(true);
      // Leaf text must not be clipped by a fixed-size or overflow container.
      const clipped = await page.locator('h1,h2,h3,p,summary,button').evaluateAll(nodes => nodes.filter(el => {
        if (!el.getClientRects().length) return false;
        const css = getComputedStyle(el);
        return ['hidden','clip'].includes(css.overflowY) && el.scrollHeight > el.clientHeight + 1;
      }).map(el => el.textContent));
      expect(clipped).toEqual([]);
      if (width === 390 || width === 1440) {
        const result = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
        expect(result.violations, JSON.stringify(result.violations)).toEqual([]);
        await page.screenshot({ path: testInfo.outputPath(path+'-'+width+'.png'), fullPage: true });
      }
      if (width === 1440) {
        const targets = await page.locator('a[href]').evaluateAll(nodes => nodes.map(n => n.href).filter(h => h.startsWith(location.origin)));
        for (const href of new Set(targets)) {
          const response = await page.request.get(href);
          expect(response.status(), href).toBe(200);
          const url = new URL(href);
          if (url.hash) expect(await response.text(), href).toContain('id="'+url.hash.slice(1)+'"');
        }
      }
    }
  }
  expect(errors).toEqual([]);
});
test('FAQ, skip link and screenshot dialog work with the keyboard', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip-link')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#main$/);
  const faq = page.locator('details').nth(1);
  await faq.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(faq).toHaveAttribute('open','');
  const preview = page.locator('[data-zoom]').first();
  await preview.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('dialog')).toBeVisible();
  await expect(page.locator('.viewer-close')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('dialog')).not.toBeVisible();
  await expect(preview).toBeFocused();
});
test('current key, clipboard feedback, URL scrubbing and no stale cache', async ({ page }, testInfo) => {
  await page.addInitScript(() => {
    sessionStorage.setItem('fontSmoothPurchaseLicense','STALE-PREVIOUS-PURCHASE');
    sessionStorage.setItem('fontSmoothPurchaseEmail','previous@example.invalid');
    sessionStorage.setItem('fontSmoothPurchaseStatus','succeeded');
    Object.defineProperty(navigator,'clipboard',{ configurable:true, value:{writeText:async value => { window.copiedValue=value; }} });
  });
  await page.goto(success);
  await expect(page.locator('#licenseKey')).toHaveValue(key);
  await expect(page).toHaveURL(/\/success.html$/);
  expect(await page.evaluate(() => sessionStorage.length)).toBe(0);
  await page.locator('#copyLicense').click();
  await expect(page.locator('#copyFeedback')).toContainText('Copied.');
  expect(await page.evaluate(() => window.copiedValue)).toBe(key);
  await expect(page.locator('#emailRecovery')).toBeVisible();
  await expect(page.locator('#activationSteps')).toBeVisible();
  await page.screenshot({path:testInfo.outputPath('license-return.png'),fullPage:true});
  // Real navigation/reload must not resurrect a prior purchase from storage.
  await page.reload();
  await expect(page.locator('#licenseBox')).not.toBeVisible();
  await expect(page.locator('#licenseKey')).toHaveValue('');
  await page.goto(success);
  await page.goto('/index.html');
  await page.goBack();
  await expect(page.locator('#licenseBox')).not.toBeVisible();
  await expect(page.locator('#licenseKey')).toHaveValue('');
});
test('blocked clipboard offers manual copy and never claims success', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw Error('blocked');}}});
    document.execCommand = () => false;
  });
  await page.goto(success);
  await page.locator('#copyLicense').click();
  await expect(page.locator('#copyFeedback')).toContainText('Copy was blocked');
  await expect(page.locator('#copyLicense')).toHaveText('Copy key');
  expect(await page.locator('#licenseKey').evaluate(el => el.selectionEnd-el.selectionStart)).toBe(key.length);
});
test('clipboard fallback accurately reports success', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator,'clipboard',{configurable:true,value:undefined});
    document.execCommand = () => true;
  });
  await page.goto(success);
  await page.locator('#copyLicense').click();
  await expect(page.locator('#copyFeedback')).toContainText('Copied.');
});
test('real Chromium clipboard receives the synthetic key', async ({ page, context, browserName }) => {
  test.skip(browserName !== 'chromium', 'Browser permission API differs in Firefox; fallback is covered separately.');
  await context.grantPermissions(['clipboard-read','clipboard-write']);
  await page.goto(success);
  await page.locator('#copyLicense').click();
  await expect(page.locator('#copyFeedback')).toContainText('Copied.');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(key);
});
test('recovery stays visible for absent, incomplete and untrusted returns', async ({ page }) => {
  for (const query of ['', '?status=succeeded&payment_id=pay_test123', '?status=pending&license_key='+key, '?status=failed&license_key='+key, '?license_key='+key, '?status=succeeded&status=failed&payment_id=pay_test123&license_key='+key]) {
    await page.goto('/success.html'+query);
    await expect(page.locator('#licenseBox')).not.toBeVisible();
    await expect(page.locator('#licenseKey')).toHaveValue('');
    await expect(page.locator('#emailRecovery')).toBeVisible();
    await expect(page.locator('#emailRecovery')).toContainText('Spam/Junk');
    await expect(page.locator('#activationSteps')).toBeVisible();
    await expect(page.locator('a[href^="mailto:serviceamanuel@gmail.com"]').first()).toBeVisible();
  }
});
test('recovery and activation remain usable with JavaScript disabled', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled:false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:8080'+success);
  await expect(page.locator('#licenseBox')).not.toBeVisible();
  await expect(page.locator('#emailRecovery')).toBeVisible();
  await expect(page.locator('#activationSteps')).toBeVisible();
  await expect(page.locator('noscript')).toBeVisible();
  await context.close();
});
