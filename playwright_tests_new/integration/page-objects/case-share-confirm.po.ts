import type { Locator, Page } from '@playwright/test';

export class CaseShareConfirmPage {
  public readonly confirmButton: Locator;
  public readonly heading: Locator;

  constructor(private readonly page: Page) {
    this.confirmButton = this.page.getByRole('button', { name: 'Confirm', exact: true });
    this.heading = this.page.getByRole('heading', {
      name: /Check and confirm your selection/
    });
  }

  public confirmCaseBlock(caseId: string): Locator {
    return this.page.locator(`#user-access-block-${caseId}`);
  }

  public async confirm(): Promise<void> {
    await this.confirmButton.click();
  }
}
