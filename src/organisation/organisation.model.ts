export class Organisation {
  name: string;
  superUser:{
    firstName: string,
    lastName: string,
    email: string
  };
  contactInformation: {
    houseNoBuildingName: string;
    addressLine1: string;
    addressLine2: string;
    postcode: string;
    townCity: string;
    country: string;
    paymentAccount: Array<number>;
    dxAddress: Array<object>;
  };
  constructor(prop) {
      Object.assign(this, prop);
  }
}
