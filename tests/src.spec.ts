import { test, expect } from '@playwright/test';

test("goto homepage", async ({ page }, testInfo) => {
  await page.goto("/");
  // Get the baseURL from the config
  const baseURL = testInfo.config.projects[0].use.baseURL;

  await expect(page).toHaveURL(baseURL);
});

test("accept cookies", async ({ page }) => {
  await page.goto("/");

  const acceptCookiesButton = page.getByRole("button", { name: "Accept cookies" });
  await acceptCookiesButton.click();

  await expect(acceptCookiesButton).not.toBeVisible();
})

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});
