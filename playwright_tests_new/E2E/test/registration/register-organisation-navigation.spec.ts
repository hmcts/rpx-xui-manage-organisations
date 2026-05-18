import { test, expect } from '../../fixtures';
import { createRegisterOrganisationData } from '../../utils/test-setup/register-organisation-data';
import { completeOptionalRegisterOrganisationJourney } from '../../utils/test-setup/register-organisation-journeys';

test.use({ manageOrgUserRole: 'roo' });

const registerOrganisationScreenLabels = {
  start: 'Apply for an organisation to manage civil, family and tribunal cases',
  organisationType: 'What type of organisation are you registering?',
  organisationName: 'What is your organisation name and Companies House number?',
  registeredAddress: 'What is the registered address of your organisation?',
  ukAddress: 'Is this a UK address?',
  documentExchangeReference: 'Do you have a document exchange reference for your main office?',
  dxReference: 'What\'s the DX reference for this office?',
  regulator: 'Who is your organisation registered with?',
  services: 'Which services will your organisation need to access?',
  pbaChoice: 'Does your organisation have a payment by account number?',
  pbaNumbers: 'What PBA numbers does your organisation use?',
  contactDetails: 'Provide your contact details',
  individualRegulatorChoice: 'Are you (as an individual) registered with a regulator?',
  individualRegulator: 'What regulator are you (as an individual) registered with?',
  checkYourAnswers: 'Check your answers before you register'
} as const;

const backNavigationScreenOrder = [
  registerOrganisationScreenLabels.individualRegulator,
  registerOrganisationScreenLabels.individualRegulatorChoice,
  registerOrganisationScreenLabels.contactDetails,
  registerOrganisationScreenLabels.pbaNumbers,
  registerOrganisationScreenLabels.pbaChoice,
  registerOrganisationScreenLabels.services,
  registerOrganisationScreenLabels.regulator,
  registerOrganisationScreenLabels.dxReference,
  registerOrganisationScreenLabels.documentExchangeReference,
  registerOrganisationScreenLabels.ukAddress,
  registerOrganisationScreenLabels.registeredAddress,
  registerOrganisationScreenLabels.organisationName,
  registerOrganisationScreenLabels.organisationType,
  registerOrganisationScreenLabels.start
] as const;

const checkYourAnswersChangeLinkDestinations = [
  {
    summaryLabel: 'Organisation type',
    expectedScreen: registerOrganisationScreenLabels.organisationType
  },
  {
    summaryLabel: 'Organisation name',
    expectedScreen: registerOrganisationScreenLabels.organisationName
  },
  {
    summaryLabel: 'Company registration number',
    expectedScreen: registerOrganisationScreenLabels.organisationName
  },
  {
    summaryLabel: 'Organisation address',
    expectedScreen: registerOrganisationScreenLabels.ukAddress
  },
  {
    summaryLabel: registerOrganisationScreenLabels.dxReference,
    expectedScreen: registerOrganisationScreenLabels.dxReference
  },
  {
    summaryLabel: 'Service to access',
    expectedScreen: registerOrganisationScreenLabels.services
  },
  {
    summaryLabel: registerOrganisationScreenLabels.pbaChoice,
    expectedScreen: registerOrganisationScreenLabels.pbaChoice
  },
  {
    summaryLabel: 'Regulatory organisation type',
    expectedScreen: registerOrganisationScreenLabels.regulator
  },
  {
    summaryLabel: 'First name(s)',
    expectedScreen: registerOrganisationScreenLabels.contactDetails
  },
  {
    summaryLabel: 'Last name',
    expectedScreen: registerOrganisationScreenLabels.contactDetails
  },
  {
    summaryLabel: 'Email address',
    expectedScreen: registerOrganisationScreenLabels.contactDetails
  },
  {
    summaryLabel: 'What regulators are you (as an individual) registered with?',
    expectedScreen: registerOrganisationScreenLabels.individualRegulator
  }
] as const;

const continueFromOrganisationTypeChangeScreenOrder = [
  registerOrganisationScreenLabels.dxReference,
  registerOrganisationScreenLabels.regulator,
  registerOrganisationScreenLabels.services,
  registerOrganisationScreenLabels.pbaChoice,
  registerOrganisationScreenLabels.pbaNumbers,
  registerOrganisationScreenLabels.contactDetails,
  registerOrganisationScreenLabels.individualRegulatorChoice,
  registerOrganisationScreenLabels.individualRegulator,
  registerOrganisationScreenLabels.checkYourAnswers
] as const;

test.describe('Register organisation navigation', () => {
  test(
    'navigates backwards through the optional register-org-new journey',
    { tag: ['@e2e', '@registration', '@navigation'] },
    async ({ signedInPage, registerOrganisationPage }) => {
      const data = createRegisterOrganisationData();
      await completeOptionalRegisterOrganisationJourney(registerOrganisationPage, data);
      await expect(registerOrganisationPage.checkYourAnswersHeading).toBeVisible();

      for (const expectedScreen of backNavigationScreenOrder) {
        await registerOrganisationPage.goBackInWorkflow();
        await expect(signedInPage.getByText(expectedScreen, { exact: true }).first()).toBeVisible();
      }
    }
  );

  test(
    'opens each check-your-answers change link on the expected register-org-new screen',
    { tag: ['@e2e', '@registration', '@navigation'] },
    async ({ signedInPage, registerOrganisationPage }) => {
      const data = createRegisterOrganisationData();
      await completeOptionalRegisterOrganisationJourney(registerOrganisationPage, data);
      await expect(registerOrganisationPage.checkYourAnswersHeading).toBeVisible();

      for (const { summaryLabel, expectedScreen } of checkYourAnswersChangeLinkDestinations) {
        await registerOrganisationPage.openSummaryChangeLink(summaryLabel);
        await expect(signedInPage.getByText(expectedScreen, { exact: true }).first()).toBeVisible();
        await registerOrganisationPage.openWorkflowPage('check-your-answers');
        await expect(registerOrganisationPage.checkYourAnswersHeading).toBeVisible();
      }
    }
  );

  test(
    'continues from an organisation-type change link back to check your answers',
    { tag: ['@e2e', '@registration', '@navigation'] },
    async ({ signedInPage, registerOrganisationPage }) => {
      const data = createRegisterOrganisationData();
      await completeOptionalRegisterOrganisationJourney(registerOrganisationPage, data);
      await expect(registerOrganisationPage.checkYourAnswersHeading).toBeVisible();

      await registerOrganisationPage.openSummaryChangeLink('Organisation type');
      await expect(signedInPage.getByText(
        registerOrganisationScreenLabels.organisationType,
        { exact: true }
      ).first()).toBeVisible();

      await registerOrganisationPage.continueWith();
      await expect(signedInPage.getByText(
        registerOrganisationScreenLabels.organisationName,
        { exact: true }
      ).first()).toBeVisible();

      await registerOrganisationPage.continueWith();
      await expect(signedInPage.getByText(
        registerOrganisationScreenLabels.registeredAddress,
        { exact: true }
      ).first()).toBeVisible();

      await registerOrganisationPage.enterManualUkAddress(data.manualUkAddress);
      await expect(signedInPage.getByText(
        registerOrganisationScreenLabels.documentExchangeReference,
        { exact: true }
      ).first()).toBeVisible();

      for (const expectedScreen of continueFromOrganisationTypeChangeScreenOrder) {
        await registerOrganisationPage.continueWith();
        await expect(signedInPage.getByText(expectedScreen, { exact: true }).first()).toBeVisible();
      }
    }
  );
});
