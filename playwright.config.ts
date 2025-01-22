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
    video: {
      mode: 'on',
      size: {width: 1920, height: 1080},
    }
  },

  // Browsers to test against
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: {width: 1920, height: 1080},
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        viewport: {width: 1920, height: 1080},
      },
    },
  ],
});
