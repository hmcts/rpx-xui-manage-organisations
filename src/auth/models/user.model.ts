export class UserModel {
  id: string;
  emailId: string;
  firstName: string;
  lastName: string;
  status: string;
  organisationId: string;
  pbaAccount: string;
  addresses:  UserAddressModel;
  constructor(prop) {
    Object.assign(this, prop);
  }
}
export class UserAddressModel{
  id: string;
  houseNoBuildingName: string;
  addressLine1: string;
  addressLine2: string;
  townCity: string;
  county: string;
  country: string;
  postcode: string;
  userId: string;
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

