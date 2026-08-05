import type { Locator, Page } from '@playwright/test';

export class CaseShareCompletePage {
  public readonly assignedCasesLink: Locator;
  public readonly heading: Locator;
  public readonly unassignedCasesLink: Locator;

  constructor(private readonly page: Page) {
    this.assignedCasesLink = this.page.getByRole('link', { name: 'Go to assigned cases list' });
    this.heading = this.page.getByRole('heading', {
      name: 'Your selected cases have been updated',
      exact: true
    });
    this.unassignedCasesLink = this.page.getByRole('link', { name: 'Go to unassigned cases list' });
  }

  public whatHappensNextText(text: string): Locator {
    return this.page.getByText(text, { exact: true });
  }
}
