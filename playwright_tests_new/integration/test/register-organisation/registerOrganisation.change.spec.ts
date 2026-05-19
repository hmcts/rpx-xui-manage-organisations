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
