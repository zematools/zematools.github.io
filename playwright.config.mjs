import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests', testMatch: 'browser.spec.mjs', timeout: 120000,
  retries: 0, workers: 2,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { ...(process.env.FONT_SMOOTH_CHROMIUM ? { launchOptions: { executablePath: process.env.FONT_SMOOTH_CHROMIUM, args: ['--no-sandbox','--disable-dev-shm-usage','--no-zygote','--disable-webgl'] } } : {}), baseURL: 'http://127.0.0.1:8080', trace: 'retain-on-failure' },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }, { name: 'firefox', use: { browserName: 'firefox' } }],
  webServer: { command: 'node tests/serve.mjs', url: 'http://127.0.0.1:8080', reuseExistingServer: !process.env.CI }
});
