import { RegisterOrganisationPage } from '../../page-objects/pages/register-organisation.po';
import { RegisterOrganisationData } from './register-organisation-data';

export const completeOptionalRegisterOrganisationJourney = async (
  registerOrganisationPage: RegisterOrganisationPage,
  data: RegisterOrganisationData
): Promise<void> => {
  await registerOrganisationPage.openStartPage();
  await registerOrganisationPage.startRegistration();
  await registerOrganisationPage.chooseSolicitorOrganisationType();
  await registerOrganisationPage.enterOrganisationNameAndCompanyHouseNumber(
    data.organisationName,
    data.companyHouseNumber
  );
  await registerOrganisationPage.enterManualUkAddress(data.manualUkAddress);
  await registerOrganisationPage.enterDocumentExchangeReference(data.dxNumber, data.dxExchange);
  await registerOrganisationPage.enterOtherOrganisationRegulator(data.regulatorName, data.regulatorNumber);
  await registerOrganisationPage.chooseServices('Divorce', 'Damages');
  await registerOrganisationPage.enterPaymentByAccountNumbers(data.pbaNumbers);
  await registerOrganisationPage.enterContactDetails(data);
  await registerOrganisationPage.enterOtherIndividualRegulator(
    data.individualRegulatorName,
    data.individualRegulatorNumber
  );
};

export const completeMinimumRegisterOrganisationJourney = async (
  registerOrganisationPage: RegisterOrganisationPage,
  data: RegisterOrganisationData
): Promise<void> => {
  await registerOrganisationPage.openStartPage();
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
};
