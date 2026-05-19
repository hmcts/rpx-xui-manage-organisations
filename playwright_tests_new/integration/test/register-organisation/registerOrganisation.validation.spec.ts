import { expect, test } from '../../fixtures';
import { setupRegisterOrganisationRoutes } from '../../helpers';
import {
  minimumSolicitorRegistration,
  optionalOtherOrganisationRegistration,
  otherOrganisationType
} from '../../mocks/registerOrganisation.mock';
import { RegisterOrganisationPage } from '../../page-objects/register-organisation.po';

test.describe('Register organisation validation paths', { tag: ['@integration', '@integration-register-organisation'] }, () => {
  test('validates start, organisation type and Companies House details before continuing', async ({
    manageOrgIntegrationPage: page
  }) => {
    const routeState = await setupRegisterOrganisationRoutes(page);
    const registerOrganisationPage = new RegisterOrganisationPage(page);

    await test.step('Require start-page confirmation before registration begins', async () => {
      await registerOrganisationPage.openStartPage();
      await registerOrganisationPage.continueWith('Start');
      await expect(registerOrganisationPage.validationSummaryError('Please select the checkbox')).toBeVisible();
      await expect(page).toHaveURL(/\/register-org-new\/register$/);
    });

    await test.step('Require an organisation type and other-organisation details', async () => {
      await registerOrganisationPage.confirmedOrganisationAccountCheckbox.check();
      await registerOrganisationPage.continueWith('Start');
      await registerOrganisationPage.continueWith();
      await expect(registerOrganisationPage.validationSummaryError('Please select an organisation')).toBeVisible();
      await expect(page).toHaveURL(/\/register-org-new\/organisation-type$/);

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
    });

    await test.step('Require a company name and valid Companies House number', async () => {
      await registerOrganisationPage.continueWith();
      await expect(registerOrganisationPage.validationSummaryError('Enter an organisation name')).toBeVisible();

      await registerOrganisationPage.organisationNameInput.fill(optionalOtherOrganisationRegistration.companyName);
      await registerOrganisationPage.companyHouseNumberInput.fill('1234');
      await registerOrganisationPage.continueWith();
      await expect(registerOrganisationPage.validationSummaryError('Enter a valid Companies House number')).toBeVisible();
    });

    expect(routeState.registrationRequests).toHaveLength(0);
  });

  test('validates address, DX, services, PBA, contact and individual regulator steps', async ({
    manageOrgIntegrationPage: page
  }) => {
    const routeState = await setupRegisterOrganisationRoutes(page);
    const registerOrganisationPage = new RegisterOrganisationPage(page);

    await registerOrganisationPage.openStartPage();
    await registerOrganisationPage.startRegistration();
    await registerOrganisationPage.chooseSolicitorOrganisationType();
    await registerOrganisationPage.enterOrganisationName(minimumSolicitorRegistration.companyName);

    await test.step('Validate manual address choice and postcode rules', async () => {
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
    });

    await test.step('Validate DX reference details before regulator selection', async () => {
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
      await registerOrganisationPage.enterOrganisationRegulator(
        minimumSolicitorRegistration.organisationRegulatorNumber
      );
    });

    await test.step('Validate services and PBA details', async () => {
      await registerOrganisationPage.continueWith();
      await expect(registerOrganisationPage.validationSummaryError('Please select at least one service')).toBeVisible();

      await registerOrganisationPage.otherServicesCheckbox.check();
      await registerOrganisationPage.continueWith();
      await expect(registerOrganisationPage.validationSummaryError('Enter one or more services')).toBeVisible();

      await registerOrganisationPage.otherServicesInput.fill('Integration validation service');
      await registerOrganisationPage.continueWith();
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
    });

    await test.step('Validate contact details and individual regulator choice', async () => {
      await registerOrganisationPage.continueWith();
      await expect(registerOrganisationPage.validationSummaryError('Enter first name')).toBeVisible();
      await expect(registerOrganisationPage.validationSummaryError('Enter last name')).toBeVisible();
      await expect(registerOrganisationPage.validationSummaryError('Enter email address')).toBeVisible();

      await registerOrganisationPage.firstNameInput.fill(minimumSolicitorRegistration.contactDetails.firstName);
      await registerOrganisationPage.lastNameInput.fill(minimumSolicitorRegistration.contactDetails.lastName);
      await registerOrganisationPage.workEmailAddressInput.fill('not-an-email');
      await registerOrganisationPage.continueWith();
      await expect(registerOrganisationPage.validationSummaryError('Enter email address')).toBeVisible();

      await registerOrganisationPage.workEmailAddressInput.fill(
        minimumSolicitorRegistration.contactDetails.workEmailAddress
      );
      await registerOrganisationPage.continueWith();
      await registerOrganisationPage.continueWith();
      await expect(registerOrganisationPage.validationSummaryError('Please select an option')).toBeVisible();
    });

    expect(routeState.registrationRequests).toHaveLength(0);
  });
});
