import { AxeUtils } from '@hmcts/playwright-common';
import { test, expect } from '../../fixtures';
import type { RegisterOrganisationPage } from '../../page-objects/pages/register-organisation.po';

type RegisterOrganisationRoute = {
  name: string;
  path: string;
  component: string;
};

type RegisterOrganisationValidationState = RegisterOrganisationRoute & {
  expectedErrors: readonly string[];
  prepare?: (registerOrganisationPage: RegisterOrganisationPage) => Promise<void>;
};

type RegisterOrganisationInteractiveState = RegisterOrganisationRoute & {
  expectedSelectors: readonly string[];
  prepare: (registerOrganisationPage: RegisterOrganisationPage) => Promise<void>;
  skippedUntil?: {
    issue: string;
    reason: string;
  };
};

const registerOrganisationPages = [
  {
    name: 'before you start',
    path: 'register',
    component: 'app-before-you-start'
  },
  {
    name: 'company house details',
    path: 'company-house-details',
    component: 'app-company-house-details'
  },
  {
    name: 'organisation type',
    path: 'organisation-type',
    component: 'app-organisation-type'
  },
  {
    name: 'regulatory organisation type',
    path: 'regulatory-organisation-type',
    component: 'app-regulatory-organisation-type'
  },
  {
    name: 'document exchange reference',
    path: 'document-exchange-reference',
    component: 'app-document-exchange-reference'
  },
  {
    name: 'document exchange reference details',
    path: 'document-exchange-reference-details',
    component: 'app-document-exchange-reference-details'
  },
  {
    name: 'organisation services access',
    path: 'organisation-services-access',
    component: 'app-organisation-services-access'
  },
  {
    name: 'payment by account',
    path: 'payment-by-account',
    component: 'app-payment-by-account'
  },
  {
    name: 'payment by account details',
    path: 'payment-by-account-details',
    component: 'app-payment-by-account-details'
  },
  {
    name: 'registered address',
    path: 'registered-address/external',
    component: 'app-registered-address'
  },
  {
    name: 'individual registered with regulator',
    path: 'individual-registered-with-regulator',
    component: 'app-individual-registered-with-regulator'
  },
  {
    name: 'individual registered with regulator details',
    path: 'individual-registered-with-regulator-details',
    component: 'app-individual-registered-with-regulator-details'
  },
  {
    name: 'contact details',
    path: 'contact-details',
    component: 'app-contact-details'
  },
  {
    name: 'registration submitted',
    path: 'registration-submitted',
    component: 'app-registration-submitted'
  },
  {
    name: 'check your answers',
    path: 'check-your-answers',
    component: 'app-check-your-answers'
  }
] as const satisfies readonly RegisterOrganisationRoute[];

