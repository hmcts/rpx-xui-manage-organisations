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
  hasRegisteredWithRegulator: boolean;
  companyHouseNumber?: string;
  address: AddressModel;
  organisationType: string;
  otherOrganisationType?: string;
  otherOrganisationDetail?: string;
  organisationNumber?: string;
  regulators: Regulator[];
  regulatorRegisteredWith: string;
  inInternationalMode: boolean;
}
