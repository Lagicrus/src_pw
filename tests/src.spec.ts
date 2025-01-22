import {test, expect} from '@playwright/test';

test("src full tests", async ({page}, testInfo) => {
  // Check 1 - Navigate to https://srcuk.com/
  await page.goto("/");
  // Get the baseURL from the config
  const baseURL = testInfo.config.projects[0].use.baseURL;

  // Check 2 - read that the user is on the URL
  await expect(page).toHaveURL(baseURL);

  const acceptCookiesButton = page.getByRole("button", {name: "Accept cookies"});
  await acceptCookiesButton.click();

  // Check 3 - ACCEPT COOKIES,
  await expect(acceptCookiesButton).not.toBeInViewport();

  const header = page.locator("header");
  const headerLinkText = await header.getByRole('link').all();
  headerLinkText.shift();

  // Check 4 - The colour change on hover on all of the header labels
  for (const link of headerLinkText) {
    await link.hover();
    await expect(link).toHaveCSS("color", "rgb(239, 51, 64)");
  }

  // Check 5 - Select About US
  await page.getByRole('banner').getByRole('link', {name: 'ABOUT US'}).click();

  // Check 6 - Read that the user is on the URL https://srcuk.com/about-us/
  await expect(page).toHaveURL(`${baseURL}/about-us/`);

  // Check 7 - Using playwright verify and validate the presence of aesthetic locators
  const aboutUsHeader = page.getByRole('heading', {name: 'ABOUT US'}).locator('span');
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

  for (const link of footerLinks) {
    // We skip the facebook and linkedin links as their <a> link doesn't contain any classes, so they are
    // tested next separately
    if ((await link.getAttribute('href')).match(/(facebook|linkedin)/i)) {
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

  // Check 11 - Select Contact US
  await page.getByRole('link', {name: 'Contact Us'}).click();

  // Check 12 - Ensure the page navigates to URL https://srcuk.com/contact/
  await expect(page).toHaveURL(`${baseURL}/contact/`);

  // Check 13 - Ensure that Contact is on the page as well as every piece of text
  const contactTitle = page.getByRole('heading', {name: 'CONTACT', exact: true}).locator('span');
  await expect(contactTitle).toBeVisible();
  const addressText = page.getByRole('heading', {name: 'ADDRESS'});
  await expect(addressText).toBeVisible();
  const contactFormText = page.getByRole('heading', {name: 'CONTACT FORM'});
  await expect(contactFormText).toBeVisible();
  const telephoneText = page.getByRole('heading', {name: 'TELEPHONE'});
  await expect(telephoneText).toBeVisible();
  await expect(footer).toContainText("SRC UK Limited Copyright © 2025. All rights Reserved.");

  // Check 14 - Ensure playwright can add text to the Contact Form
  const yourNameInput = page.locator('input[name=\'your-name\']');
  await yourNameInput.fill('John Doe');
  await expect(yourNameInput).toHaveValue('John Doe');

  // Check 15 - Ensure when the fields are empty and the playwright selects Submit every
  // field presents with a red border and red writing with text Please fill out this
  // field.
  await yourNameInput.fill('');
  const submitButton = page.getByRole('button', {name: 'Submit'});
  await submitButton.click();

  // Setup the locators for the error messages & inputs
  const yourEmailInput = page.locator('input[name=\'your-email\']');
  const yourSubjectInput = page.locator('input[name=\'your-subject\']');
  const yourMessageInput = page.locator('textarea[name=\'your-message\']');

  const yourNameLabel = page.locator('span[data-name=\'your-name\']');
  const yourEmailLabel = page.locator('span[data-name=\'your-email\']');
  const yourSubjectLabel = page.locator('span[data-name=\'your-subject\']');
  const yourMessageLabel = page.locator('span[data-name=\'your-message\']');

  // Test aria-invalid, border-color, and text content
  await expect(yourNameInput).toHaveAttribute('aria-invalid', 'true');
  await expect(yourEmailInput).toHaveAttribute('aria-invalid', 'true');
  await expect(yourSubjectInput).toHaveAttribute('aria-invalid', 'true');
  await expect(yourMessageInput).toHaveAttribute('aria-invalid', 'true');

  await expect(yourNameInput).toHaveCSS('border-color', 'rgb(220, 38, 38)');
  await expect(yourEmailInput).toHaveCSS('border-color', 'rgb(220, 38, 38)');
  await expect(yourSubjectInput).toHaveCSS('border-color', 'rgb(220, 38, 38)');
  await expect(yourMessageInput).toHaveCSS('border-color', 'rgb(220, 38, 38)');

  await expect(yourNameLabel).toContainText('Please fill out this field.');
  await expect(yourEmailLabel).toContainText('Please fill out this field.');
  await expect(yourSubjectLabel).toContainText('Please fill out this field.');
  await expect(yourMessageLabel).toContainText('Please fill out this field.');
});
