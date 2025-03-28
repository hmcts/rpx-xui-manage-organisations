import { config } from '../config/config';

export async function signIn(page: any, user: string = 'base') {
  const { username, password } = config[user];
  await page.goto(config.baseUrl);
  await page.waitForLoadState('domcontentloaded');

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      // Ensure fields are visible before interacting
      await page.getByRole('textbox', { name: 'Email address' }).waitFor();
      await page.getByRole('textbox', { name: 'Email address' }).fill(username);
      await page.getByRole('textbox', { name: 'Password' }).fill(password);
      await page.getByRole('button', { name: 'Sign in' }).click();

      // Wait for navigation after login attempt
      await page.waitForLoadState('networkidle');
      console.log('Signed in as ' + username);

      console.log('First login attempt failed, retrying...');
    } catch (error) {
      console.error(`Login attempt ${attempt + 1} failed:`, error);
    }
  }
}

export async function signOut(page) {
  try {
    await page.getByText('Sign out').click();
    console.log('Signed out');
  } catch (error) {
    console.log(`Sign out failed: ${error}`);
  }
}
