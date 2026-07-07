import { expect, test } from '../../fixtures';
import { attachWaveLikeAccessibilityEvidence, collectWaveLikeAccessibilityViolations } from '../../utils/accessibility/waveLikeAccessibility';
import type { RegisterOrganisationPage } from '../../page-objects/pages/register-organisation.po';
import { createRegisterOrganisationData } from '../../utils/test-setup/register-organisation-data';
import {
  completeMinimumRegisterOrganisationJourney,
  completeOptionalRegisterOrganisationJourney
} from '../../utils/test-setup/register-organisation-journeys';

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
};

type RegisterOrganisationJourneyState = {
  name: string;
  expectedErrors?: readonly string[];
  expectedSelectors: readonly string[];
  prepare: (registerOrganisationPage: RegisterOrganisationPage) => Promise<void>;
};

const expectWaveLikeAccessibility = async (
  page: Parameters<typeof collectWaveLikeAccessibilityViolations>[0],
  testInfo: Parameters<typeof attachWaveLikeAccessibilityEvidence>[1]
): Promise<void> => {
  const violations = await collectWaveLikeAccessibilityViolations(page);
  await attachWaveLikeAccessibilityEvidence(page, testInfo, violations);
  expect(
    violations,
    [
      'WAVE-like accessibility checks found issues.',
      'Open the attached WAVE-like HTML/JSON and highlighted screenshot evidence.',
      `Current URL: ${page.url()}`,
      JSON.stringify(violations, null, 2)
    ].join('\n')
  ).toEqual([]);
};

const registerOrganisationPages = [
  { name: 'before you start', path: 'register', component: 'app-before-you-start' },
  { name: 'company house details', path: 'company-house-details', component: 'app-company-house-details' },
  { name: 'organisation type', path: 'organisation-type', component: 'app-organisation-type' },
  { name: 'regulatory organisation type', path: 'regulatory-organisation-type', component: 'app-regulatory-organisation-type' },
  { name: 'document exchange reference', path: 'document-exchange-reference', component: 'app-document-exchange-reference' },
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
  { name: 'payment by account', path: 'payment-by-account', component: 'app-payment-by-account' },
  { name: 'payment by account details', path: 'payment-by-account-details', component: 'app-payment-by-account-details' },
  { name: 'registered address', path: 'registered-address/external', component: 'app-registered-address' },
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
  { name: 'contact details', path: 'contact-details', component: 'app-contact-details' },
  { name: 'registration submitted', path: 'registration-submitted', component: 'app-registration-submitted' },
  { name: 'check your answers', path: 'check-your-answers', component: 'app-check-your-answers' }
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
      await registerOrganisationPage.organisationNameInput.fill('Playwright WAVE Organisation');
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
      await registerOrganisationPage.regulatorTypeSelect.selectOption({ label: 'Solicitor Regulation Authority (SRA)' });
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
    name: 'contact details missing last name and email',
    path: 'contact-details',
    component: 'app-contact-details',
    expectedErrors: ['Enter last name', 'Enter email address'],
    prepare: async (registerOrganisationPage) => {
      await registerOrganisationPage.firstNameInput.fill('Playwright');
      await registerOrganisationPage.continueWith();
    }
  },
  {
    name: 'contact details missing email',
    path: 'contact-details',
    component: 'app-contact-details',
    expectedErrors: ['Enter email address'],
    prepare: async (registerOrganisationPage) => {
      await registerOrganisationPage.firstNameInput.fill('Playwright');
      await registerOrganisationPage.lastNameInput.fill('Accessibility');
      await registerOrganisationPage.continueWith();
    }
  },
  {
    name: 'contact details invalid email',
    path: 'contact-details',
    component: 'app-contact-details',
    expectedErrors: ['Enter email address'],
    prepare: async (registerOrganisationPage) => {
      await registerOrganisationPage.firstNameInput.fill('Playwright');
      await registerOrganisationPage.lastNameInput.fill('Accessibility');
      await registerOrganisationPage.workEmailAddressInput.fill('not-an-email');
      await registerOrganisationPage.continueWith();
    }
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
      await registerOrganisationPage.regulatorTypeSelect.selectOption({ label: 'Solicitor Regulation Authority (SRA)' });
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
    name: 'registered address lookup results',
    path: 'registered-address/external',
    component: 'app-registered-address',
    expectedSelectors: ['#addressList'],
    prepare: async (registerOrganisationPage) => {
      await registerOrganisationPage.postcodeInput.fill('SW1A 1AA');
      await registerOrganisationPage.findAddressButton.click();
      await registerOrganisationPage.addressList.waitFor({ state: 'visible' });
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
  }
] as const satisfies readonly RegisterOrganisationInteractiveState[];

const termsAndConditionsError = 'Please select checkbox to confirm you have read and understood the terms and conditions';

const registerOrganisationJourneyStates = [
  {
    name: 'check your answers optional journey',
    expectedSelectors: ['#confirm-terms-and-conditions'],
    prepare: async (registerOrganisationPage) => {
      await completeOptionalRegisterOrganisationJourney(registerOrganisationPage, createRegisterOrganisationData());
    }
  },
  {
    name: 'check your answers minimum journey',
    expectedSelectors: ['#confirm-terms-and-conditions'],
    prepare: async (registerOrganisationPage) => {
      await completeMinimumRegisterOrganisationJourney(registerOrganisationPage, createRegisterOrganisationData());
    }
  },
  {
    name: 'check your answers terms and conditions error',
    expectedErrors: [termsAndConditionsError],
    expectedSelectors: ['#confirm-terms-and-conditions'],
    prepare: async (registerOrganisationPage) => {
      await completeOptionalRegisterOrganisationJourney(registerOrganisationPage, createRegisterOrganisationData());
      await registerOrganisationPage.continueWith('Confirm and submit');
    }
  }
] as const satisfies readonly RegisterOrganisationJourneyState[];

