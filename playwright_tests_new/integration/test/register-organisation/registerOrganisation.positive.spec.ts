import { expect, test } from '../../fixtures';
import {
  completeMinimumSolicitorJourney,
  completeOptionalOtherOrganisationJourney,
  completeOptionalSolicitorJourney,
  setupRegisterOrganisationRoutes
} from '../../helpers';
import { manageOrgRuntimeConfiguration } from '../../mocks/manageOrgIntegration.mock';
import {
  minimumSolicitorRegistration,
  optionalOtherOrganisationRegistration,
  optionalSolicitorRegistration,
  otherOrganisationType
} from '../../mocks/registerOrganisation.mock';
import { RegisterOrganisationPage } from '../../page-objects/register-organisation.po';

const assertOptionalOtherOrganisationCheckYourAnswers = async (
  registerOrganisationPage: RegisterOrganisationPage
): Promise<void> => {
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
  for (const service of optionalOtherOrganisationRegistration.services) {
    await expect(registerOrganisationPage.summaryValue('Service to access')).toContainText(service.value);
  }
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
};

const assertMinimumSolicitorCheckYourAnswers = async (
  registerOrganisationPage: RegisterOrganisationPage
): Promise<void> => {
  await expect(registerOrganisationPage.checkYourAnswersHeading).toBeVisible();
  await expect(registerOrganisationPage.summaryValue('Organisation type')).toContainText('Solicitor');
  await expect(registerOrganisationPage.summaryValue('Organisation name')).toContainText(
    minimumSolicitorRegistration.companyName
  );
  await expect(registerOrganisationPage.summaryRow('Company registration number')).toHaveCount(0);

  const addressSummary = registerOrganisationPage.summaryValue('Organisation address');
  for (const addressLine of [
    minimumSolicitorRegistration.manualInternationalAddress.addressLine1,
    minimumSolicitorRegistration.manualInternationalAddress.postTown,
    minimumSolicitorRegistration.manualInternationalAddress.country
  ]) {
    await expect(addressSummary).toContainText(addressLine);
  }

  await expect(registerOrganisationPage.summaryValue(
    'Do you have a document exchange reference for your main office?'
  )).toContainText('No');
  await expect(registerOrganisationPage.summaryRow('What\'s the DX reference for this office?')).toHaveCount(0);
  for (const service of minimumSolicitorRegistration.services) {
    await expect(registerOrganisationPage.summaryValue('Service to access')).toContainText(service.value);
  }
  await expect(registerOrganisationPage.summaryValue(
    'Does your organisation have a payment by account number?'
  )).toContainText('No');
  await expect(registerOrganisationPage.summaryRow('What PBA numbers does your organisation use?')).toHaveCount(0);
  await expect(registerOrganisationPage.summaryValue('Regulatory organisation type')).toContainText(
    'Solicitor Regulation Authority (SRA)'
  );
  await expect(registerOrganisationPage.summaryValue('Regulatory organisation type')).toContainText(
    minimumSolicitorRegistration.organisationRegulatorNumber
  );
  await expect(registerOrganisationPage.summaryValue('First name(s)')).toContainText(
    minimumSolicitorRegistration.contactDetails.firstName
  );
  await expect(registerOrganisationPage.summaryValue('Last name')).toContainText(
    minimumSolicitorRegistration.contactDetails.lastName
  );
  await expect(registerOrganisationPage.summaryValue('Email address')).toContainText(
    minimumSolicitorRegistration.contactDetails.workEmailAddress
  );
  await expect(registerOrganisationPage.summaryValue(
    'Are you (as an individual) registered with a regulator?'
  )).toContainText('No');
  await expect(registerOrganisationPage.summaryRow(
    'What regulators are you (as an individual) registered with?'
  )).toHaveCount(0);
};

