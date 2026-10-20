import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests', testMatch: 'browser.spec.mjs', timeout: 120000,
  retries: 0, workers: 2,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL: 'http://127.0.0.1:8080', trace: 'retain-on-failure' },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }, { name: 'firefox', use: { browserName: 'firefox' } }],
  webServer: { command: 'node tests/serve.mjs', url: 'http://127.0.0.1:8080', reuseExistingServer: !process.env.CI }
});
