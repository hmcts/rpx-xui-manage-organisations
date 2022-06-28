export class UserModel {
  public id: string;
  public email: string;
  public firstName: string;
  public lastName: string;
  public status: string;
  public organisationId: string;
  public roles: string[];
  public sessionTimeout: SessionTimeout;
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

