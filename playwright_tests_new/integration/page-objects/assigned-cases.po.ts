import type { Locator, Page } from '@playwright/test';
import { CaseListPage } from './case-list.po';

export class AssignedCasesPage extends CaseListPage {
  public readonly manageCaseSharingButton: Locator;

  constructor(page: Page) {
    super(page, 'Cases');
    this.manageCaseSharingButton = this.page.locator('#btn-share-unassigned-case-button');
  }

  public async gotoAssignedCases(): Promise<void> {
    await this.page.goto('/cases');
  }

  public async showAssignedCasesFilter(): Promise<void> {
    await this.filterButton('Show cases filter').click();
  }

  public async hideAssignedCasesFilter(): Promise<void> {
    await this.filterButton('Hide cases filter').click();
  }

  public async selectAllAssignedCasesFilter(): Promise<void> {
    await this.page.locator('#allAssignedCases').check();
  }

  public async selectCaseReferenceFilter(): Promise<void> {
    await this.page.locator('#findCaseByReferenceNumber').check();
  }

  public async startCaseSharing(): Promise<void> {
    await this.manageCaseSharingButton.click();
  }
}
