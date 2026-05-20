import type { Page } from '@playwright/test';
import { expect, test } from '../../fixtures';
import {
  continuePopulatedOptionalJourneyFromContactDetailsToCheckYourAnswers,
  continuePopulatedOptionalJourneyFromOrganisationRegulatorToCheckYourAnswers,
  completeOptionalOtherOrganisationJourney,
  setupRegisterOrganisationRoutes
} from '../../helpers';
import {
  optionalOtherOrganisationRegistration,
  otherOrganisationType
} from '../../mocks/registerOrganisation.mock';
import { RegisterOrganisationPage } from '../../page-objects/register-organisation.po';

interface CheckYourAnswersChangeLinkCase {
  assertPopulatedFields: (page: Page, registerOrganisationPage: RegisterOrganisationPage) => Promise<void>;
  expectedUrl: RegExp;
  name: string;
  summaryLabel: string;
}

const checkYourAnswersChangeLinkCases: CheckYourAnswersChangeLinkCase[] = [
  {
    assertPopulatedFields: async (_page, registerOrganisationPage) => {
      await expect(registerOrganisationPage.otherOrganisationTypeRadio).toBeChecked();
      await expect(registerOrganisationPage.otherOrganisationTypeSelect.locator('option:checked')).toContainText(
        otherOrganisationType.value_en
      );
      await expect(registerOrganisationPage.otherOrganisationDetailInput).toHaveValue(
        optionalOtherOrganisationRegistration.otherOrganisationDetail
      );
    },
    expectedUrl: /\/register-org-new\/organisation-type$/,
    name: 'organisation type',
    summaryLabel: 'Organisation type'
  },
  {
    assertPopulatedFields: async (_page, registerOrganisationPage) => {
      await expect(registerOrganisationPage.organisationNameInput).toHaveValue(
        optionalOtherOrganisationRegistration.companyName
      );
      await expect(registerOrganisationPage.companyHouseNumberInput).toHaveValue(
        optionalOtherOrganisationRegistration.companyHouseNumber
      );
    },
    expectedUrl: /\/register-org-new\/company-house-details$/,
    name: 'organisation name',
    summaryLabel: 'Organisation name'
  },
  {
    assertPopulatedFields: async (_page, registerOrganisationPage) => {
      await expect(registerOrganisationPage.addressLine1Input).toHaveValue(
        optionalOtherOrganisationRegistration.manualUkAddress.addressLine1
      );
      await expect(registerOrganisationPage.postCodeInput).toHaveValue(
        optionalOtherOrganisationRegistration.manualUkAddress.postCode
      );
    },
    expectedUrl: /\/register-org-new\/registered-address\/internal$/,
    name: 'organisation address',
    summaryLabel: 'Organisation address'
  },
  {
    assertPopulatedFields: async (_page, registerOrganisationPage) => {
      await expect(registerOrganisationPage.dxNumberInput).toHaveValue(optionalOtherOrganisationRegistration.dxNumber);
      await expect(registerOrganisationPage.dxExchangeInput).toHaveValue(
        optionalOtherOrganisationRegistration.dxExchange
      );
    },
    expectedUrl: /\/register-org-new\/document-exchange-reference-details$/,
    name: 'DX reference',
    summaryLabel: 'What\'s the DX reference for this office?'
  },
  {
    assertPopulatedFields: async (_page, registerOrganisationPage) => {
      await expect(registerOrganisationPage.pbaNumberInput()).toHaveValue(
        optionalOtherOrganisationRegistration.pbaNumbers[0]
      );
      await expect(registerOrganisationPage.pbaNumberInput(1)).toHaveValue(
        optionalOtherOrganisationRegistration.pbaNumbers[1]
      );
    },
    expectedUrl: /\/register-org-new\/payment-by-account-details$/,
    name: 'PBA numbers',
    summaryLabel: 'What PBA numbers does your organisation use?'
  },
  {
    assertPopulatedFields: async (_page, registerOrganisationPage) => {
      await expect(registerOrganisationPage.regulatorTypeSelect.locator('option:checked')).toContainText('Other');
      await expect(registerOrganisationPage.regulatorNameInput).toHaveValue(
        optionalOtherOrganisationRegistration.organisationRegulatorName
      );
      await expect(registerOrganisationPage.organisationRegistrationNumberInput).toHaveValue(
        optionalOtherOrganisationRegistration.organisationRegulatorNumber
      );
    },
    expectedUrl: /\/register-org-new\/regulatory-organisation-type$/,
    name: 'organisation regulator',
    summaryLabel: 'Regulatory organisation type'
  },
  {
    assertPopulatedFields: async (_page, registerOrganisationPage) => {
      await expect(registerOrganisationPage.firstNameInput).toHaveValue(
        optionalOtherOrganisationRegistration.contactDetails.firstName
      );
      await expect(registerOrganisationPage.lastNameInput).toHaveValue(
        optionalOtherOrganisationRegistration.contactDetails.lastName
      );
      await expect(registerOrganisationPage.workEmailAddressInput).toHaveValue(
        optionalOtherOrganisationRegistration.contactDetails.workEmailAddress
      );
    },
    expectedUrl: /\/register-org-new\/contact-details$/,
    name: 'contact details',
    summaryLabel: 'First name(s)'
  },
  {
    assertPopulatedFields: async (_page, registerOrganisationPage) => {
      await expect(registerOrganisationPage.regulatorTypeSelect.locator('option:checked')).toContainText('Other');
      await expect(registerOrganisationPage.regulatorNameInput).toHaveValue(
        optionalOtherOrganisationRegistration.individualRegulatorName
      );
      await expect(registerOrganisationPage.organisationRegistrationNumberInput).toHaveValue(
        optionalOtherOrganisationRegistration.individualRegulatorNumber
      );
    },
    expectedUrl: /\/register-org-new\/individual-registered-with-regulator-details$/,
    name: 'individual regulator',
    summaryLabel: 'What regulators are you (as an individual) registered with?'
  }
];

