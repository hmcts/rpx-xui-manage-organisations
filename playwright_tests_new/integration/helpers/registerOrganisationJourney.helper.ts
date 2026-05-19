import {
  minimumSolicitorRegistration,
  optionalOtherOrganisationRegistration,
  otherOrganisationType
} from '../mocks/registerOrganisation.mock';
import { RegisterOrganisationPage } from '../page-objects/register-organisation.po';

export const completeOptionalOtherOrganisationJourney = async (
  registerOrganisationPage: RegisterOrganisationPage
): Promise<void> => {
  await registerOrganisationPage.openStartPage();
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
};

export const completeMinimumSolicitorJourney = async (
  registerOrganisationPage: RegisterOrganisationPage
): Promise<void> => {
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
};
