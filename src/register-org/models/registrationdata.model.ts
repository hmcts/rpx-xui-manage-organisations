import { AddressModel } from '@hmcts/rpx-xui-common-lib';
import { ContactDetails } from './contact-details.model';
import { Regulator } from './regulator.model';

export type RegistrationData = {
  name: string;
  hasDxReference: boolean;
  dxNumber?: string;
  dxExchange?: string;
  services: string[];
  hasPBA: boolean;
  contactDetails: ContactDetails;
  companyHouseNumber?: string;
  address: AddressModel;
  organisationType: string;
  otherOrganisationType?: string;
  otherOrganisationDetail?: string;
  organisationNumber?: string;
  regulatorRegisteredWith: string;
  inInternationalMode: boolean;
  regulators: Regulator[];
  hasIndividualRegisteredWithRegulator: boolean;
  individualRegulators?: Regulator[];
}
