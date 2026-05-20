import type { Page } from '@playwright/test';

export class BasePage {
  constructor(public readonly page: Page) {}

  public async signOut(): Promise<void> {
    const signOutButton = this.page.getByRole('button', { name: 'Sign out' }).first();
    if (await signOutButton.isVisible()) {
      await signOutButton.click();
      return;
    }

    await this.page.getByRole('link', { name: 'Sign out' }).first().click();
  }
}
