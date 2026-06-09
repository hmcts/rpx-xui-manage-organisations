import { test as base } from '@playwright/test';
import type { Page } from '@playwright/test';
import { setupManageOrgBaseRoutes } from './helpers';

interface ManageOrgIntegrationFixtures {
  manageOrgIntegrationPage: Page;
}

export const test = base.extend<ManageOrgIntegrationFixtures>({
  manageOrgIntegrationPage: async ({ page }, use) => {
    await setupManageOrgBaseRoutes(page);
    await use(page);
  }
});

export { expect } from '@playwright/test';
