import {defineConfig, devices} from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: undefined,
  // Shared settings
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'https://srcuk.com',
    trace: 'on-first-retry',
    video: 'on'
  },

  // Browsers to test against
  projects: [
    {
      name: 'chromium',
      use: {...devices['Desktop Chrome']},
    },
    {
      name: 'firefox',
      use: {...devices['Desktop Firefox']},
    },
  ],
});
