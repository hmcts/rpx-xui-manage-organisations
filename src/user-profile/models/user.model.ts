export class UserModel {
  id: string;
  emailId: string;
  firstName: string;
  lastName: string;
  status: string;
  organisationId: string;
  roles: string[];
  constructor(prop) {
    Object.assign(this, prop);
  }
}

export interface UserInterface {
  id: string;
  emailId: string;
  firstName: string;
  lastName: string;
  status: string;
  organisationId: string;
  pbaAccount: string;
  addresses: UserAddress[];
  roles: string[];
}

export interface UserAddress {
  id: string;
  houseNoBuildingName: string;
  addressLine1: string;
  addressLine2: string;
  townCity: string;
  county: string;
  country: string;
  postcode: string;
  userId: string;
}

