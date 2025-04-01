import { config } from '../config/config';
import { expect } from '@playwright/test';

export async function signIn(page: any, user: string = 'base') {
  const { username, password } = config[user];
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      await page.goto(config.baseUrl);
      // Ensure fields are visible before interacting
      await page.getByLabel('Email address').click();
      await page.getByLabel('Email address').fill(username);
      await page.getByLabel('Password').click();
      await page.getByLabel('Password').fill(password);
      await page.getByRole('button', { name: 'Sign in' }).click();

      // Wait for navigation after login attempt
      if (!page.url().includes('idam')) {
        console.log('Signed in as ' + username);
        return;
      }

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
