import { test, expect } from '../../fixtures';

test(
  'IDAM login page is up and displays username and password fields',
  { tag: ['@e2e', '@e2e-smoke'] },
  async ({ idamPage, page }) => {
    await page.goto('');

    await expect(page).toHaveURL(/\/login\?/);
    await expect(idamPage.page).toHaveTitle(/HMCTS|Sign in/i);
    await expect(idamPage.heading).toBeVisible();
    await expect(idamPage.usernameInput).toBeVisible();
    await expect(idamPage.passwordInput).toBeVisible();
    await expect(idamPage.submitBtn).toBeVisible();

    const loginUrl = new URL(page.url());
    expect(loginUrl.pathname).toBe('/login');
    expect(loginUrl.searchParams.get('response_type')).toBe('code');
    expect(loginUrl.searchParams.get('client_id')).toBeTruthy();
    expect(loginUrl.searchParams.get('redirect_uri')).toContain('/oauth2/callback');
  }
);
