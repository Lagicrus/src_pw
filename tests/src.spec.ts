import { test, expect } from '@playwright/test';

test("src full tests", async ({ page }, testInfo) => {
  // Check 1 - Navigate to https://srcuk.com/
  await page.goto("/");
  // Get the baseURL from the config
  const baseURL = testInfo.config.projects[0].use.baseURL;

  // Check 2 - read that the user is on the URL
  await expect(page).toHaveURL(baseURL);

  const acceptCookiesButton = page.getByRole("button", { name: "Accept cookies" });
  await acceptCookiesButton.click();

  // Check 3 - ACCEPT COOKIES,
  await expect(acceptCookiesButton).not.toBeInViewport();

  const header = page.locator("header");
  const headerLinkText = await header.getByRole('link').all();
  headerLinkText.shift();

  // Check 4 - The colour change on hover on all of the header labels
  for(const link of headerLinkText) {
    await link.hover();
    await expect(link).toHaveCSS("color", "rgb(239, 51, 64)");
  }

  // Check 5 - Select About US

  await page.getByRole('banner').getByRole('link', { name: 'ABOUT US' }).click();

  // Check 6 - Read that the user is on the URL https://srcuk.com/about-us/
  await expect(page).toHaveURL(`${baseURL}/about-us/`);

  // Check 7 - Using playwright verify and validate the presence of aesthetic locators
  const aboutUsHeader = page.getByRole('heading', { name: 'ABOUT US' }).locator('span');
  await expect(aboutUsHeader).toBeVisible();

  // Check 8 - On the About US page demonstrate playwright scroll to footer, scroll to header
  const footer = page.locator("footer");
  await footer.scrollIntoViewIfNeeded();
  await expect(footer).toBeInViewport();

  await aboutUsHeader.scrollIntoViewIfNeeded();
  await expect(aboutUsHeader).toBeInViewport();

  // Check 9 - footer hover colours + ferrari
  const footerLinkContainer = footer.locator('div[class*=\'grid-cols-3\']');
  await expect(footerLinkContainer).toBeVisible();
  const footerLinks = await footerLinkContainer.getByRole("link").all();

  for(const link of footerLinks) {
    // We skip the facebook and linkedin links as their <a> link doesn't contain any classes, so they are
    // tested next separately
    if((await link.getAttribute('href')).match(/(facebook|linkedin)/i)) {
      const linkIcon = link.locator("i");
      await linkIcon.hover();
      await expect(linkIcon).toHaveCSS("color", "rgba(255, 255, 255, 0.5)");
      continue;
    }
    await link.hover();
    await expect(link).toHaveCSS("color", "rgba(255, 255, 255, 0.5)");
  }

  // Check 10 - Ensure that the footer contains the text “SRC UK Limited Copyright © 2025.
  // All rights Reserved.”

  await expect(footer).toContainText("SRC UK Limited Copyright © 2025. All rights Reserved.");
});
