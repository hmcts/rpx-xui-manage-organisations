import { expect, Page } from '@playwright/test';

export async function openFirstActiveUser(page: Page): Promise<void> {
  await expect(page.locator('xuilib-user-list')).toBeVisible();

  let attempts = 0;

  while (attempts < 10) {
    const activeUserRow = page
      .locator('tbody tr')
      .filter({ has: page.locator('td', { hasText: /^Active$/ }) })
      .first();
    const activeUserLink = activeUserRow.locator('a').first();

    if (await activeUserLink.isVisible()) {
      await activeUserLink.click();
      return;
    }

    const nextPageLink = page
      .locator('li.hmcts-pagination__item--next a.hmcts-pagination__link')
      .first();

    if (!(await nextPageLink.isVisible())) {
      break;
    }

    await nextPageLink.click();
    attempts++;
  }

  throw new Error('No active user found in the users list');
}
