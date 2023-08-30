import { ContactDetails } from './contact-details.model';

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
  address: string;
  organisationType: string;
  otherOrganisationType?: string;
  otherOrganisationDetail?: string;
  organisationNumber?: string;
  regulatoryOrgType: string;
  regulatorRegisteredWith: string;
}
