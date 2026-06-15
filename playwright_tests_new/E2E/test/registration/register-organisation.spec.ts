import { test, expect } from '../../fixtures';
import { createRegisterOrganisationData } from '../../utils/test-setup/register-organisation-data';
import {
  completeOptionalRegisterOrganisationJourney
} from '../../utils/test-setup/register-organisation-journeys';

test.use({ manageOrgUserRole: 'roo' });

test(
  'shows already-registered guidance on the register organisation start page',
  { tag: ['@e2e', '@registration'] },
  async ({ signedInPage, registerOrganisationPage }) => {
    await registerOrganisationPage.openStartPage();

    await expect(signedInPage).toHaveURL(/\/register-org-new\/register$/);
    await expect(registerOrganisationPage.startPageHeading).toBeVisible();
    await expect(registerOrganisationPage.alreadyRegisteredHeading).toBeVisible();
    await expect(registerOrganisationPage.manageCasesLink).toBeVisible();
    await expect(registerOrganisationPage.manageOrganisationLink).toBeVisible();
  }
);

test(
  'redirects the legacy register organisation start URL to register-org-new',
  { tag: ['@e2e', '@registration'] },
  async ({ signedInPage, registerOrganisationPage }) => {
    await registerOrganisationPage.openLegacyStartPage();

    await expect(signedInPage).toHaveURL(/\/register-org-new\/register$/);
    await expect(registerOrganisationPage.startPageHeading).toBeVisible();
    await expect(registerOrganisationPage.alreadyRegisteredHeading).toBeVisible();
  }
);

test(
  'registers a new solicitor organisation through register-org-new',
  { tag: ['@e2e', '@registration'] },
  async ({ signedInPage, registerOrganisationPage }) => {
    const data = createRegisterOrganisationData();

    await registerOrganisationPage.openStartPage();
    await expect(signedInPage).toHaveURL(/\/register-org-new\/register$/);
    await expect(registerOrganisationPage.startPageHeading).toBeVisible();

    await registerOrganisationPage.startRegistration();
    await registerOrganisationPage.chooseSolicitorOrganisationType();
    await registerOrganisationPage.enterOrganisationName(data.organisationName);
    await registerOrganisationPage.enterManualUkAddress(data.manualUkAddress);
    await registerOrganisationPage.enterDocumentExchangeReference(data.dxNumber, data.dxExchange);
    await registerOrganisationPage.enterOrganisationRegulator(data.regulatorNumber);
    await registerOrganisationPage.chooseDivorceService();
    await registerOrganisationPage.declinePaymentByAccount();
    await registerOrganisationPage.enterContactDetails(data);
    await registerOrganisationPage.declineIndividualRegulator();

    await expect(registerOrganisationPage.checkYourAnswersHeading).toBeVisible();
    await expect(registerOrganisationPage.summaryValue('Organisation name')).toContainText(data.organisationName);
    await expect(registerOrganisationPage.summaryValue('Organisation address')).toContainText(data.manualUkAddress.line1);
    await expect(registerOrganisationPage.summaryValue(
      'Do you have a document exchange reference for your main office?'
    )).toContainText('Yes');
    await expect(registerOrganisationPage.summaryValue('What\'s the DX reference for this office?')).toContainText(data.dxNumber);
    await expect(registerOrganisationPage.summaryValue('Service to access')).toContainText('Divorce');
    await expect(registerOrganisationPage.summaryValue('Does your organisation have a payment by account number?')).toContainText('No');
    await expect(registerOrganisationPage.summaryValue('Regulatory organisation type')).toContainText(data.regulatorNumber);
    await expect(registerOrganisationPage.summaryValue('First name(s)')).toContainText(data.firstName);
    await expect(registerOrganisationPage.summaryValue('Last name')).toContainText(data.lastName);
    await expect(registerOrganisationPage.summaryValue('Email address')).toContainText(data.email);
    await expect(registerOrganisationPage.summaryValue(
      'Are you (as an individual) registered with a regulator?'
    )).toContainText('No');

    await registerOrganisationPage.submitRegistration();
    await expect(registerOrganisationPage.submittedHeading).toBeVisible({ timeout: 30_000 });
  }
);

test(
  'routes a live Check Your Answers change link without submitting registration',
  { tag: ['@e2e', '@registration'] },
  async ({ signedInPage, registerOrganisationPage }) => {
    const data = createRegisterOrganisationData();

    await completeOptionalRegisterOrganisationJourney(registerOrganisationPage, data);
    await expect(registerOrganisationPage.checkYourAnswersHeading).toBeVisible();

    await registerOrganisationPage.openSummaryChangeLink(
      'Do you have a document exchange reference for your main office?'
    );
    await expect(signedInPage).toHaveURL(/\/register-org-new\/document-exchange-reference$/);

    await registerOrganisationPage.declineDocumentExchangeReference();
    await expect(signedInPage).toHaveURL(/\/register-org-new\/regulatory-organisation-type$/);
  }
);
