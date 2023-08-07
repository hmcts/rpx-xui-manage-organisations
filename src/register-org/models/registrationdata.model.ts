import { ContactDetails } from './contact-details.model';

export type RegistrationData = {
  name: string;
  hasDxReference: boolean;
  dxNumber?: string;
  dxExchange?: string;
  contactDetails: ContactDetails;
  hasRegisteredWithRegulator: boolean;
}
