import type { Locator, Page } from '@playwright/test';

export class TermsAndConditionsPage {
  public readonly confirmButton: Locator;
  public readonly heading: Locator;
  public readonly termsLink: Locator;

  constructor(private readonly page: Page) {
    this.confirmButton = this.page.getByRole('button', { name: 'Confirm' });
    this.heading = this.page.getByRole('heading', { name: 'Using this service' });
    this.termsLink = this.page.getByRole('main').getByRole('link', { name: 'terms and conditions', exact: true });
  }

  public async confirm(): Promise<void> {
    await this.confirmButton.click();
  }
}
