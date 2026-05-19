import type { Locator, Page } from '@playwright/test';

export class CaseListPage {
  public readonly applyFilterButton: Locator;
  public readonly caseList: Locator;
  public readonly caseReferenceError: Locator;
  public readonly caseReferenceFilterInput: Locator;
  public readonly pageHeading: Locator;

  constructor(protected readonly page: Page, heading: string) {
    this.applyFilterButton = this.page.getByRole('button', { name: 'Apply filter' });
    this.caseList = this.page.locator('ccd-case-list');
    this.caseReferenceError = this.page.locator('#case-reference-number-error-message');
    this.caseReferenceFilterInput = this.page.locator('#case-reference-number');
    this.pageHeading = this.page.getByRole('heading', { name: heading, exact: true });
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

  public filterRadio(filterType: string): Locator {
    return this.page.locator(`#caa-filter-${filterType}`);
  }

  public async openCaseTypeTab(caseType: string): Promise<void> {
    await this.caseTypeTab(caseType).click();
  }

  public async selectCase(caseId: string): Promise<void> {
    await this.caseCheckbox(caseId).check();
  }

  public async selectCases(caseIds: string[]): Promise<void> {
    for (const caseId of caseIds) {
      await this.selectCase(caseId);
    }
  }

  public async enterCaseReferenceFilter(caseReference: string): Promise<void> {
    await this.caseReferenceFilterInput.fill(caseReference);
  }

  public async applyFilter(): Promise<void> {
    await this.applyFilterButton.click();
  }

  public async selectCaseReferenceFilter(): Promise<void> {
    await this.filterRadio('case-reference-number').check();
  }
}
