import type { Page } from '@playwright/test';
import { IdamPage } from './idam.po';
import { RegisterOrganisationPage } from './register-organisation.po';

export interface PageFixtures {
  idamPage: IdamPage;
  registerOrganisationPage: RegisterOrganisationPage;
}

export const pageFixtures = {
  idamPage: async ({ page }: { page: Page }, use: (value: IdamPage) => Promise<void>) => {
    await use(new IdamPage(page));
  },
  registerOrganisationPage: async ({ page }: { page: Page }, use: (value: RegisterOrganisationPage) => Promise<void>) => {
    await use(new RegisterOrganisationPage(page));
  }
};
