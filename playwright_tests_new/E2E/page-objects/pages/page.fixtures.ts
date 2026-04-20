import type { Page } from '@playwright/test';
import { IdamPage } from './idam.po';

export interface PageFixtures {
  idamPage: IdamPage;
}

export const pageFixtures = {
  idamPage: async ({ page }: { page: Page }, use: (value: IdamPage) => Promise<void>) => {
    await use(new IdamPage(page));
  }
};
