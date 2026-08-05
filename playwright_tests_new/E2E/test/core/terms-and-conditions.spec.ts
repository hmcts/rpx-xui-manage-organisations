import { test, expect } from '../../fixtures';

test.describe('Terms and conditions', () => {
  test(
    'shows the register-other-org terms content',
    { tag: ['@e2e', '@terms'] },
    async ({ page }) => {
      await page.goto('/terms-and-conditions-register-other-org');

      await expect(page).toHaveURL(/\/terms-and-conditions-register-other-org$/);
      await expect(page.getByRole('heading', { name: 'TERMS AND CONDITIONS', exact: true })).toBeVisible();
      await expect(page.getByRole('heading', {
        name: 'Please read these terms and conditions carefully before using this service'
      })).toBeVisible();
      await expect(page.getByRole('heading', {
        name: 'Who we are and how to contact us'
      })).toBeVisible();
    }
  );

  test(
    'routes the legacy terms URL to the register-other-org terms content',
    { tag: ['@e2e', '@terms'] },
    async ({ page }) => {
      await page.goto('/terms-and-conditions');

      await expect(page).toHaveURL(/\/terms-and-conditions-register-other-org$/);
      await expect(page.getByRole('heading', { name: 'TERMS AND CONDITIONS', exact: true })).toBeVisible();
    }
  );
});