const assertOptionalSolicitorCheckYourAnswers = async (
  registerOrganisationPage: RegisterOrganisationPage
): Promise<void> => {
  await expect(registerOrganisationPage.checkYourAnswersHeading).toBeVisible();
  await expect(registerOrganisationPage.summaryValue('Organisation type')).toContainText('Solicitor');
  await expect(registerOrganisationPage.summaryValue('Organisation name')).toContainText(
    optionalSolicitorRegistration.companyName
  );
  await expect(registerOrganisationPage.summaryValue('Company registration number')).toContainText(
    optionalSolicitorRegistration.companyHouseNumber
  );

  const addressSummary = registerOrganisationPage.summaryValue('Organisation address');
  for (const addressLine of [
    optionalSolicitorRegistration.manualUkAddress.addressLine1,
    optionalSolicitorRegistration.manualUkAddress.addressLine2,
    optionalSolicitorRegistration.manualUkAddress.addressLine3,
    optionalSolicitorRegistration.manualUkAddress.postTown,
    optionalSolicitorRegistration.manualUkAddress.county,
    optionalSolicitorRegistration.manualUkAddress.postCode,
    optionalSolicitorRegistration.manualUkAddress.country
  ].filter((addressLine): addressLine is string => Boolean(addressLine))) {
    await expect(addressSummary).toContainText(addressLine);
  }

  await expect(registerOrganisationPage.summaryValue(
    'Do you have a document exchange reference for your main office?'
  )).toContainText('Yes');
  await expect(registerOrganisationPage.summaryValue('What\'s the DX reference for this office?')).toContainText(
    optionalSolicitorRegistration.dxNumber
  );
  await expect(registerOrganisationPage.summaryValue(
    'Does your organisation have a payment by account number?'
  )).toContainText('Yes');
  await expect(registerOrganisationPage.summaryValue('What PBA numbers does your organisation use?')).toContainText(
    optionalSolicitorRegistration.pbaNumbers[0]
  );
  await expect(registerOrganisationPage.summaryValue('What PBA numbers does your organisation use?')).toContainText(
    optionalSolicitorRegistration.pbaNumbers[1]
  );
  await expect(registerOrganisationPage.summaryValue('Regulatory organisation type')).toContainText(
    optionalSolicitorRegistration.organisationRegulatorName
  );
  await expect(registerOrganisationPage.summaryValue('Regulatory organisation type')).toContainText(
    optionalSolicitorRegistration.organisationRegulatorNumber
  );
  for (const service of optionalSolicitorRegistration.services) {
    await expect(registerOrganisationPage.summaryValue('Service to access')).toContainText(service.value);
  }
  await expect(registerOrganisationPage.summaryValue('First name(s)')).toContainText(
    optionalSolicitorRegistration.contactDetails.firstName
  );
  await expect(registerOrganisationPage.summaryValue('Last name')).toContainText(
    optionalSolicitorRegistration.contactDetails.lastName
  );
  await expect(registerOrganisationPage.summaryValue('Email address')).toContainText(
    optionalSolicitorRegistration.contactDetails.workEmailAddress
  );
  await expect(registerOrganisationPage.summaryValue(
    'Are you (as an individual) registered with a regulator?'
  )).toContainText('Yes');
  await expect(registerOrganisationPage.summaryValue(
    'What regulators are you (as an individual) registered with?'
  )).toContainText(optionalSolicitorRegistration.individualRegulatorName);
  await expect(registerOrganisationPage.summaryValue(
    'What regulators are you (as an individual) registered with?'
  )).toContainText(optionalSolicitorRegistration.individualRegulatorNumber);
};

