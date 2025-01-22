import { test, expect } from '@playwright/test';

test("goto homepage", async ({ page }, testInfo) => {
  await page.goto("/");
  // Get the baseURL from the config
  const baseURL = testInfo.config.projects[0].use.baseURL;

  await expect(page).toHaveURL(baseURL);
});

// These are merged into one test as if you test the hover colour change without accepting cookies, the test will fail
// Due to the cookie popup happening semi randomly during the test
test("accept cookies & test header hover colour change", async ({ page }) => {
  await page.goto("/");

  const acceptCookiesButton = page.getByRole("button", { name: "Accept cookies" });
  await acceptCookiesButton.click();

  await expect(acceptCookiesButton).not.toBeInViewport();

  // PART 2

  const header = page.locator("header");
  const headerLinkText = await header.getByRole('link').all();
  headerLinkText.shift();

  for(const link of headerLinkText) {
    await link.hover();
    await expect(link).toHaveCSS("color", "rgb(239, 51, 64)");
  }
})

test("about us page", async ({ page }, testInfo) => {
  await page.goto("/");
  await page.getByRole('banner').getByRole('link', { name: 'ABOUT US' }).click();

  // Get the baseURL from the config
  const baseURL = testInfo.config.projects[0].use.baseURL;
  await expect(page).toHaveURL(`${baseURL}/about-us/`);

  const aboutUsHeader = page.getByRole('heading', { name: 'ABOUT US' }).locator('span');
  await expect(aboutUsHeader).toBeVisible();

  const footer = page.locator("footer");
  await footer.scrollIntoViewIfNeeded();
  await expect(footer).toBeInViewport();

  await aboutUsHeader.scrollIntoViewIfNeeded();
  await expect(aboutUsHeader).toBeInViewport();
})

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});