const registerOrganisationValidationStates = [
  {
    name: 'organisation type missing selection',
    path: 'organisation-type',
    component: 'app-organisation-type',
    expectedErrors: ['Please select an organisation']
  },
  {
    name: 'company house details missing organisation name',
    path: 'company-house-details',
    component: 'app-company-house-details',
    expectedErrors: ['Enter an organisation name']
  },
  {
    name: 'company house details invalid company number',
    path: 'company-house-details',
    component: 'app-company-house-details',
    expectedErrors: ['Enter a valid Companies House number'],
    prepare: async (registerOrganisationPage) => {
      await registerOrganisationPage.organisationNameInput.fill('Playwright A11y Organisation');
      await registerOrganisationPage.companyHouseNumberInput.fill('ABC');
      await registerOrganisationPage.continueWith();
    }
  },
  {
    name: 'registered address missing postcode',
    path: 'registered-address/external',
    component: 'app-registered-address',
    expectedErrors: ['Enter a valid postcode']
  },
  {
    name: 'document exchange missing selection',
    path: 'document-exchange-reference',
    component: 'app-document-exchange-reference',
    expectedErrors: ['Please select an option']
  },
  {
    name: 'document exchange details invalid reference',
    path: 'document-exchange-reference-details',
    component: 'app-document-exchange-reference-details',
    expectedErrors: ['Enter valid DX number', 'Enter valid DX exchange'],
    prepare: async (registerOrganisationPage) => {
      await registerOrganisationPage.dxNumberInput.fill('12345678912345');
      await registerOrganisationPage.dxExchangeInput.fill('123456789123456789123');
      await registerOrganisationPage.continueWith();
    }
  },
  {
    name: 'regulatory organisation missing selection',
    path: 'regulatory-organisation-type',
    component: 'app-regulatory-organisation-type',
    expectedErrors: ['Please select a regulatory organisation']
  },
  {
    name: 'regulatory organisation missing registration reference',
    path: 'regulatory-organisation-type',
    component: 'app-regulatory-organisation-type',
    expectedErrors: ['Enter a registration reference'],
    prepare: async (registerOrganisationPage) => {
      await registerOrganisationPage.regulatorTypeSelect.selectOption({
        label: 'Solicitor Regulation Authority (SRA)'
      });
      await registerOrganisationPage.continueWith();
    }
  },
  {
    name: 'organisation services missing selection',
    path: 'organisation-services-access',
    component: 'app-organisation-services-access',
    expectedErrors: ['Please select at least one service']
  },
  {
    name: 'payment by account missing selection',
    path: 'payment-by-account',
    component: 'app-payment-by-account',
    expectedErrors: ['Please select an option']
  },
  {
    name: 'payment by account details invalid PBA number',
    path: 'payment-by-account-details',
    component: 'app-payment-by-account-details',
    expectedErrors: ['Enter a valid PBA number'],
    prepare: async (registerOrganisationPage) => {
      await registerOrganisationPage.fillPaymentByAccountNumber('PBAABC1234');
      await registerOrganisationPage.continueWith();
    }
  },
  {
    name: 'payment by account details duplicate PBA number',
    path: 'payment-by-account-details',
    component: 'app-payment-by-account-details',
    expectedErrors: ['You have entered this PBA number more than once'],
    prepare: async (registerOrganisationPage) => {
      await registerOrganisationPage.fillPaymentByAccountNumber('PBA1234567');
      await registerOrganisationPage.addAnotherPbaButton.click();
      await registerOrganisationPage.fillPaymentByAccountNumber('PBA1234567', 1);
      await registerOrganisationPage.continueWith();
    }
  },
  {
    name: 'contact details missing required fields',
    path: 'contact-details',
    component: 'app-contact-details',
    expectedErrors: ['Enter first name', 'Enter last name', 'Enter email address']
  },
  {
    name: 'individual regulator missing selection',
    path: 'individual-registered-with-regulator',
    component: 'app-individual-registered-with-regulator',
    expectedErrors: ['Please select an option']
  },
  {
    name: 'individual regulator details missing selection',
    path: 'individual-registered-with-regulator-details',
    component: 'app-individual-registered-with-regulator-details',
    expectedErrors: ['Please select a regulatory organisation']
  },
  {
    name: 'individual regulator details missing registration reference',
    path: 'individual-registered-with-regulator-details',
    component: 'app-individual-registered-with-regulator-details',
    expectedErrors: ['Enter a registration reference'],
    prepare: async (registerOrganisationPage) => {
      await registerOrganisationPage.regulatorTypeSelect.selectOption({
        label: 'Solicitor Regulation Authority (SRA)'
      });
      await registerOrganisationPage.continueWith();
    }
  }
] as const satisfies readonly RegisterOrganisationValidationState[];

const registerOrganisationInteractiveStates = [
  {
    name: 'registered address manual UK address',
    path: 'registered-address/external',
    component: 'app-registered-address',
    expectedSelectors: ['#addressLine1', '#postTown', '#postCode'],
    prepare: async (registerOrganisationPage) => {
      await registerOrganisationPage.manualAddressLink.click();
      await registerOrganisationPage.ukAddressYesRadio.check();
    }
  },
  {
    name: 'registered address manual international address',
    path: 'registered-address/external',
    component: 'app-registered-address',
    expectedSelectors: ['#addressLine1', '#postTown', '#country'],
    prepare: async (registerOrganisationPage) => {
      await registerOrganisationPage.manualAddressLink.click();
      await registerOrganisationPage.ukAddressNoRadio.check();
    }
  },
  {
    name: 'regulatory organisation other regulator fields',
    path: 'regulatory-organisation-type',
    component: 'app-regulatory-organisation-type',
    expectedSelectors: ['#regulator-name0', '#organisation-registration-number0'],
    skippedUntil: {
      issue: 'EXUI-4639',
      reason: 'Known MO accessibility defect: the conditional regulator name input is not programmatically associated with its visible label.'
    },
    prepare: async (registerOrganisationPage) => {
      await registerOrganisationPage.regulatorTypeSelect.selectOption({ label: 'Other' });
    }
  },
  {
    name: 'payment by account additional PBA row',
    path: 'payment-by-account-details',
    component: 'app-payment-by-account-details',
    expectedSelectors: ['#pba-number-0', '#pba-number-1'],
    prepare: async (registerOrganisationPage) => {
      await registerOrganisationPage.addAnotherPbaButton.click();
    }
  },
  {
    name: 'individual regulator other regulator fields',
    path: 'individual-registered-with-regulator-details',
    component: 'app-individual-registered-with-regulator-details',
    expectedSelectors: ['#regulator-name0', '#organisation-registration-number0'],
    skippedUntil: {
      issue: 'EXUI-4639',
      reason: 'Known MO accessibility defect: the conditional regulator name input is not programmatically associated with its visible label.'
    },
    prepare: async (registerOrganisationPage) => {
      await registerOrganisationPage.regulatorTypeSelect.selectOption({ label: 'Other' });
    }
  }
] as const satisfies readonly RegisterOrganisationInteractiveState[];

