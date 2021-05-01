export class Organisation {
    addressLine1: string;
    addressLine2: string;
    name: string;
    postcode: string;
    townCity: string;
    country: string;
    contactInformation: any[];
    paymentAccount: any[];
    constructor(prop) {
        Object.assign(this, prop);
    }
}
