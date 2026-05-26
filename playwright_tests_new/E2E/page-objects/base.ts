import type { Page } from '@playwright/test';

export class BasePage {
  constructor(public readonly page: Page) {}

  public async signOut(): Promise<void> {
    await this.page.locator('app-header').getByRole('link', { name: 'Sign out', exact: true }).click();
  }
}
