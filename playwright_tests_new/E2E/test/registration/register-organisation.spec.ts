import { test, expect } from '../../fixtures';
import { createRegisterOrganisationData } from '../../utils/test-setup/register-organisation-data';

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
    const selectedAddress = await registerOrganisationPage.selectRegisteredAddress(data.lookupPostcode);
    await registerOrganisationPage.enterDocumentExchangeReference(data.dxNumber, data.dxExchange);
    await registerOrganisationPage.enterOrganisationRegulator(data.regulatorNumber);
    await registerOrganisationPage.chooseDivorceService();
    await registerOrganisationPage.declinePaymentByAccount();
    await registerOrganisationPage.enterContactDetails(data);
    await registerOrganisationPage.declineIndividualRegulator();

    await expect(registerOrganisationPage.checkYourAnswersHeading).toBeVisible();
    await expect(registerOrganisationPage.summaryValue('Organisation name')).toContainText(data.organisationName);
    await expect(registerOrganisationPage.summaryValue('Organisation address')).toContainText(selectedAddress.split(',')[0]);
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
  'checks optional register-org-new details before submission',
  { tag: ['@e2e', '@registration'] },
  async ({ signedInPage, registerOrganisationPage }) => {
    const data = createRegisterOrganisationData();

    await registerOrganisationPage.openStartPage();
    await expect(signedInPage).toHaveURL(/\/register-org-new\/register$/);
    await expect(registerOrganisationPage.startPageHeading).toBeVisible();

    await registerOrganisationPage.startRegistration();
    await registerOrganisationPage.chooseSolicitorOrganisationType();
    await registerOrganisationPage.enterOrganisationNameAndCompanyHouseNumber(data.organisationName, data.companyHouseNumber);
    await registerOrganisationPage.enterManualUkAddress(data.manualUkAddress);
    await registerOrganisationPage.enterDocumentExchangeReference(data.dxNumber, data.dxExchange);
    await registerOrganisationPage.enterOtherOrganisationRegulator(data.regulatorName, data.regulatorNumber);
    await registerOrganisationPage.chooseServices('Divorce', 'Damages');
    await registerOrganisationPage.enterPaymentByAccountNumbers(data.pbaNumbers);
    await registerOrganisationPage.enterContactDetails(data);
    await registerOrganisationPage.enterOtherIndividualRegulator(data.individualRegulatorName, data.individualRegulatorNumber);

    await expect(registerOrganisationPage.checkYourAnswersHeading).toBeVisible();
    await expect(registerOrganisationPage.summaryValue('Organisation type')).toContainText('Solicitor');
    await expect(registerOrganisationPage.summaryValue('Organisation name')).toContainText(data.organisationName);
    await expect(registerOrganisationPage.summaryValue('Company registration number')).toContainText(data.companyHouseNumber);
    const ukAddressSummary = registerOrganisationPage.summaryValue('Organisation address');
    for (const addressLine of [
      data.manualUkAddress.line1,
      data.manualUkAddress.line2,
      data.manualUkAddress.line3,
      data.manualUkAddress.town,
      data.manualUkAddress.county,
      data.manualUkAddress.postcode,
      data.manualUkAddress.country
    ].filter((addressLine): addressLine is string => Boolean(addressLine))) {
      await expect(ukAddressSummary).toContainText(addressLine);
    }
    await expect(registerOrganisationPage.summaryValue(
      'Do you have a document exchange reference for your main office?'
    )).toContainText('Yes');
    await expect(registerOrganisationPage.summaryValue('What\'s the DX reference for this office?')).toContainText(data.dxNumber);
    await expect(registerOrganisationPage.summaryValue('Service to access')).toContainText('Divorce');
    await expect(registerOrganisationPage.summaryValue('Service to access')).toContainText('Damages');
    await expect(registerOrganisationPage.summaryValue('Does your organisation have a payment by account number?')).toContainText('Yes');
    await expect(registerOrganisationPage.summaryValue('What PBA numbers does your organisation use?')).toContainText(data.pbaNumbers[0]);
    await expect(registerOrganisationPage.summaryValue('What PBA numbers does your organisation use?')).toContainText(data.pbaNumbers[1]);
    await expect(registerOrganisationPage.summaryValue('Regulatory organisation type')).toContainText(data.regulatorName);
    await expect(registerOrganisationPage.summaryValue('Regulatory organisation type')).toContainText(data.regulatorNumber);
    await expect(registerOrganisationPage.summaryValue('First name(s)')).toContainText(data.firstName);
    await expect(registerOrganisationPage.summaryValue('Last name')).toContainText(data.lastName);
    await expect(registerOrganisationPage.summaryValue('Email address')).toContainText(data.email);
    await expect(registerOrganisationPage.summaryValue(
      'Are you (as an individual) registered with a regulator?'
    )).toContainText('Yes');
    await expect(registerOrganisationPage.summaryValue(
      'What regulators are you (as an individual) registered with?'
    )).toContainText(data.individualRegulatorName);
    await expect(registerOrganisationPage.summaryValue(
      'What regulators are you (as an individual) registered with?'
    )).toContainText(data.individualRegulatorNumber);

    for (const summaryLabel of [
      'Organisation type',
      'Organisation name',
      'Company registration number',
      'Organisation address',
      'What\'s the DX reference for this office?',
      'Service to access',
      'Does your organisation have a payment by account number?',
      'Regulatory organisation type',
      'First name(s)',
      'Last name',
      'Email address',
      'What regulators are you (as an individual) registered with?'
    ]) {
      await expect(registerOrganisationPage.summaryChangeLink(summaryLabel)).toBeVisible();
    }
  }
);