test.describe('register organisation accessibility @a11y', () => {
  for (const registerOrganisationPageRoute of registerOrganisationPages) {
    test(
      `${registerOrganisationPageRoute.name} route has no automatically detectable accessibility violations`,
      { tag: ['@e2e', '@a11y', '@registration'] },
      async ({ page, registerOrganisationPage }, testInfo) => {
        const axeUtils = new AxeUtils(page);

        await registerOrganisationPage.openWorkflowPage(registerOrganisationPageRoute.path);

        await expect(page).toHaveURL(new RegExp(`/register-org-new/${registerOrganisationPageRoute.path}$`));
        await expect(page.locator(registerOrganisationPageRoute.component)).toBeVisible();
        await axeUtils.audit();
        await axeUtils.generateReport(testInfo, `${registerOrganisationPageRoute.name} accessibility report`);
      }
    );
  }

  for (const validationState of registerOrganisationValidationStates) {
    test(
      `${validationState.name} error state has no automatically detectable accessibility violations`,
      { tag: ['@e2e', '@a11y', '@registration', '@validation'] },
      async ({ page, registerOrganisationPage }, testInfo) => {
        const axeUtils = new AxeUtils(page);

        await registerOrganisationPage.openWorkflowPage(validationState.path);
        await expect(page).toHaveURL(new RegExp(`/register-org-new/${validationState.path}$`));
        await expect(page.locator(validationState.component)).toBeVisible();

        if (validationState.prepare) {
          await validationState.prepare(registerOrganisationPage);
        } else {
          await registerOrganisationPage.continueWith();
        }

        await expect(page.locator(validationState.component)).toBeVisible();
        await expect(page.getByRole('alert')).toBeVisible();
        for (const expectedError of validationState.expectedErrors) {
          await expect(registerOrganisationPage.validationSummaryError(expectedError)).toBeVisible();
        }
        await axeUtils.audit();
        await axeUtils.generateReport(testInfo, `${validationState.name} accessibility report`);
      }
    );
  }

  for (const interactiveState of registerOrganisationInteractiveStates) {
    const pendingIssueSuffix = interactiveState.skippedUntil
      ? ` - skipped pending ${interactiveState.skippedUntil.issue}`
      : '';

    test(
      `${interactiveState.name} interactive state has no automatically detectable accessibility violations${pendingIssueSuffix}`,
      { tag: ['@e2e', '@a11y', '@registration'] },
      async ({ page, registerOrganisationPage }, testInfo) => {
        test.skip(
          Boolean(interactiveState.skippedUntil),
          interactiveState.skippedUntil
            ? `${interactiveState.skippedUntil.issue}: ${interactiveState.skippedUntil.reason}`
            : ''
        );

        const axeUtils = new AxeUtils(page);

        await registerOrganisationPage.openWorkflowPage(interactiveState.path);
        await expect(page).toHaveURL(new RegExp(`/register-org-new/${interactiveState.path}$`));
        await expect(page.locator(interactiveState.component)).toBeVisible();

        await interactiveState.prepare(registerOrganisationPage);

        await expect(page.locator(interactiveState.component)).toBeVisible();
        for (const expectedSelector of interactiveState.expectedSelectors) {
          await expect(page.locator(expectedSelector)).toBeVisible();
        }
        await axeUtils.audit();
        await axeUtils.generateReport(testInfo, `${interactiveState.name} accessibility report`);
      }
    );
  }
});
