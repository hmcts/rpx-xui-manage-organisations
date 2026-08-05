import type { Locator, Page } from '@playwright/test';

const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export class CaseSharingPage {
  public readonly addUserButton: Locator;
  public readonly continueButton: Locator;
  public readonly recipientSearchInput: Locator;
  public readonly removeUserButton: Locator;
  public readonly removeUserSelect: Locator;
  public readonly showAllSectionsButton: Locator;

  constructor(private readonly page: Page) {
    this.addUserButton = this.page.locator('#btn-add-user');
    this.continueButton = this.page.locator('#btn-continue');
    this.recipientSearchInput = this.page.locator('#add-user-input').getByRole('combobox');
    this.removeUserButton = this.page.locator('#btn-remove-user');
    this.removeUserSelect = this.page.locator('#remove-user-input');
    this.showAllSectionsButton = this.page.getByRole('button', { name: 'Show all sections' });
  }

  public caseSection(caseId: string): Locator {
    return this.page.locator(`#govuk-accordion__section-${caseId}`);
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

  public async removeRecipientFromAllCases(optionName: string): Promise<void> {
    await this.removeUserSelect.selectOption({ label: optionName });
    await this.removeUserButton.click();
  }

  public async cancelPendingRecipientForCase(caseId: string, recipientName: string): Promise<void> {
    await this.caseSection(caseId)
      .getByRole('link', { name: new RegExp(`^Cancel.*${escapeRegExp(recipientName)}.*case$`) })
      .click();
  }
}
