import type { Locator, Page } from '@playwright/test';

const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export class OrganisationPage {
  public readonly heading: Locator;
  public readonly root: Locator;

  constructor(private readonly page: Page) {
    this.heading = this.page.getByRole('heading', { name: 'Organisation' });
    this.root = this.page.locator('app-prd-organisation-component');
  }

  public async open(): Promise<void> {
    await this.page.goto('/organisation');
    await this.waitForLoader();
  }

  public summaryRow(label: string | RegExp): Locator {
    const keyText = typeof label === 'string' ? new RegExp(`^\\s*${escapeRegExp(label)}\\s*$`) : label;

    return this.root.locator('.govuk-summary-list__row').filter({
      has: this.page.locator('.govuk-summary-list__key', { hasText: keyText })
    });
  }

  public summaryValue(label: string | RegExp): Locator {
    return this.summaryRow(label).locator('.govuk-summary-list__value');
  }

  public summaryAction(label: string | RegExp): Locator {
    return this.summaryRow(label).locator('.govuk-summary-list__actions a');
  }

  private async waitForLoader(): Promise<void> {
    await this.page.locator('app-loader .overlay').waitFor({ state: 'hidden' });
  }
}
