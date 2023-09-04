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
  address: string;
  organisationType: string;
  organisationNumber?: string;
  regulatorRegisteredWith: string;
  regulators: Regulator[];
  hasIndividualRegisteredWithRegulator: boolean;
  individualRegulatorDetails?: Regulator[];
}
