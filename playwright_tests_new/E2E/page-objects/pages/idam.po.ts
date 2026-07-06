import { BasePage } from '../base';

export class IdamPage extends BasePage {
  public readonly heading = this.page.getByRole('heading', { name: /Sign in|Enter your email/i }).first();
  public readonly usernameInput = this.page.getByLabel(/Email address|Enter your work email address/i).first();
  public readonly passwordInput = this.page.getByLabel('Password').first();
  public readonly submitBtn = this.page.getByRole('button', { name: /^(Continue|Sign in)$/i }).first();

  public async signIn(username: string, password: string): Promise<void> {
    await this.usernameInput.waitFor({ state: 'visible' });
    await this.usernameInput.fill(username);

    if (!(await this.passwordInput.isVisible().catch(() => false))) {
      await this.submitBtn.click();
      await this.page.waitForLoadState('domcontentloaded', { timeout: 15_000 }).catch(() => undefined);
      await this.passwordInput.waitFor({ state: 'visible' });
    }

    await this.passwordInput.fill(password);
    await Promise.all([
      this.page.waitForURL((url) => !url.hostname.includes('idam') && !url.pathname.includes('/login')),
      this.submitBtn.click()
    ]);
    await this.page.waitForLoadState('domcontentloaded');
  }
}
