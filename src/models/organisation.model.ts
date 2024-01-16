import { Regulator } from '../register-org/models';
import { PBANumberModel } from './pbaNumber.model';

export interface DxAddress {
  dxNumber: string;
  dxExchange: string;
}

export interface OrganisationContactInformation {
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  townCity: string;
  county: string;
  country: string;
  postCode: string;
  dxAddress: DxAddress[];
}

export interface OrganisationDetails {
  name: string;
  organisationIdentifier: string;
  organisationProfileIds: string[];
  contactInformation: OrganisationContactInformation[];
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
