import type { Locator, Page } from '@playwright/test';

const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export class UnassignedCaseSharingPage {
  public readonly addUserButton: Locator;
  public readonly confirmButton: Locator;
  public readonly continueButton: Locator;
  public readonly recipientSearchInput: Locator;
  public readonly shareCaseButton: Locator;
  public readonly showAllSectionsButton: Locator;
  public readonly unassignedCasesHeading: Locator;

  constructor(private readonly page: Page) {
    this.addUserButton = this.page.locator('#btn-add-user');
    this.confirmButton = this.page.getByRole('button', { name: 'Confirm' });
    this.continueButton = this.page.locator('#btn-continue');
    this.recipientSearchInput = this.page.locator('#add-user-input').getByRole('combobox');
    this.shareCaseButton = this.page.locator('#btn-share-unassigned-case-button');
    this.showAllSectionsButton = this.page.getByRole('button', { name: 'Show all sections' });
    this.unassignedCasesHeading = this.page.getByRole('heading', { name: 'Unassigned Cases' });
  }

  public async gotoUnassignedCases(): Promise<void> {
    await this.page.goto('/unassigned-cases');
  }

  public asylumTab(caseType: string): Locator {
    return this.page.getByRole('tab', { name: caseType });
  }

  public caseCheckbox(caseId: string): Locator {
    return this.page.locator(`#select-${caseId}`);
  }

  public caseSection(caseId: string): Locator {
    return this.page.locator(`#govuk-accordion__section-${caseId}`);
  }

  public confirmCaseBlock(caseId: string): Locator {
    return this.page.locator(`#user-access-block-${caseId}`);
  }

  public async selectCases(caseIds: string[]): Promise<void> {
    for (const caseId of caseIds) {
      await this.caseCheckbox(caseId).check();
    }
  }

  public async startCaseSharing(): Promise<void> {
    await this.shareCaseButton.click();
  }

  public async selectRecipient(searchTerm: string, optionName: string): Promise<void> {
    await this.recipientSearchInput.fill(searchTerm);
    await this.page.getByRole('option', { name: optionName, exact: true }).click();
  }

  public async addRecipient(): Promise<void> {
    await this.addUserButton.click();
  }

  public async showAllCaseSections(): Promise<void> {
    await this.showAllSectionsButton.click();
  }

  public async cancelPendingRecipientForCase(caseId: string, recipientName: string): Promise<void> {
    await this.caseSection(caseId)
      .getByRole('link', { name: new RegExp(`^Cancel.*${escapeRegExp(recipientName)}.*case$`) })
      .click();
  }
}
