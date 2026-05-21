import type { Locator, Page } from '@playwright/test';

export class UserAdminPage {
  public readonly backLink: Locator;
  private readonly backControl: Locator;
  public readonly confirmationPanel: Locator;
  public readonly emailInput: Locator;
  public readonly editUserHeading: Locator;
  public readonly firstNameInput: Locator;
  public readonly heading: Locator;
  public readonly inviteUserButton: Locator;
  public readonly inviteUserHeading: Locator;
  public readonly lastNameInput: Locator;
  public readonly pendingUserDetailsHeading: Locator;
  public readonly resendInvitationButton: Locator;
  public readonly sendInvitationButton: Locator;
  public readonly submitButton: Locator;
  public readonly suspendAccountButton: Locator;
  public readonly suspendAccountHeading: Locator;
  public readonly userList: Locator;
  public readonly userDetailsHeading: Locator;

  constructor(private readonly page: Page) {
    this.backLink = this.page.getByRole('link', { name: 'Back', exact: true });
    this.backControl = this.page.locator('.govuk-back-link');
    this.confirmationPanel = this.page.locator('.govuk-panel--confirmation');
    this.emailInput = this.page.locator('#email');
    this.editUserHeading = this.page.getByRole('heading', { name: 'Edit user' });
    this.firstNameInput = this.page.locator('#firstName');
    this.heading = this.page.getByRole('heading', { name: 'Users' });
    this.inviteUserButton = this.page.getByRole('button', { name: 'Invite user' });
    this.inviteUserHeading = this.page.getByRole('heading', { name: 'Invite user' });
    this.lastNameInput = this.page.locator('#lastName');
    this.pendingUserDetailsHeading = this.page.getByRole('heading', { name: 'Pending user details' });
    this.resendInvitationButton = this.page.locator('#resend-invite-button');
    this.sendInvitationButton = this.page.getByRole('button', { name: 'Send invitation' });
    this.submitButton = this.page.getByRole('button', { name: 'Submit' });
    this.suspendAccountButton = this.page.getByRole('button', { name: 'Suspend account' });
    this.suspendAccountHeading = this.page.getByRole('heading', {
      name: 'Are you sure you want to suspend this account?'
    });
    this.userList = this.page.locator('xuilib-user-list');
    this.userDetailsHeading = this.page.getByRole('heading', { name: 'User details' });
  }

  public validationSummaryError(message: string): Locator {
    return this.page.getByRole('alert').getByText(message, { exact: true });
  }

  public permissionCheckbox(label: string): Locator {
    const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    return this.page.getByRole('checkbox', {
      name: new RegExp(`^(Permit users to )?${escapedLabel}$`, 'i')
    });
  }

  public userRow(userEmail: string): Locator {
    return this.page.locator('tbody tr').filter({
      has: this.page.locator('td', { hasText: userEmail })
    });
  }

  public userStatusCell(userEmail: string): Locator {
    return this.userRow(userEmail).locator('td').nth(2);
  }

  public userDetailValue(label: string): Locator {
    return this.page.locator('.govuk-table__row').filter({
      has: this.page.locator('.govuk-table__header', { hasText: label })
    }).locator('.govuk-table__cell').first();
  }

  public async openUsers(): Promise<void> {
    await this.page.goto('/users');
    await this.waitForLoader();
  }

  public async openInviteUser(): Promise<void> {
    await this.inviteUserButton.click();
    await this.waitForLoader();
  }

  public async openUserDetails(userEmail: string): Promise<void> {
    await this.userRow(userEmail).getByRole('link').click();
    await this.waitForLoader();
  }

  public async openReinvite(): Promise<void> {
    await this.resendInvitationButton.click();
    await this.waitForLoader();
  }

  public async openEditPermissions(): Promise<void> {
    await this.page.getByRole('link', { name: 'Change roles' }).click();
    await this.waitForLoader();
  }

  public async openSuspendConfirmation(): Promise<void> {
    await this.suspendAccountButton.click();
    await this.waitForLoader();
  }

  public async submitInvite(): Promise<void> {
    await this.sendInvitationButton.click();
    await this.waitForLoader();
  }

  public async submitEditPermissions(): Promise<void> {
    await this.submitButton.click();
    await this.waitForLoader();
  }

  public async confirmSuspendAccount(): Promise<void> {
    await this.suspendAccountButton.click();
    await this.waitForLoader();
  }

  public async fillInviteUser(user: {
    email: string;
    firstName: string;
    lastName: string;
  }): Promise<void> {
    await this.firstNameInput.fill(user.firstName);
    await this.lastNameInput.fill(user.lastName);
    await this.emailInput.fill(user.email);
  }

  public async selectPermissions(...permissionLabels: string[]): Promise<void> {
    for (const permissionLabel of permissionLabels) {
      await this.permissionCheckbox(permissionLabel).check();
    }
  }

  public async tableCellTexts(): Promise<string[]> {
    return this.page.locator('tbody td').evaluateAll((cells) =>
      cells.map((cell) => cell.textContent?.trim() ?? '')
    );
  }

  public async goBack(): Promise<void> {
    await this.backControl.click();
    await this.waitForLoader();
  }

  private async waitForLoader(): Promise<void> {
    await this.page.locator('app-loader .overlay').waitFor({ state: 'hidden' });
  }
}