test.describe('Manage Organisation WAVE-like accessibility @wave-a11y', () => {
  test.beforeEach(async ({ signedInPage }) => {
    await expect(signedInPage.getByRole('link', { name: 'Organisation', exact: true })).toBeVisible();
  });

  test('organisation details page passes WAVE-like structural checks', async ({ signedInPage, organisationPage }, testInfo) => {
    await organisationPage.open();
    await expect(organisationPage.heading).toBeVisible();
    await expect(organisationPage.root).toBeVisible();
    await expectWaveLikeAccessibility(signedInPage, testInfo);
  });

  test('users page passes WAVE-like structural checks', async ({ signedInPage, usersPage }, testInfo) => {
    await usersPage.open();
    await expect(usersPage.heading).toBeVisible();
    await expect(usersPage.inviteUserButton).toBeVisible();
    await expect(usersPage.userList).toBeVisible();
    await expectWaveLikeAccessibility(signedInPage, testInfo);
  });

  test('invite user validation state passes WAVE-like structural checks', async ({ signedInPage, usersPage }, testInfo) => {
    await usersPage.open();
    await usersPage.openInviteUser();
    await usersPage.submitInvite();
    await expect(usersPage.validationSummaryError('Enter first name')).toBeVisible();
    await expect(usersPage.validationSummaryError('Enter last name')).toBeVisible();
    await expect(usersPage.validationSummaryError('Enter a valid email address')).toBeVisible();
    await expectWaveLikeAccessibility(signedInPage, testInfo);
  });

  test('register organisation before-you-start page passes WAVE-like structural checks', async ({
    page,
    registerOrganisationPage
  }, testInfo) => {
    await registerOrganisationPage.openWorkflowPage('register');
    await expect(page).toHaveURL(/\/register-org-new\/register$/);
    await expect(page.locator('app-before-you-start')).toBeVisible();
    await expectWaveLikeAccessibility(page, testInfo);
  });

  test('register organisation validation state passes WAVE-like structural checks', async ({
    page,
    registerOrganisationPage
  }, testInfo) => {
    await registerOrganisationPage.openWorkflowPage('organisation-type');
    await expect(page.locator('app-organisation-type')).toBeVisible();
    await registerOrganisationPage.continueWith();
    await expect(registerOrganisationPage.validationSummaryError('Please select an organisation')).toBeVisible();
    await expectWaveLikeAccessibility(page, testInfo);
  });

  for (const registerOrganisationPageRoute of registerOrganisationPages) {
    test(
      `${registerOrganisationPageRoute.name} route passes WAVE-like structural checks`,
      { tag: ['@registration'] },
      async ({ page, registerOrganisationPage }, testInfo) => {
        await registerOrganisationPage.openWorkflowPage(registerOrganisationPageRoute.path);
        await expect(page).toHaveURL(new RegExp(`/register-org-new/${registerOrganisationPageRoute.path}$`));
        await expect(page.locator(registerOrganisationPageRoute.component)).toBeVisible();
        await expectWaveLikeAccessibility(page, testInfo);
      }
    );
  }

  for (const validationState of registerOrganisationValidationStates) {
    test(
      `${validationState.name} error state passes WAVE-like structural checks`,
      { tag: ['@registration', '@validation'] },
      async ({ page, registerOrganisationPage }, testInfo) => {
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
        await expectWaveLikeAccessibility(page, testInfo);
      }
    );
  }

  for (const interactiveState of registerOrganisationInteractiveStates) {
    test(
      `${interactiveState.name} interactive state passes WAVE-like structural checks`,
      { tag: ['@registration'] },
      async ({ page, registerOrganisationPage }, testInfo) => {
        await registerOrganisationPage.openWorkflowPage(interactiveState.path);
        await expect(page).toHaveURL(new RegExp(`/register-org-new/${interactiveState.path}$`));
        await expect(page.locator(interactiveState.component)).toBeVisible();

        await interactiveState.prepare(registerOrganisationPage);

        await expect(page.locator(interactiveState.component)).toBeVisible();
        for (const expectedSelector of interactiveState.expectedSelectors) {
          await expect(page.locator(expectedSelector)).toBeVisible();
        }
        await expectWaveLikeAccessibility(page, testInfo);
      }
    );
  }

  for (const journeyState of registerOrganisationJourneyStates) {
    test(
      `${journeyState.name} state passes WAVE-like structural checks`,
      { tag: ['@registration'] },
      async ({ page, registerOrganisationPage }, testInfo) => {
        await journeyState.prepare(registerOrganisationPage);

        await expect(page).toHaveURL(/\/register-org-new\/check-your-answers$/);
        await expect(registerOrganisationPage.checkYourAnswersHeading).toBeVisible();
        for (const expectedSelector of journeyState.expectedSelectors) {
          await expect(page.locator(expectedSelector)).toBeVisible();
        }
        for (const expectedError of journeyState.expectedErrors ?? []) {
          await expect(registerOrganisationPage.validationSummaryError(expectedError)).toBeVisible();
        }
        await expectWaveLikeAccessibility(page, testInfo);
      }
    );
  }
});
