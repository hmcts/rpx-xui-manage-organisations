import { BasePage } from '../base';

export class IdamPage extends BasePage {
  public readonly heading = this.page.getByRole('heading', { name: /sign in/i });
  public readonly usernameInput = this.page.getByLabel('Email address');
  public readonly passwordInput = this.page.getByLabel('Password');
  public readonly submitBtn = this.page.getByRole('button', { name: 'Sign in' });

  public async signIn(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await Promise.all([
      this.page.waitForURL((url) => url.pathname !== '/login'),
      this.submitBtn.click()
    ]);
    await this.page.waitForLoadState('domcontentloaded');
  }
}
