import { test, expect } from '../../fixtures';

test(
  'IDAM login page is up and displays the email step',
  { tag: ['@e2e-smoke'] },
  async ({ idamPage, page }) => {
    await page.goto('');

    await expect(page).toHaveURL(/idam|\/login|\/enter-email/);
    await expect(idamPage.page).toHaveTitle(/HMCTS|Sign in/i);
    await expect(idamPage.usernameInput).toBeVisible();
    await expect(idamPage.submitBtn).toBeVisible();
  }
);

for (const protectedRoute of ['/users', '/cases/case-filter']) {
  test(
    `protected deep link ${protectedRoute} redirects to the IDAM login page`,
    { tag: ['@e2e-smoke'] },
    async ({ idamPage, page }) => {
      await page.goto(protectedRoute);

      await expect(page).toHaveURL(/idam|\/login|\/enter-email/);
      await expect(idamPage.usernameInput).toBeVisible();
      await expect(idamPage.submitBtn).toBeVisible();
    }
  );
}
