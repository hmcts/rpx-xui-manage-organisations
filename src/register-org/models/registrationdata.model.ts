import { ContactDetails } from './contact-details.model';
import { RegulatoryOrganisationType } from './regulatory-organisation-type.model';

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
  organisationNumber?: string;
  regulatoryOrganisationTypes: RegulatoryOrganisationType[];
  regulatorRegisteredWith: string;
}
