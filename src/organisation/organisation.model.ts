export class Organisation {
    public addressLine1: string;
    public addressLine2: string;
    public name: string;
    public postcode: string;
    public townCity: string;
    public country: string;
    public contactInformation: any[];
    public paymentAccount: any[];
    constructor(prop) {
        Object.assign(this, prop);
    }
}
