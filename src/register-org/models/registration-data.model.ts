import { Address } from './address.model';
import { ContactDetails } from './contact-details.model';
import { Regulator } from './regulator.model';

// TODO: Reference Address model from CommonLib once it is available

export type RegistrationData = {
  companyName: string;
  companyHouseNumber?: string;
  hasDxReference: boolean;
  dxNumber?: string;
  dxExchange?: string;
  services: string[];
  hasPBA: boolean;
  pbaNumbers?: string[];
  contactDetails: ContactDetails;
  address: Address;
  organisationType: string;
  otherOrganisationType?: string;
  otherOrganisationDetail?: string;
  regulatorRegisteredWith: string;
  regulators: Regulator[];
  hasIndividualRegisteredWithRegulator: boolean;
  individualRegulators?: Regulator[];
}