const backNavigationScreenOrder = [
  'What regulator are you (as an individual) registered with?',
  'Are you (as an individual) registered with a regulator?',
  'Provide your contact details',
  'What PBA numbers does your organisation use?',
  'Does your organisation have a payment by account number?',
  'Which services will your organisation need to access?',
  'Who is your organisation registered with?',
  'What\'s the DX reference for this office?',
  'Do you have a document exchange reference for your main office?',
  'Is this a UK address?',
  'What is the registered address of your organisation?',
  'What is your organisation name and Companies House number?',
  'What type of organisation are you registering?',
  'Apply for an organisation to manage civil, family and tribunal cases'
] as const;

test.describe('Register organisation Check Your Answers change links', {
  tag: ['@integration', '@integration-register-organisation']
}, () => {
  test('navigates backwards through the populated optional registration journey', async ({
    manageOrgIntegrationPage: page
  }) => {
    await setupRegisterOrganisationRoutes(page);
    const registerOrganisationPage = new RegisterOrganisationPage(page);

    await completeOptionalOtherOrganisationJourney(registerOrganisationPage);
    await expect(registerOrganisationPage.checkYourAnswersHeading).toBeVisible();

    for (const expectedScreen of backNavigationScreenOrder) {
      await registerOrganisationPage.goBack();
      await expect(page.getByText(expectedScreen, { exact: true }).first()).toBeVisible();
    }
  });

  for (const changeLinkCase of checkYourAnswersChangeLinkCases) {
    test(`routes the ${changeLinkCase.name} CYA change link back to populated registration details`, async ({
      manageOrgIntegrationPage: page
    }) => {
      await setupRegisterOrganisationRoutes(page);
      const registerOrganisationPage = new RegisterOrganisationPage(page);

      await completeOptionalOtherOrganisationJourney(registerOrganisationPage);
      await expect(registerOrganisationPage.checkYourAnswersHeading).toBeVisible();

      await registerOrganisationPage.summaryChangeLink(changeLinkCase.summaryLabel).click();

      await expect(page).toHaveURL(changeLinkCase.expectedUrl);
      await changeLinkCase.assertPopulatedFields(page, registerOrganisationPage);

      await registerOrganisationPage.goBack();
      await expect(registerOrganisationPage.checkYourAnswersHeading).toBeVisible();
    });
  }

  test('removes stale optional details from CYA and submission after answers are changed to No', async ({
    manageOrgIntegrationPage: page
  }) => {
    const routeState = await setupRegisterOrganisationRoutes(page);
    const registerOrganisationPage = new RegisterOrganisationPage(page);

    await completeOptionalOtherOrganisationJourney(registerOrganisationPage);
    await expect(registerOrganisationPage.checkYourAnswersHeading).toBeVisible();

    await test.step('Change DX answer to No and return through the populated downstream journey', async () => {
      await registerOrganisationPage.summaryChangeLink(
        'Do you have a document exchange reference for your main office?'
      ).click();
      await expect(page).toHaveURL(/\/register-org-new\/document-exchange-reference$/);
      await registerOrganisationPage.declineDocumentExchangeReference();
      await continuePopulatedOptionalJourneyFromOrganisationRegulatorToCheckYourAnswers(registerOrganisationPage);
    });

    await test.step('Change PBA answer to No and return through the populated downstream journey', async () => {
      await registerOrganisationPage.summaryChangeLink(
        'Does your organisation have a payment by account number?'
      ).click();
      await expect(page).toHaveURL(/\/register-org-new\/payment-by-account$/);
      await registerOrganisationPage.declinePaymentByAccount();
      await continuePopulatedOptionalJourneyFromContactDetailsToCheckYourAnswers(registerOrganisationPage);
    });

    await test.step('Change individual regulator answer to No', async () => {
      await registerOrganisationPage.summaryChangeLink(
        'Are you (as an individual) registered with a regulator?'
      ).click();
      await expect(page).toHaveURL(/\/register-org-new\/individual-registered-with-regulator$/);
      await registerOrganisationPage.declineIndividualRegulator();
    });

    await test.step('Assert CYA no longer displays hidden optional details', async () => {
      await expect(registerOrganisationPage.checkYourAnswersHeading).toBeVisible();
      await expect(registerOrganisationPage.summaryValue('Organisation name')).toContainText(
        optionalOtherOrganisationRegistration.companyName
      );
      await expect(registerOrganisationPage.summaryValue('Organisation address')).toContainText(
        optionalOtherOrganisationRegistration.manualUkAddress.addressLine1
      );
      await expect(registerOrganisationPage.summaryValue('Organisation address')).toContainText(
        optionalOtherOrganisationRegistration.manualUkAddress.postCode
      );
      await expect(registerOrganisationPage.summaryValue('First name(s)')).toContainText(
        optionalOtherOrganisationRegistration.contactDetails.firstName
      );
      await expect(registerOrganisationPage.summaryValue('Email address')).toContainText(
        optionalOtherOrganisationRegistration.contactDetails.workEmailAddress
      );
      await expect(registerOrganisationPage.summaryValue(
        'Do you have a document exchange reference for your main office?'
      )).toContainText('No');
      await expect(registerOrganisationPage.summaryRow('What\'s the DX reference for this office?')).toHaveCount(0);
      await expect(registerOrganisationPage.summaryValue(
        'Does your organisation have a payment by account number?'
      )).toContainText('No');
      await expect(registerOrganisationPage.summaryRow('What PBA numbers does your organisation use?')).toHaveCount(0);
      await expect(registerOrganisationPage.summaryValue(
        'Are you (as an individual) registered with a regulator?'
      )).toContainText('No');
      await expect(registerOrganisationPage.summaryRow(
        'What regulators are you (as an individual) registered with?'
      )).toHaveCount(0);
    });

    await registerOrganisationPage.submitRegistration();

    await expect(registerOrganisationPage.submittedHeading).toBeVisible();
    await expect.poll(() => routeState.registrationRequests.length).toBe(1);

    expect(routeState.registrationRequests[0]).toMatchObject({
      address: optionalOtherOrganisationRegistration.manualUkAddress,
      companyHouseNumber: optionalOtherOrganisationRegistration.companyHouseNumber,
      companyName: optionalOtherOrganisationRegistration.companyName,
      contactDetails: optionalOtherOrganisationRegistration.contactDetails,
      dxExchange: null,
      dxNumber: null,
      hasDxReference: false,
      hasIndividualRegisteredWithRegulator: false,
      hasPBA: false,
      inInternationalMode: true,
      individualRegulators: [],
      organisationType: {
        description: 'Other',
        key: 'OTHER'
      },
      otherOrganisationDetail: optionalOtherOrganisationRegistration.otherOrganisationDetail,
      otherOrganisationType: {
        description: otherOrganisationType.value_en,
        key: otherOrganisationType.key
      },
      pbaNumbers: [],
      regulators: [{
        organisationRegistrationNumber: optionalOtherOrganisationRegistration.organisationRegulatorNumber,
        regulatorName: optionalOtherOrganisationRegistration.organisationRegulatorName,
        regulatorType: 'Other'
      }],
      services: optionalOtherOrganisationRegistration.services,
      sraRegulated: false
    });
  });
});
