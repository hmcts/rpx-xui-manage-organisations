import type { Locator } from '@playwright/test';
import { BasePage } from '../base';

export class OrganisationPage extends BasePage {
  public readonly navigationLink = this.page.getByRole('link', { name: 'Organisation', exact: true });
  public readonly heading = this.page.getByRole('heading', { name: 'Organisation' });
  public readonly root = this.page.locator('app-prd-organisation-component');

  public async open(): Promise<void> {
    await this.navigationLink.click();
  }

  public summaryValue(label: RegExp): Locator {
    const summaryRow = this.root
      .locator('.govuk-summary-list__row, .govuk-table__row')
      .filter({
        has: this.page.locator('.govuk-summary-list__key, .govuk-table__header', { hasText: label })
      });

    return summaryRow.locator('.govuk-summary-list__value, .govuk-table__cell');
  }
}
