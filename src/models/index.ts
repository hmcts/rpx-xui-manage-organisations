
export interface DxAddress {
  dxNumber: string;
  dxExchange: string;
}

export interface PBANumberModel {
  pbaNumber: string;
  status?: string;
  statusMessage?: string;
  dateCreated?: string;
  dateAccepted?: string;
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
  pendingPaymentAccount?: PBANumberModel[];
  pendingAddPaymentAccount: PBANumberModel[];
  pendingRemovePaymentAccount: PBANumberModel[];
  response?: any;
}
