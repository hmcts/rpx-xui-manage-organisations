export class UserModel {
  data: string
  'default-service': string
  'default-url': string
  exp: number
  forename: string
  group: string
  iat: number
  id: string
  jti: string
  loa: number
  sub: string
  surname: string
  type: string
  constructor(prop) {
    Object.assign(this, prop)
  }
}
export class UserProfileModel {
  id: string;
  emailId: string;
  firstName: string;
  lastName: string;
  status: string;
  organisationId: string;
  pbaAccount: string;
  addresses: UserAddress[];
  constructor(prop) {
    Object.assign(this, prop);
  }
}
export class UserAddress{
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
