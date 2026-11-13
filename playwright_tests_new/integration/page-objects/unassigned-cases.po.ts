import type { Locator, Page } from '@playwright/test';
import { CaseListPage } from './case-list.po';

export class UnassignedCasesPage extends CaseListPage {
  public readonly shareCaseButton: Locator;

  constructor(page: Page) {
    super(page, 'Unassigned Cases');
    this.shareCaseButton = this.page.locator('#btn-share-unassigned-case-button');
  }

  public async gotoUnassignedCases(): Promise<void> {
    await this.page.goto('/unassigned-cases');
  }

  public async showUnassignedCasesFilter(): Promise<void> {
    await this.filterButton('Show unassigned cases filter').click();
  }

  public async hideUnassignedCasesFilter(): Promise<void> {
    await this.filterButton('Hide unassigned cases filter').click();
  }

  public async startCaseSharing(): Promise<void> {
    await this.shareCaseButton.click();
  }
}
