import type { Page } from '@playwright/test';
import { expect, test } from '../../fixtures';
import {
  completeOptionalOtherOrganisationJourney,
  setupRegisterOrganisationRoutes
} from '../../helpers';
import {
  minimumSolicitorRegistration,
  optionalOtherOrganisationRegistration,
  otherOrganisationType
} from '../../mocks/registerOrganisation.mock';
import { RegisterOrganisationPage } from '../../page-objects/register-organisation.po';

const setupRegisterOrganisationPage = async (page: Page): Promise<{
  registerOrganisationPage: RegisterOrganisationPage;
  routeState: Awaited<ReturnType<typeof setupRegisterOrganisationRoutes>>;
}> => {
  const routeState = await setupRegisterOrganisationRoutes(page);
  const registerOrganisationPage = new RegisterOrganisationPage(page);

  return { registerOrganisationPage, routeState };
};

test.describe('Register organisation validation paths', { tag: ['@integration', '@integration-register-organisation'] }, () => {
  test('requires account confirmation before the register-org-new journey starts', async ({
    manageOrgIntegrationPage: page
  }) => {
    const { registerOrganisationPage, routeState } = await setupRegisterOrganisationPage(page);

    await registerOrganisationPage.openStartPage();
    await registerOrganisationPage.continueWith('Start');

    await expect(registerOrganisationPage.validationSummaryError('Please select the checkbox')).toBeVisible();
    await expect(page).toHaveURL(/\/register-org-new\/register$/);

    expect(routeState.registrationRequests).toHaveLength(0);
  });

  test('requires an organisation type before continuing to company details', async ({
    manageOrgIntegrationPage: page
  }) => {
    const { registerOrganisationPage, routeState } = await setupRegisterOrganisationPage(page);

    await registerOrganisationPage.openWorkflowPage('organisation-type');
    await registerOrganisationPage.continueWith();

    await expect(registerOrganisationPage.validationSummaryError('Please select an organisation')).toBeVisible();
    await expect(page).toHaveURL(/\/register-org-new\/organisation-type$/);

    expect(routeState.registrationRequests).toHaveLength(0);
  });

  test('requires other organisation type and details before company details', async ({
    manageOrgIntegrationPage: page
  }) => {
    const { registerOrganisationPage, routeState } = await setupRegisterOrganisationPage(page);

    await registerOrganisationPage.openWorkflowPage('organisation-type');
    await registerOrganisationPage.otherOrganisationTypeRadio.check();
    await registerOrganisationPage.continueWith();

    await expect(registerOrganisationPage.validationSummaryError('Select an organisation type')).toBeVisible();
    await expect(registerOrganisationPage.validationSummaryError('Please enter the details')).toBeVisible();

    await registerOrganisationPage.otherOrganisationTypeSelect.selectOption({
      label: otherOrganisationType.value_en
    });
    await registerOrganisationPage.continueWith();

    await expect(registerOrganisationPage.validationSummaryError('Please enter the details')).toBeVisible();

    await registerOrganisationPage.otherOrganisationDetailInput.fill(
      optionalOtherOrganisationRegistration.otherOrganisationDetail
    );
    await registerOrganisationPage.continueWith();

    await expect(page).toHaveURL(/\/register-org-new\/company-house-details$/);

    expect(routeState.registrationRequests).toHaveLength(0);
  });

  test('requires an organisation name before registered address details', async ({
    manageOrgIntegrationPage: page
  }) => {
    const { registerOrganisationPage, routeState } = await setupRegisterOrganisationPage(page);

    await registerOrganisationPage.openWorkflowPage('company-house-details');
    await registerOrganisationPage.continueWith();

    await expect(registerOrganisationPage.validationSummaryError('Enter an organisation name')).toBeVisible();

    await registerOrganisationPage.organisationNameInput.fill(optionalOtherOrganisationRegistration.companyName);
    await registerOrganisationPage.continueWith();

    await expect(page).toHaveURL(/\/register-org-new\/registered-address\/external$/);

    expect(routeState.registrationRequests).toHaveLength(0);
  });

  test('rejects invalid Companies House numbers before registered address details', async ({
    manageOrgIntegrationPage: page
  }) => {
    const { registerOrganisationPage, routeState } = await setupRegisterOrganisationPage(page);

    await registerOrganisationPage.openWorkflowPage('company-house-details');
    await registerOrganisationPage.organisationNameInput.fill(optionalOtherOrganisationRegistration.companyName);
    await registerOrganisationPage.companyHouseNumberInput.fill('1234');
    await registerOrganisationPage.continueWith();

    await expect(registerOrganisationPage.validationSummaryError('Enter a valid Companies House number')).toBeVisible();

    await registerOrganisationPage.companyHouseNumberInput.fill(
      optionalOtherOrganisationRegistration.companyHouseNumber
    );
    await registerOrganisationPage.continueWith();

    await expect(page).toHaveURL(/\/register-org-new\/registered-address\/external$/);

    expect(routeState.registrationRequests).toHaveLength(0);
  });

  test('validates manual registered-address choices and postcode rules', async ({
    manageOrgIntegrationPage: page
  }) => {
    const { registerOrganisationPage, routeState } = await setupRegisterOrganisationPage(page);

    await registerOrganisationPage.openWorkflowPage('registered-address/external');
    await registerOrganisationPage.manualAddressLink.click();
    await registerOrganisationPage.continueWith();

    await expect(registerOrganisationPage.validationSummaryError('Select an option')).toBeVisible();

    await registerOrganisationPage.ukAddressYesRadio.check();
    await registerOrganisationPage.continueWith();

    await expect(registerOrganisationPage.validationSummaryError('Enter building and street')).toBeVisible();
    await expect(registerOrganisationPage.validationSummaryError('Enter town or city')).toBeVisible();
    await expect(registerOrganisationPage.validationSummaryError('Enter a valid postcode')).toBeVisible();

    await registerOrganisationPage.addressLine1Input.fill('Validation House');
    await registerOrganisationPage.postTownInput.fill('London');
    await registerOrganisationPage.postCodeInput.fill('BAD');
    await registerOrganisationPage.continueWith();

    await expect(registerOrganisationPage.validationSummaryError('Enter valid postcode')).toBeVisible();

    await registerOrganisationPage.postCodeInput.fill('SW1V 3BZ');
    await registerOrganisationPage.continueWith();

    await expect(page).toHaveURL(/\/register-org-new\/document-exchange-reference$/);

    expect(routeState.registrationRequests).toHaveLength(0);
  });

  test('validates DX reference choice and DX details before regulator details', async ({
    manageOrgIntegrationPage: page
  }) => {
    const { registerOrganisationPage, routeState } = await setupRegisterOrganisationPage(page);

    await registerOrganisationPage.openWorkflowPage('document-exchange-reference');
    await registerOrganisationPage.continueWith();

    await expect(registerOrganisationPage.validationSummaryError('Please select an option')).toBeVisible();

    await registerOrganisationPage.documentExchangeYesRadio.check();
    await registerOrganisationPage.continueWith();
    await registerOrganisationPage.dxNumberInput.fill('D'.repeat(14));
    await registerOrganisationPage.dxExchangeInput.fill('E'.repeat(21));
    await registerOrganisationPage.continueWith();

    await expect(registerOrganisationPage.validationSummaryError('Enter valid DX number')).toBeVisible();
    await expect(registerOrganisationPage.validationSummaryError('Enter valid DX exchange')).toBeVisible();

    await registerOrganisationPage.dxNumberInput.fill(optionalOtherOrganisationRegistration.dxNumber);
    await registerOrganisationPage.dxExchangeInput.fill(optionalOtherOrganisationRegistration.dxExchange);
    await registerOrganisationPage.continueWith();

    await expect(page).toHaveURL(/\/register-org-new\/regulatory-organisation-type$/);

    expect(routeState.registrationRequests).toHaveLength(0);
  });

  test('requires regulator selection and registration reference before services', async ({
    manageOrgIntegrationPage: page
  }) => {
    const { registerOrganisationPage, routeState } = await setupRegisterOrganisationPage(page);

    await registerOrganisationPage.openWorkflowPage('regulatory-organisation-type');
    await registerOrganisationPage.continueWith();

    await expect(registerOrganisationPage.validationSummaryError(
      'Please select a regulatory organisation'
    )).toBeVisible();

    await registerOrganisationPage.regulatorTypeSelect.selectOption({
      label: 'Solicitor Regulation Authority (SRA)'
    });
    await registerOrganisationPage.continueWith();

    await expect(registerOrganisationPage.validationSummaryError('Enter a registration reference')).toBeVisible();

    await registerOrganisationPage.organisationRegistrationNumberInput.fill(
      minimumSolicitorRegistration.organisationRegulatorNumber
    );
    await registerOrganisationPage.continueWith();

    await expect(page).toHaveURL(/\/register-org-new\/organisation-services-access$/);

    expect(routeState.registrationRequests).toHaveLength(0);
  });

  test('requires at least one service and details for service-not-listed before PBA choice', async ({
    manageOrgIntegrationPage: page
  }) => {
    const { registerOrganisationPage, routeState } = await setupRegisterOrganisationPage(page);

    await registerOrganisationPage.openWorkflowPage('organisation-services-access');
    await registerOrganisationPage.continueWith();

    await expect(registerOrganisationPage.validationSummaryError('Please select at least one service')).toBeVisible();

    await registerOrganisationPage.otherServicesCheckbox.check();
    await registerOrganisationPage.continueWith();

    await expect(registerOrganisationPage.validationSummaryError('Enter one or more services')).toBeVisible();

    await registerOrganisationPage.otherServicesInput.fill('Integration validation service');
    await registerOrganisationPage.continueWith();

    await expect(page).toHaveURL(/\/register-org-new\/payment-by-account$/);

    expect(routeState.registrationRequests).toHaveLength(0);
  });

  test('validates payment-by-account choice, number format and duplicate numbers', async ({
    manageOrgIntegrationPage: page
  }) => {
    const { registerOrganisationPage, routeState } = await setupRegisterOrganisationPage(page);

    await registerOrganisationPage.openWorkflowPage('payment-by-account');
    await registerOrganisationPage.continueWith();

    await expect(registerOrganisationPage.validationSummaryError('Please select an option')).toBeVisible();

    await registerOrganisationPage.pbaYesRadio.check();
    await registerOrganisationPage.continueWith();
    await registerOrganisationPage.pbaNumberInput().fill('BAD');
    await registerOrganisationPage.continueWith();

    await expect(registerOrganisationPage.validationSummaryError('Enter a valid PBA number')).toBeVisible();

    await registerOrganisationPage.pbaNumberInput().fill(optionalOtherOrganisationRegistration.pbaNumbers[0]);
    await registerOrganisationPage.addAnotherPaymentByAccountNumber();
    await registerOrganisationPage.pbaNumberInput(1).fill(optionalOtherOrganisationRegistration.pbaNumbers[0]);
    await registerOrganisationPage.continueWith();

    await expect(registerOrganisationPage.validationSummaryError(
      'You have entered this PBA number more than once'
    )).toBeVisible();

    await registerOrganisationPage.pbaNumberInput(1).fill(optionalOtherOrganisationRegistration.pbaNumbers[1]);
    await registerOrganisationPage.continueWith();

    await expect(page).toHaveURL(/\/register-org-new\/contact-details$/);

    expect(routeState.registrationRequests).toHaveLength(0);
  });

  test('routes a No payment-by-account answer directly to contact details', async ({
    manageOrgIntegrationPage: page
  }) => {
    const { registerOrganisationPage, routeState } = await setupRegisterOrganisationPage(page);

    await registerOrganisationPage.openWorkflowPage('payment-by-account');
    await registerOrganisationPage.pbaNoRadio.check();
    await registerOrganisationPage.continueWith();

    await expect(page).toHaveURL(/\/register-org-new\/contact-details$/);

    expect(routeState.registrationRequests).toHaveLength(0);
  });

  test('validates contact details before individual regulator choice', async ({
    manageOrgIntegrationPage: page
  }) => {
    const { registerOrganisationPage, routeState } = await setupRegisterOrganisationPage(page);

    await registerOrganisationPage.openWorkflowPage('contact-details');
    await registerOrganisationPage.continueWith();

    await expect(registerOrganisationPage.validationSummaryError('Enter first name')).toBeVisible();
    await expect(registerOrganisationPage.validationSummaryError('Enter last name')).toBeVisible();
    await expect(registerOrganisationPage.validationSummaryError('Enter email address')).toBeVisible();

    await registerOrganisationPage.firstNameInput.fill(minimumSolicitorRegistration.contactDetails.firstName);
    await registerOrganisationPage.continueWith();

    await expect(registerOrganisationPage.validationSummaryError('Enter first name')).toHaveCount(0);
    await expect(registerOrganisationPage.validationSummaryError('Enter last name')).toBeVisible();
    await expect(registerOrganisationPage.validationSummaryError('Enter email address')).toBeVisible();

    await registerOrganisationPage.lastNameInput.fill(minimumSolicitorRegistration.contactDetails.lastName);
    await registerOrganisationPage.workEmailAddressInput.fill('not-an-email');
    await registerOrganisationPage.continueWith();

    await expect(registerOrganisationPage.validationSummaryError('Enter first name')).toHaveCount(0);
    await expect(registerOrganisationPage.validationSummaryError('Enter last name')).toHaveCount(0);
    await expect(registerOrganisationPage.validationSummaryError('Enter email address')).toBeVisible();

    await registerOrganisationPage.workEmailAddressInput.fill(
      minimumSolicitorRegistration.contactDetails.workEmailAddress
    );
    await registerOrganisationPage.continueWith();

    await expect(page).toHaveURL(/\/register-org-new\/individual-registered-with-regulator$/);

    expect(routeState.registrationRequests).toHaveLength(0);
  });

  test('validates individual regulator choice and registration details before CYA', async ({
    manageOrgIntegrationPage: page
  }) => {
    const { registerOrganisationPage, routeState } = await setupRegisterOrganisationPage(page);

    await registerOrganisationPage.openWorkflowPage('individual-registered-with-regulator');
    await registerOrganisationPage.continueWith();

    await expect(registerOrganisationPage.validationSummaryError('Please select an option')).toBeVisible();

    await registerOrganisationPage.registeredWithRegulatorYesRadio.check();
    await registerOrganisationPage.continueWith();

    await expect(page).toHaveURL(/\/register-org-new\/individual-registered-with-regulator-details$/);

    await registerOrganisationPage.continueWith();

    await expect(registerOrganisationPage.validationSummaryError(
      'Please select a regulatory organisation'
    )).toBeVisible();

    await registerOrganisationPage.regulatorTypeSelect.selectOption({
      label: 'Solicitor Regulation Authority (SRA)'
    });
    await registerOrganisationPage.continueWith();

    await expect(registerOrganisationPage.validationSummaryError('Enter a registration reference')).toBeVisible();

    expect(routeState.registrationRequests).toHaveLength(0);
  });

  test('blocks other-organisation submission until terms are accepted', async ({
    manageOrgIntegrationPage: page
  }) => {
    const { registerOrganisationPage, routeState } = await setupRegisterOrganisationPage(page);

    await completeOptionalOtherOrganisationJourney(registerOrganisationPage);
    await expect(registerOrganisationPage.checkYourAnswersHeading).toBeVisible();
    await registerOrganisationPage.submitRegistrationForm();

    await expect(registerOrganisationPage.validationSummaryError(
      'Please select checkbox to confirm you have read and understood the terms and conditions'
    )).toBeVisible();
    expect(routeState.registrationRequests).toHaveLength(0);
  });
});
