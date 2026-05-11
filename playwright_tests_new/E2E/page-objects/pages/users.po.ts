import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from '../base';

export class UsersPage extends BasePage {
  public readonly heading: Locator;
  public readonly inviteUserButton: Locator;
  public readonly userList: Locator;
  public readonly userDetails: Locator;
  public readonly userDetailsHeading: Locator;
  public readonly changePermissionsLink: Locator;
  public readonly suspendAccountButton: Locator;
  public readonly suspendConfirmationHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Users' });
    this.inviteUserButton = page.getByRole('button', { name: 'Invite user' });
    this.userList = page.locator('xuilib-user-list');
    this.userDetails = page.locator('xuilib-user-details');
    this.userDetailsHeading = page.getByRole('heading', { name: 'User details' });
    this.changePermissionsLink = this.userDetails.getByRole('link', { name: 'Change' });
    this.suspendAccountButton = page.getByRole('button', { name: 'Suspend account' });
    this.suspendConfirmationHeading = page.getByRole('heading', {
      name: 'Are you sure you want to suspend this account?'
    });
  }

  public async open(): Promise<void> {
    await this.page.getByRole('link', { name: 'Users', exact: true }).click();
  }

  public activeUserRow(): Locator {
    return this.page
      .locator('tbody tr')
      .filter({ has: this.page.locator('td', { hasText: /^Active$/ }) })
      .first();
  }

  public async openFirstActiveUser(): Promise<void> {
    await expect(this.userList).toBeVisible();

    for (let pageNumber = 1; pageNumber <= 10; pageNumber++) {
      const activeUserLink = this.activeUserRow().locator('a').first();

      if (await activeUserLink.isVisible()) {
        await activeUserLink.click();
        return;
      }

      const nextPageLink = this.page
        .locator('li.hmcts-pagination__item--next a.hmcts-pagination__link')
        .first();

      if (!(await nextPageLink.isVisible())) {
        break;
      }

      await nextPageLink.click();
      await expect(this.userList).toBeVisible();
    }

    throw new Error('No active user found in the users list');
  }

  public async openSuspendConfirmation(): Promise<void> {
    await this.suspendAccountButton.click();
  }
}
