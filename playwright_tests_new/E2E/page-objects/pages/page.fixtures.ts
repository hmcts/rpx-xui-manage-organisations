import type { Page } from '@playwright/test';
import { IdamPage } from './idam.po';
import { OrganisationPage } from './organisation.po';
import { RegisterOrganisationPage } from './register-organisation.po';

export interface PageFixtures {
  idamPage: IdamPage;
  organisationPage: OrganisationPage;
  registerOrganisationPage: RegisterOrganisationPage;
}

export const pageFixtures = {
  idamPage: async ({ page }: { page: Page }, use: (value: IdamPage) => Promise<void>) => {
    await use(new IdamPage(page));
  },
  organisationPage: async ({ page }: { page: Page }, use: (value: OrganisationPage) => Promise<void>) => {
    await use(new OrganisationPage(page));
  },
  registerOrganisationPage: async ({ page }: { page: Page }, use: (value: RegisterOrganisationPage) => Promise<void>) => {
    await use(new RegisterOrganisationPage(page));
  }
};
