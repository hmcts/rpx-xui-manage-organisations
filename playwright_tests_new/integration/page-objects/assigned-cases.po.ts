import type { Locator, Page } from '@playwright/test';

export class AssignedCasesPage {
  public readonly assignedCasesHeading: Locator;
  public readonly caseList: Locator;
  public readonly manageCaseSharingButton: Locator;

  constructor(private readonly page: Page) {
    this.assignedCasesHeading = this.page.getByRole('heading', { name: 'Assigned Cases' });
    this.caseList = this.page.locator('ccd-case-list');
    this.manageCaseSharingButton = this.page.locator('#btn-share-assigned-case-button');
  }

  public async gotoAssignedCases(): Promise<void> {
    await this.page.goto('/assigned-cases');
  }

  public filterButton(name: string): Locator {
    return this.page.getByRole('button', { name, exact: true });
  }

  public caseTypeTab(caseType: string): Locator {
    return this.page.getByRole('tab', { name: caseType, exact: true });
  }

  public caseCheckbox(caseId: string): Locator {
    return this.page.locator(`#select-${caseId}`);
  }

  public async showAssignedCasesFilter(): Promise<void> {
    await this.filterButton('Show assigned cases filter').click();
  }

  public async hideAssignedCasesFilter(): Promise<void> {
    await this.filterButton('Hide assigned cases filter').click();
  }

  public async openCaseTypeTab(caseType: string): Promise<void> {
    await this.caseTypeTab(caseType).click();
  }

  public async selectCase(caseId: string): Promise<void> {
    await this.caseCheckbox(caseId).check();
  }
}
