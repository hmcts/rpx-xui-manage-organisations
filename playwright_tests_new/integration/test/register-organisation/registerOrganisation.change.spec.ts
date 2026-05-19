import { expect, test } from '../../fixtures';
import {
  completeOptionalOtherOrganisationJourney,
  setupRegisterOrganisationRoutes
} from '../../helpers';
import {
  optionalOtherOrganisationRegistration,
  otherOrganisationType
} from '../../mocks/registerOrganisation.mock';
import { RegisterOrganisationPage } from '../../page-objects/register-organisation.po';

test.describe('Register organisation Check Your Answers change links', {
  tag: ['@integration', '@integration-register-organisation']
}, () => {
  test('routes CYA change links back to populated registration steps', async ({
    manageOrgIntegrationPage: page
  }) => {
    await setupRegisterOrganisationRoutes(page);
    const registerOrganisationPage = new RegisterOrganisationPage(page);

    await completeOptionalOtherOrganisationJourney(registerOrganisationPage);
    await expect(registerOrganisationPage.checkYourAnswersHeading).toBeVisible();

    await registerOrganisationPage.summaryChangeLink('Organisation type').click();
    await expect(page).toHaveURL(/\/register-org-new\/organisation-type$/);
    await expect(registerOrganisationPage.otherOrganisationTypeRadio).toBeChecked();
    await expect(registerOrganisationPage.otherOrganisationTypeSelect.locator('option:checked')).toContainText(
      otherOrganisationType.value_en
    );
    await expect(registerOrganisationPage.otherOrganisationDetailInput).toHaveValue(
      optionalOtherOrganisationRegistration.otherOrganisationDetail
    );
    await registerOrganisationPage.goBack();
    await expect(registerOrganisationPage.checkYourAnswersHeading).toBeVisible();

    await registerOrganisationPage.summaryChangeLink('Organisation name').click();
    await expect(page).toHaveURL(/\/register-org-new\/company-house-details$/);
    await expect(registerOrganisationPage.organisationNameInput).toHaveValue(
      optionalOtherOrganisationRegistration.companyName
    );
    await expect(registerOrganisationPage.companyHouseNumberInput).toHaveValue(
      optionalOtherOrganisationRegistration.companyHouseNumber
    );
    await registerOrganisationPage.goBack();
    await expect(registerOrganisationPage.checkYourAnswersHeading).toBeVisible();

    await registerOrganisationPage.summaryChangeLink('Organisation address').click();
    await expect(page).toHaveURL(/\/register-org-new\/registered-address\/internal$/);
    await expect(registerOrganisationPage.addressLine1Input).toHaveValue(
      optionalOtherOrganisationRegistration.manualUkAddress.addressLine1
    );
    await expect(registerOrganisationPage.postCodeInput).toHaveValue(
      optionalOtherOrganisationRegistration.manualUkAddress.postCode
    );
    await registerOrganisationPage.goBack();
    await expect(registerOrganisationPage.checkYourAnswersHeading).toBeVisible();

    await registerOrganisationPage.summaryChangeLink('What\'s the DX reference for this office?').click();
    await expect(page).toHaveURL(/\/register-org-new\/document-exchange-reference-details$/);
    await expect(registerOrganisationPage.dxNumberInput).toHaveValue(optionalOtherOrganisationRegistration.dxNumber);
    await expect(registerOrganisationPage.dxExchangeInput).toHaveValue(optionalOtherOrganisationRegistration.dxExchange);
    await registerOrganisationPage.goBack();
    await expect(registerOrganisationPage.checkYourAnswersHeading).toBeVisible();

    await registerOrganisationPage.summaryChangeLink('What PBA numbers does your organisation use?').click();
    await expect(page).toHaveURL(/\/register-org-new\/payment-by-account-details$/);
    await expect(registerOrganisationPage.pbaNumberInput()).toHaveValue(
      optionalOtherOrganisationRegistration.pbaNumbers[0]
    );
    await expect(registerOrganisationPage.pbaNumberInput(1)).toHaveValue(
      optionalOtherOrganisationRegistration.pbaNumbers[1]
    );
    await registerOrganisationPage.goBack();
    await expect(registerOrganisationPage.checkYourAnswersHeading).toBeVisible();

    await registerOrganisationPage.summaryChangeLink('Regulatory organisation type').click();
    await expect(page).toHaveURL(/\/register-org-new\/regulatory-organisation-type$/);
    await expect(registerOrganisationPage.regulatorTypeSelect.locator('option:checked')).toContainText('Other');
    await expect(registerOrganisationPage.regulatorNameInput).toHaveValue(
      optionalOtherOrganisationRegistration.organisationRegulatorName
    );
    await expect(registerOrganisationPage.organisationRegistrationNumberInput).toHaveValue(
      optionalOtherOrganisationRegistration.organisationRegulatorNumber
    );
    await registerOrganisationPage.goBack();
    await expect(registerOrganisationPage.checkYourAnswersHeading).toBeVisible();

    await registerOrganisationPage.summaryChangeLink('First name(s)').click();
    await expect(page).toHaveURL(/\/register-org-new\/contact-details$/);
    await expect(registerOrganisationPage.firstNameInput).toHaveValue(
      optionalOtherOrganisationRegistration.contactDetails.firstName
    );
    await expect(registerOrganisationPage.lastNameInput).toHaveValue(
      optionalOtherOrganisationRegistration.contactDetails.lastName
    );
    await expect(registerOrganisationPage.workEmailAddressInput).toHaveValue(
      optionalOtherOrganisationRegistration.contactDetails.workEmailAddress
    );
    await registerOrganisationPage.goBack();
    await expect(registerOrganisationPage.checkYourAnswersHeading).toBeVisible();

    await registerOrganisationPage.summaryChangeLink(
      'What regulators are you (as an individual) registered with?'
    ).click();
    await expect(page).toHaveURL(/\/register-org-new\/individual-registered-with-regulator-details$/);
    await expect(registerOrganisationPage.regulatorTypeSelect.locator('option:checked')).toContainText('Other');
    await expect(registerOrganisationPage.regulatorNameInput).toHaveValue(
      optionalOtherOrganisationRegistration.individualRegulatorName
    );
    await expect(registerOrganisationPage.organisationRegistrationNumberInput).toHaveValue(
      optionalOtherOrganisationRegistration.individualRegulatorNumber
    );
    await registerOrganisationPage.goBack();

    await expect(registerOrganisationPage.checkYourAnswersHeading).toBeVisible();
  });
});
