import { BasePage } from '../base';

export class IdamPage extends BasePage {
  public readonly heading = this.page.getByRole('heading', { name: /sign in/i });
  public readonly usernameInput = this.page.getByLabel('Email address');
  public readonly passwordInput = this.page.getByLabel('Password');
  public readonly submitBtn = this.page.getByRole('button', { name: 'Sign in' });
}
