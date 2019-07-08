export class OrganisationAddress {
  addressLine1: string;
  townCity: string;
  county: string;
  dxAddress: [OrganisationDxAddress];
  }

export class OrganisationDxAddress {
      dxNumber: string;
      dxExchange: string;
  }

export class OrganisationSuperUser {
  userIdentifier: string;
  firstName: string;
  lastName: string;
  email: string;
}

export class Organisation {
  constructor(prop) {
    Object.assign(this, prop);
  }
  organisationIdentifier: string;
  contactInformation: [OrganisationAddress];
  superUser: OrganisationSuperUser;
  status: string;
  name: string;
  paymentAccount: [any];
}