test.describe('Register organisation', { tag: ['@integration', '@integration-register-organisation'] }, () => {
  test('renders already-registered guidance with configured external links', async ({
    manageOrgIntegrationPage: page
  }) => {
    const routeState = await setupRegisterOrganisationRoutes(page);
    const registerOrganisationPage = new RegisterOrganisationPage(page);

    await registerOrganisationPage.openStartPage();

    await expect(page).toHaveURL(/\/register-org-new\/register$/);
    await expect(registerOrganisationPage.startPageHeading).toBeVisible();
    await expect(registerOrganisationPage.alreadyRegisteredHeading).toBeVisible();
    await expect(registerOrganisationPage.manageCasesLink).toHaveAttribute(
      'href',
      manageOrgRuntimeConfiguration.manageCaseLink
    );
    await expect(registerOrganisationPage.manageCasesLink).toHaveAttribute('target', '_blank');
    await expect(registerOrganisationPage.manageCasesLink).toHaveAttribute('rel', 'noopener noreferrer');
    await expect(registerOrganisationPage.manageOrganisationLink).toHaveAttribute(
      'href',
      manageOrgRuntimeConfiguration.manageOrgLink
    );
    await expect(registerOrganisationPage.manageOrganisationLink).toHaveAttribute('target', '_blank');
    await expect(registerOrganisationPage.manageOrganisationLink).toHaveAttribute('rel', 'noopener noreferrer');
    expect(routeState.registrationRequests).toHaveLength(0);
  });

  test('renders the other-organisation CYA page with optional registration data', async ({
    manageOrgIntegrationPage: page
  }) => {
    const routeState = await setupRegisterOrganisationRoutes(page);
    const registerOrganisationPage = new RegisterOrganisationPage(page);

    await completeOptionalOtherOrganisationJourney(registerOrganisationPage);

    await expect(page).toHaveURL(/\/register-org-new\/check-your-answers$/);
    await assertOptionalOtherOrganisationCheckYourAnswers(registerOrganisationPage);
    expect(routeState.registrationRequests).toHaveLength(0);
  });

  test('submits the other-organisation journey with optional registration payload', async ({
    manageOrgIntegrationPage: page
  }) => {
    const routeState = await setupRegisterOrganisationRoutes(page);
    const registerOrganisationPage = new RegisterOrganisationPage(page);

    await completeOptionalOtherOrganisationJourney(registerOrganisationPage);
    await registerOrganisationPage.submitRegistration();

    await expect(registerOrganisationPage.submittedHeading).toBeVisible();
    await expect.poll(() => routeState.registrationRequests.length).toBe(1);
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

  test('submits the solicitor journey with optional registration payload', async ({
    manageOrgIntegrationPage: page
  }) => {
    const routeState = await setupRegisterOrganisationRoutes(page);
    const registerOrganisationPage = new RegisterOrganisationPage(page);

    await completeOptionalSolicitorJourney(registerOrganisationPage);
    await assertOptionalSolicitorCheckYourAnswers(registerOrganisationPage);
    await registerOrganisationPage.submitRegistration();

    await expect(registerOrganisationPage.submittedHeading).toBeVisible();
    await expect.poll(() => routeState.registrationRequests.length).toBe(1);

    const submittedRegistration = routeState.registrationRequests[0];
    expect(submittedRegistration).toMatchObject({
      address: optionalSolicitorRegistration.manualUkAddress,
      companyHouseNumber: optionalSolicitorRegistration.companyHouseNumber,
      companyName: optionalSolicitorRegistration.companyName,
      contactDetails: optionalSolicitorRegistration.contactDetails,
      dxExchange: optionalSolicitorRegistration.dxExchange,
      dxNumber: optionalSolicitorRegistration.dxNumber,
      hasDxReference: true,
      hasIndividualRegisteredWithRegulator: true,
      hasPBA: true,
      inInternationalMode: true,
      individualRegulators: [{
        organisationRegistrationNumber: optionalSolicitorRegistration.individualRegulatorNumber,
        regulatorName: optionalSolicitorRegistration.individualRegulatorName,
        regulatorType: 'Other'
      }],
      organisationType: {
        description: 'Solicitor',
        key: 'SolicitorOrganisation'
      },
      otherOrganisationDetail: null,
      otherOrganisationType: null,
      pbaNumbers: optionalSolicitorRegistration.pbaNumbers,
      regulators: [{
        organisationRegistrationNumber: optionalSolicitorRegistration.organisationRegulatorNumber,
        regulatorName: optionalSolicitorRegistration.organisationRegulatorName,
        regulatorType: 'Other'
      }],
      services: optionalSolicitorRegistration.services,
      sraRegulated: false
    });
  });

  test('renders the minimum solicitor CYA page without optional registration data', async ({
    manageOrgIntegrationPage: page
  }) => {
    const routeState = await setupRegisterOrganisationRoutes(page);
    const registerOrganisationPage = new RegisterOrganisationPage(page);

    await completeMinimumSolicitorJourney(registerOrganisationPage);

    await assertMinimumSolicitorCheckYourAnswers(registerOrganisationPage);
    expect(routeState.registrationRequests).toHaveLength(0);
  });

  test('submits the minimum solicitor journey without optional registration data', async ({
    manageOrgIntegrationPage: page
  }) => {
    const routeState = await setupRegisterOrganisationRoutes(page);
    const registerOrganisationPage = new RegisterOrganisationPage(page);

    await completeMinimumSolicitorJourney(registerOrganisationPage);
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
