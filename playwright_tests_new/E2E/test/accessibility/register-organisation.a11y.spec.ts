import { AxeUtils } from '@hmcts/playwright-common';
import { test, expect } from '../../fixtures';

test(
  'register organisation start page has no automatically detectable accessibility violations @a11y',
  { tag: ['@e2e', '@a11y', '@registration'] },
  async ({ page, registerOrganisationPage }, testInfo) => {
    const axeUtils = new AxeUtils(page);

    await registerOrganisationPage.openStartPage();

    await expect(page).toHaveURL(/\/register-org-new\/register$/);
    await expect(registerOrganisationPage.startPageHeading).toBeVisible();
    await expect(registerOrganisationPage.alreadyRegisteredHeading).toBeVisible();
    await expect(registerOrganisationPage.manageCasesLink).toBeVisible();
    await expect(registerOrganisationPage.manageOrganisationLink).toBeVisible();
    await axeUtils.audit();
    await axeUtils.generateReport(testInfo, 'Register organisation accessibility report');
  }
);