test(
  'checks minimum register-org-new details before submission',
  { tag: ['@e2e', '@registration'] },
  async ({ signedInPage, registerOrganisationPage }) => {
    const data = createRegisterOrganisationData();

    await registerOrganisationPage.openStartPage();
    await expect(signedInPage).toHaveURL(/\/register-org-new\/register$/);
    await expect(registerOrganisationPage.startPageHeading).toBeVisible();

    await registerOrganisationPage.startRegistration();
    await registerOrganisationPage.chooseSolicitorOrganisationType();
    await registerOrganisationPage.enterOrganisationName(data.organisationName);
    await registerOrganisationPage.enterManualInternationalAddress(data.manualInternationalAddress);
    await registerOrganisationPage.declineDocumentExchangeReference();
    await registerOrganisationPage.enterOrganisationRegulator(data.regulatorNumber);
    await registerOrganisationPage.chooseServices('Divorce', 'Damages');
    await registerOrganisationPage.declinePaymentByAccount();
    await registerOrganisationPage.enterContactDetails(data);
    await registerOrganisationPage.declineIndividualRegulator();

    await expect(registerOrganisationPage.checkYourAnswersHeading).toBeVisible();
    await expect(registerOrganisationPage.summaryValue('Organisation type')).toContainText('Solicitor');
    await expect(registerOrganisationPage.summaryValue('Organisation name')).toContainText(data.organisationName);
    await expect(registerOrganisationPage.summaryRow('Company registration number')).toHaveCount(0);
    const internationalAddressSummary = registerOrganisationPage.summaryValue('Organisation address');
    for (const addressLine of [
      data.manualInternationalAddress.line1,
      data.manualInternationalAddress.town,
      data.manualInternationalAddress.country
    ]) {
      await expect(internationalAddressSummary).toContainText(addressLine);
    }
    await expect(registerOrganisationPage.summaryValue(
      'Do you have a document exchange reference for your main office?'
    )).toContainText('No');
    await expect(registerOrganisationPage.summaryRow('What\'s the DX reference for this office?')).toHaveCount(0);
    await expect(registerOrganisationPage.summaryValue('Service to access')).toContainText('Divorce');
    await expect(registerOrganisationPage.summaryValue('Service to access')).toContainText('Damages');
    await expect(registerOrganisationPage.summaryValue('Does your organisation have a payment by account number?')).toContainText('No');
    await expect(registerOrganisationPage.summaryRow('What PBA numbers does your organisation use?')).toHaveCount(0);
    await expect(registerOrganisationPage.summaryValue('Regulatory organisation type')).toContainText(data.regulatorNumber);
    await expect(registerOrganisationPage.summaryValue('First name(s)')).toContainText(data.firstName);
    await expect(registerOrganisationPage.summaryValue('Last name')).toContainText(data.lastName);
    await expect(registerOrganisationPage.summaryValue('Email address')).toContainText(data.email);
    await expect(registerOrganisationPage.summaryValue(
      'Are you (as an individual) registered with a regulator?'
    )).toContainText('No');
    await expect(registerOrganisationPage.summaryRow(
      'What regulators are you (as an individual) registered with?'
    )).toHaveCount(0);
  }
);
