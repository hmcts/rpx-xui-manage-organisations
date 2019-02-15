export class UserModel {
  data: string;
  'default-service': string;
  'default-url': string;
  exp: number;
  forename: string;
  group: string;
  iat: number;
  id: string;
  jti: string;
  loa: number;
  sub: string;
  surname: string;
  type: string;
  constructor(prop) {
    Object.assign(this, prop);
  }
}
