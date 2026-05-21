import type { Locator, Page } from '@playwright/test';
import { CaseListPage } from './case-list.po';

export class AssignedCasesPage extends CaseListPage {
  public readonly manageCaseSharingButton: Locator;

  constructor(page: Page) {
    super(page, 'Assigned Cases');
    this.manageCaseSharingButton = this.page.locator('#btn-share-assigned-case-button');
  }

  public async gotoAssignedCases(): Promise<void> {
    await this.page.goto('/assigned-cases');
  }

  public async showAssignedCasesFilter(): Promise<void> {
    await this.filterButton('Show assigned cases filter').click();
  }

  public async hideAssignedCasesFilter(): Promise<void> {
    await this.filterButton('Hide assigned cases filter').click();
  }

  public async startCaseSharing(): Promise<void> {
    await this.manageCaseSharingButton.click();
  }
}
