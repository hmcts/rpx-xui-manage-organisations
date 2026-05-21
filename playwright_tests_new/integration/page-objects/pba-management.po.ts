import type { Locator, Page } from '@playwright/test';

export class PbaManagementPage {
  public readonly addAnotherPbaButton: Locator;
  public readonly changePbaAccountsLink: Locator;
  public readonly checkPbaAccountsHeading: Locator;
  public readonly continueButton: Locator;
  public readonly organisationHeading: Locator;
  public readonly pbaAccountsHeading: Locator;
  public readonly successBanner: Locator;
  public readonly submitPbaAccountsButton: Locator;

  constructor(private readonly page: Page) {
    this.addAnotherPbaButton = this.page.getByRole('button', { name: 'Add another PBA number' });
    this.changePbaAccountsLink = this.page.locator('#change-pba-account-numbers__link');
    this.checkPbaAccountsHeading = this.page.getByRole('heading', { name: 'Check your PBA accounts' });
    this.continueButton = this.page.getByRole('button', { name: 'Continue' });
    this.organisationHeading = this.page.getByRole('heading', { name: 'Organisation' });
    this.pbaAccountsHeading = this.page.getByRole('heading', { name: 'Add or remove PBA accounts' });
    this.successBanner = this.page.locator('.hmcts-banner--success');
    this.submitPbaAccountsButton = this.page.getByRole('button', { name: 'Submit PBA accounts' });
  }

  public organisationPbaSummary(): Locator {
    return this.page.locator('.govuk-summary-list__row').filter({
      has: this.page.locator('.govuk-summary-list__key', { hasText: 'PBA numbers' })
    });
  }

  public pbaInput(index: number): Locator {
    return this.page.locator(`#pba-number-input${index}`);
  }

  public validationMessage(message: string): Locator {
    return this.page.getByRole('alert').getByText(message, { exact: true });
  }

  public checkSummaryRow(label: string): Locator {
    return this.page.locator('.govuk-table__row').filter({
      has: this.page.locator('.govuk-table__header', { hasText: label })
    });
  }

  public pbaRow(pbaNumber: string): Locator {
    return this.page.locator('tbody tr').filter({ hasText: pbaNumber });
  }

  public async openOrganisation(): Promise<void> {
    await this.page.goto('/organisation');
    await this.waitForLoader();
  }

  public async openPbaManagement(): Promise<void> {
    await this.changePbaAccountsLink.click();
    await this.waitForLoader();
  }

  public async addPbaNumber(pbaNumber: string, index = 0): Promise<void> {
    await this.addAnotherPbaButton.click();
    await this.pbaInput(index).fill(pbaNumber);
    await this.pbaInput(index).blur();
  }

  public async removeExistingPba(pbaNumber: string): Promise<void> {
    await this.pbaRow(pbaNumber).getByText('Remove', { exact: true }).click();
  }

  public async cancelPendingPbaRemoval(pbaNumber: string): Promise<void> {
    await this.pbaRow(pbaNumber).getByText('Cancel', { exact: true }).click();
  }

  public async continueToCheckPage(): Promise<void> {
    await this.continueButton.click();
    await this.waitForLoader();
  }

  public async submitPbaAccounts(): Promise<void> {
    await this.submitPbaAccountsButton.click();
    await this.waitForLoader();
  }

  private async waitForLoader(): Promise<void> {
    await this.page.locator('app-loader .overlay').waitFor({ state: 'hidden' });
  }
}
