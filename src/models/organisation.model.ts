import { Regulator } from '../register-org/models';
import { PBANumberModel } from './pbaNumber.model';

export interface DxAddress {
  dxNumber: string | null;
  dxExchange: string | null;
}

export interface OrganisationContactInformation {
  addressLine1: string | null;
  addressLine2: string | null;
  addressLine3: string | null;
  townCity: string | null;
  county: string | null;
  country: string | null;
  postCode: string | null;
  dxAddress: DxAddress[];
}

export interface OrganisationDetails {
  name: string;
  organisationIdentifier: string;
  organisationProfileIds: string[];
  contactInformation: OrganisationContactInformation[];
  // Unsure how pending updates to contact information are handled but currently included as an optional boolean
  pendingContactInformation?: boolean;
  pendingNameUpdate?: boolean;
  pendingSraUpdate?: boolean;
  status: string;
  sraId: string;
  sraRegulated: boolean;
  superUser: {
    firstName: string;
    lastName: string;
    email: string;
  };
  paymentAccount: PBANumberModel[];
  pendingPaymentAccount?: string[];
  pendingAddPaymentAccount: PBANumberModel[];
  pendingRemovePaymentAccount: PBANumberModel[];
  response?: any;
  organisationType?: string;
  companyRegistrationNumber?: string;
  regulators?: Regulator[];
  orgType?: string;
  orgAttributes?: {key: string, value: string}[];
}

export interface Jurisdiction {
  jurisdictionId: string;
  jurisdictionName: string;
  accessTypes: OrganisationAccessType[];
}

export interface JurisdictionResponse {
  jurisdictions: Jurisdiction[]
}

export interface OrganisationAccessType {
  organisationProfileId: string;
  accessTypeId: string;
  accessMandatory: boolean;
  accessDefault: boolean;
  display: boolean;
  description: string;
  hint: string;
  displayOrder: number;
}
