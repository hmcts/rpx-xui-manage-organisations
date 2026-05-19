import { expect, test } from '../../fixtures';
import { setupRegisterOrganisationRoutes } from '../../helpers';
import {
  minimumSolicitorRegistration,
  optionalOtherOrganisationRegistration,
  otherOrganisationType
} from '../../mocks/registerOrganisation.mock';
import { RegisterOrganisationPage } from '../../page-objects/register-organisation.po';

test.describe('Register organisation', { tag: ['@integration', '@integration-register-organisation'] }, () => {
  test('submits the other-organisation journey with optional registration data', async ({
    manageOrgIntegrationPage: page
  }) => {
    const routeState = await setupRegisterOrganisationRoutes(page);
    const registerOrganisationPage = new RegisterOrganisationPage(page);

    await test.step('Complete the other-organisation route with optional values', async () => {
      await registerOrganisationPage.openStartPage();
      await expect(page).toHaveURL(/\/register-org-new\/register$/);

      await registerOrganisationPage.startRegistration();
      await registerOrganisationPage.chooseOtherOrganisationType(
        otherOrganisationType.value_en,
        optionalOtherOrganisationRegistration.otherOrganisationDetail
      );
      await registerOrganisationPage.enterOrganisationNameAndCompanyHouseNumber(
        optionalOtherOrganisationRegistration.companyName,
        optionalOtherOrganisationRegistration.companyHouseNumber
      );
      await registerOrganisationPage.enterManualUkAddress(
        optionalOtherOrganisationRegistration.manualUkAddress
      );
      await registerOrganisationPage.enterDocumentExchangeReference(
        optionalOtherOrganisationRegistration.dxNumber,
        optionalOtherOrganisationRegistration.dxExchange
      );
      await registerOrganisationPage.enterOtherOrganisationRegulator(
        optionalOtherOrganisationRegistration.organisationRegulatorName,
        optionalOtherOrganisationRegistration.organisationRegulatorNumber
      );
      await registerOrganisationPage.chooseServices('Divorce', 'Damages');
      await registerOrganisationPage.enterPaymentByAccountNumbers(
        optionalOtherOrganisationRegistration.pbaNumbers
      );
      await registerOrganisationPage.enterContactDetails(
        optionalOtherOrganisationRegistration.contactDetails
      );
      await registerOrganisationPage.enterOtherIndividualRegulator(
        optionalOtherOrganisationRegistration.individualRegulatorName,
        optionalOtherOrganisationRegistration.individualRegulatorNumber
      );
    });

    await test.step('Assert Check Your Answers preserves the full journey values', async () => {
      await expect(registerOrganisationPage.checkYourAnswersHeading).toBeVisible();
      await expect(registerOrganisationPage.summaryValue('Organisation type')).toContainText(
        `Other: ${otherOrganisationType.value_en}`
      );
      await expect(registerOrganisationPage.summaryValue('Organisation details')).toContainText(
        optionalOtherOrganisationRegistration.otherOrganisationDetail
      );
      await expect(registerOrganisationPage.summaryValue('Organisation name')).toContainText(
        optionalOtherOrganisationRegistration.companyName
      );
      await expect(registerOrganisationPage.summaryValue('Company registration number')).toContainText(
        optionalOtherOrganisationRegistration.companyHouseNumber
      );

      const addressSummary = registerOrganisationPage.summaryValue('Organisation address');
      for (const addressLine of [
        optionalOtherOrganisationRegistration.manualUkAddress.addressLine1,
        optionalOtherOrganisationRegistration.manualUkAddress.addressLine2,
        optionalOtherOrganisationRegistration.manualUkAddress.addressLine3,
        optionalOtherOrganisationRegistration.manualUkAddress.postTown,
        optionalOtherOrganisationRegistration.manualUkAddress.county,
        optionalOtherOrganisationRegistration.manualUkAddress.postCode,
        optionalOtherOrganisationRegistration.manualUkAddress.country
      ].filter((addressLine): addressLine is string => Boolean(addressLine))) {
        await expect(addressSummary).toContainText(addressLine);
      }

      await expect(registerOrganisationPage.summaryValue(
        'Do you have a document exchange reference for your main office?'
      )).toContainText('Yes');
      await expect(registerOrganisationPage.summaryValue('What\'s the DX reference for this office?')).toContainText(
        optionalOtherOrganisationRegistration.dxNumber
      );
      await expect(registerOrganisationPage.summaryValue('Service to access')).toContainText('Divorce');
      await expect(registerOrganisationPage.summaryValue('Service to access')).toContainText('Damages');
      await expect(registerOrganisationPage.summaryValue(
        'Does your organisation have a payment by account number?'
      )).toContainText('Yes');
      await expect(registerOrganisationPage.summaryValue('What PBA numbers does your organisation use?')).toContainText(
        optionalOtherOrganisationRegistration.pbaNumbers[0]
      );
      await expect(registerOrganisationPage.summaryValue('What PBA numbers does your organisation use?')).toContainText(
        optionalOtherOrganisationRegistration.pbaNumbers[1]
      );
      await expect(registerOrganisationPage.summaryValue('Regulatory organisation type')).toContainText(
        optionalOtherOrganisationRegistration.organisationRegulatorName
      );
      await expect(registerOrganisationPage.summaryValue('Regulatory organisation type')).toContainText(
        optionalOtherOrganisationRegistration.organisationRegulatorNumber
      );
      await expect(registerOrganisationPage.summaryValue('First name(s)')).toContainText(
        optionalOtherOrganisationRegistration.contactDetails.firstName
      );
      await expect(registerOrganisationPage.summaryValue('Last name')).toContainText(
        optionalOtherOrganisationRegistration.contactDetails.lastName
      );
      await expect(registerOrganisationPage.summaryValue('Email address')).toContainText(
        optionalOtherOrganisationRegistration.contactDetails.workEmailAddress
      );
      await expect(registerOrganisationPage.summaryValue(
        'Are you (as an individual) registered with a regulator?'
      )).toContainText('Yes');
      await expect(registerOrganisationPage.summaryValue(
        'What regulators are you (as an individual) registered with?'
      )).toContainText(optionalOtherOrganisationRegistration.individualRegulatorName);
      await expect(registerOrganisationPage.summaryValue(
        'What regulators are you (as an individual) registered with?'
      )).toContainText(optionalOtherOrganisationRegistration.individualRegulatorNumber);
    });

    await test.step('Block submission until terms are accepted', async () => {
      await registerOrganisationPage.submitRegistrationForm();

      await expect(registerOrganisationPage.validationSummaryError(
        'Please select checkbox to confirm you have read and understood the terms and conditions'
      )).toBeVisible();
      expect(routeState.registrationRequests).toHaveLength(0);
    });

    await test.step('Submit and assert the browser-to-node registration payload', async () => {
      await registerOrganisationPage.submitRegistration();

      await expect(registerOrganisationPage.submittedHeading).toBeVisible();
      await expect.poll(() => routeState.registrationRequests.length).toBe(1);
    });

    expect(routeState.lovRequests).toContainEqual({
      categoryId: 'OrgType',
      isChildRequired: 'Y',
      method: 'GET',
      serviceId: null
    });
    expect(routeState.regulatoryOrganisationTypeRequests).toEqual(['GET', 'GET']);

    const submittedRegistration = routeState.registrationRequests[0];
    expect(submittedRegistration).toMatchObject({
      address: optionalOtherOrganisationRegistration.manualUkAddress,
      companyHouseNumber: optionalOtherOrganisationRegistration.companyHouseNumber,
      companyName: optionalOtherOrganisationRegistration.companyName,
      contactDetails: optionalOtherOrganisationRegistration.contactDetails,
      dxExchange: optionalOtherOrganisationRegistration.dxExchange,
      dxNumber: optionalOtherOrganisationRegistration.dxNumber,
      hasDxReference: true,
      hasIndividualRegisteredWithRegulator: true,
      hasPBA: true,
      inInternationalMode: true,
      individualRegulators: [{
        organisationRegistrationNumber: optionalOtherOrganisationRegistration.individualRegulatorNumber,
        regulatorName: optionalOtherOrganisationRegistration.individualRegulatorName,
        regulatorType: 'Other'
      }],
      organisationType: {
        description: 'Other',
        key: 'OTHER'
      },
      otherOrganisationDetail: optionalOtherOrganisationRegistration.otherOrganisationDetail,
      otherOrganisationType: {
        description: otherOrganisationType.value_en,
        key: otherOrganisationType.key
      },
      pbaNumbers: optionalOtherOrganisationRegistration.pbaNumbers,
      regulators: [{
        organisationRegistrationNumber: optionalOtherOrganisationRegistration.organisationRegulatorNumber,
        regulatorName: optionalOtherOrganisationRegistration.organisationRegulatorName,
        regulatorType: 'Other'
      }],
      services: optionalOtherOrganisationRegistration.services,
      sraRegulated: false
    });
  });

  test('submits the minimum solicitor journey without optional registration data', async ({
    manageOrgIntegrationPage: page
  }) => {
    const routeState = await setupRegisterOrganisationRoutes(page);
    const registerOrganisationPage = new RegisterOrganisationPage(page);

    await registerOrganisationPage.openStartPage();
    await registerOrganisationPage.startRegistration();
    await registerOrganisationPage.chooseSolicitorOrganisationType();
    await registerOrganisationPage.enterOrganisationName(minimumSolicitorRegistration.companyName);
    await registerOrganisationPage.enterManualInternationalAddress(
      minimumSolicitorRegistration.manualInternationalAddress
    );
    await registerOrganisationPage.declineDocumentExchangeReference();
    await registerOrganisationPage.enterOrganisationRegulator(
      minimumSolicitorRegistration.organisationRegulatorNumber
    );
    await registerOrganisationPage.chooseServices('Divorce', 'Damages');
    await registerOrganisationPage.declinePaymentByAccount();
    await registerOrganisationPage.enterContactDetails(minimumSolicitorRegistration.contactDetails);
    await registerOrganisationPage.declineIndividualRegulator();

    await expect(registerOrganisationPage.checkYourAnswersHeading).toBeVisible();
    await expect(registerOrganisationPage.summaryValue('Organisation type')).toContainText('Solicitor');
    await expect(registerOrganisationPage.summaryValue('Organisation name')).toContainText(
      minimumSolicitorRegistration.companyName
    );
    await expect(registerOrganisationPage.summaryRow('Company registration number')).toHaveCount(0);
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

    await registerOrganisationPage.submitRegistration();

    await expect(registerOrganisationPage.submittedHeading).toBeVisible();
    await expect.poll(() => routeState.registrationRequests.length).toBe(1);

    const submittedRegistration = routeState.registrationRequests[0];
    expect(submittedRegistration.companyHouseNumber ?? null).toBeNull();
    expect(submittedRegistration).toMatchObject({
      address: minimumSolicitorRegistration.manualInternationalAddress,
      companyName: minimumSolicitorRegistration.companyName,
      contactDetails: minimumSolicitorRegistration.contactDetails,
      dxExchange: null,
      dxNumber: null,
      hasDxReference: false,
      hasIndividualRegisteredWithRegulator: false,
      hasPBA: false,
      inInternationalMode: true,
      individualRegulators: [],
      organisationType: {
        description: 'Solicitor',
        key: 'SolicitorOrganisation'
      },
      otherOrganisationDetail: null,
      otherOrganisationType: null,
      pbaNumbers: [],
      regulators: [{
        organisationRegistrationNumber: minimumSolicitorRegistration.organisationRegulatorNumber,
        regulatorType: 'Solicitor Regulation Authority (SRA)'
      }],
      services: minimumSolicitorRegistration.services,
      sraRegulated: true
    });
  });
});
