import { config } from '../config/config';

export async function signIn(page: any, user: string = 'base') {
  const { username, password } = config[user];
  await page.goto(config.baseUrl);
  await page.getByLabel('Email address').click();
  await page.getByLabel('Email address').fill(username);
  await page.getByLabel('Password').click();
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Sign in' }).click();
  console.log('Signed in as ' + username);
}

export async function signOut(page) {
  try {
    await page.getByText('Sign out').click();
    console.log('Signed out');
  } catch (error) {
    console.log(`Sign out failed: ${error}`);
  }
}
