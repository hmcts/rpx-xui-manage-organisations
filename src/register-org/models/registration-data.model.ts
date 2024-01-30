import { AddressModel } from '@hmcts/rpx-xui-common-lib';
import { ContactDetails } from './contact-details.model';
import { OrganisationService } from './organisation-service.model';
import { Regulator } from './regulator.model';

// TODO: Reference Address model from CommonLib once it is available

export type RegistrationData = {
  companyName: string;
  companyHouseNumber?: string;
  hasDxReference: boolean;
  dxNumber?: string;
  dxExchange?: string;
  services: OrganisationService[];
  otherServices?: string;
  hasPBA: boolean;
  contactDetails: ContactDetails;
  address: AddressModel;
  organisationType: OrganisationType;
  otherOrganisationType?: OrganisationType;
  otherOrganisationDetail?: string;
  regulatorRegisteredWith: string;
  inInternationalMode: boolean;
  regulators: Regulator[];
  hasIndividualRegisteredWithRegulator: boolean;
  individualRegulators?: Regulator[];
  pbaNumbers: string[];
}

export interface OrganisationType {
  key: string;
  description: string;
}
