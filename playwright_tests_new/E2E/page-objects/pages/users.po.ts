import type { Locator, Page } from '@playwright/test';
import { BasePage } from '../base';

export class UsersPage extends BasePage {
  public readonly heading: Locator;
  public readonly inviteUserButton: Locator;
  public readonly userList: Locator;
  public readonly userDetails: Locator;
  public readonly userDetailsHeading: Locator;
  public readonly pendingUserDetailsHeading: Locator;
  public readonly changePermissionsLink: Locator;
  public readonly editUserHeading: Locator;
  public readonly suspendAccountButton: Locator;
  public readonly suspendConfirmationHeading: Locator;
  public readonly resendInvitationButton: Locator;
  public readonly inviteUserHeading: Locator;
  public readonly firstNameInput: Locator;
  public readonly lastNameInput: Locator;
  public readonly emailInput: Locator;
  public readonly backLink: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Users' });
    this.inviteUserButton = page.getByRole('button', { name: 'Invite user' });
    this.userList = page.locator('xuilib-user-list');
    this.userDetails = page.locator('xuilib-user-details');
    this.userDetailsHeading = page.getByRole('heading', { name: 'User details' });
    this.pendingUserDetailsHeading = page.getByRole('heading', { name: 'Pending user details' });
    this.changePermissionsLink = this.userDetails.getByRole('link', { name: 'Change' });
    this.editUserHeading = page.getByRole('heading', { name: 'Edit user' });
    this.suspendAccountButton = page.getByRole('button', { name: 'Suspend account' });
    this.suspendConfirmationHeading = page.getByRole('heading', {
      name: 'Are you sure you want to suspend this account?'
    });
    this.resendInvitationButton = page.locator('#resend-invite-button');
    this.inviteUserHeading = page.getByRole('heading', { name: 'Invite user' });
    this.firstNameInput = page.locator('#firstName');
    this.lastNameInput = page.locator('#lastName');
    this.emailInput = page.locator('#email');
    this.backLink = page.getByRole('link', { name: 'Back', exact: true });
  }

  public async open(): Promise<void> {
    await this.page.getByRole('link', { name: 'Users', exact: true }).click();
  }

  public userRowByStatus(status: 'Active' | 'Pending'): Locator {
    return this.page
      .locator('tbody tr')
      .filter({ has: this.page.locator('td', { hasText: new RegExp(`^${status}$`) }) })
      .first();
  }

  public async openFirstUserByStatus(status: 'Active' | 'Pending') {
    await this.userList.waitFor({ state: 'visible' });

    for (let pageNumber = 1; pageNumber <= 10; pageNumber++) {
      const userRow = this.userRowByStatus(status);
      const userLink = userRow.locator('a').first();

      if (await userLink.isVisible()) {
        const selectedUser = {
          href: (await userLink.getAttribute('href')) ?? '',
          linkText: (await userLink.innerText()).trim(),
          rowText: (await userRow.innerText()).trim(),
        };
        await userLink.click();
        return selectedUser;
      }

      const nextPageLink = this.page
        .locator('li.hmcts-pagination__item--next a.hmcts-pagination__link')
        .first();

      if (!(await nextPageLink.isVisible())) {
        break;
      }

      await nextPageLink.click();
      await this.userList.waitFor({ state: 'visible' });
    }

    return null;
  }

  public async openFirstActiveUser(): Promise<void> {
    const selectedUser = await this.openFirstUserByStatus('Active');
    if (!selectedUser) {
      throw new Error('No active user found in the users list');
    }
  }

  public async openEditPermissions(): Promise<void> {
    await this.changePermissionsLink.click();
  }

  public async openReinvite(): Promise<void> {
    await this.resendInvitationButton.click();
  }

  public async openSuspendConfirmation(): Promise<void> {
    await this.suspendAccountButton.click();
  }

  public permissionCheckbox(label: string): Locator {
    const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return this.page.getByRole('checkbox', { name: new RegExp(`${escapedLabel}$`, 'i') });
  }
}
