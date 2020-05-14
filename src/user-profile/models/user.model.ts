export class UserModel {
  id: string;
  emailId: string;
  firstName: string;
  lastName: string;
  status: string;
  organisationId: string;
  roles: string[];
  sessionTimeout: SessionTimeout;
  constructor(prop) {
    Object.assign(this, prop);
  }
}

export interface SessionTimeout {
  idleModalDisplayTime: number;
  totalIdleTime: number;
}

export interface UserInterface {
  email: string;
  orgId: string;
  roles: string[];
  sessionTimeout: SessionTimeout;
  userId: string;
}

export interface UserAddress {
  id: string;
  addressLine1: string;
  addressLine2: string;
  townCity: string;
  county: string;
  country: string;
  postcode: string;
  userId: string;
}

