export interface OrganisationPayload {
    name: string,
    companyUrl?: string,
    companyNumber: string,
    sraRegulated: boolean,
  sraId: string,
    superUser: {
        firstName: string,
        lastName: string,
        email: string,
    }
    pbaAccounts: [
          {
            pbaAccounts: string,
            pbaNumber: string,
          }
        ],

    contactInformation: [{
        addressLine1: string,
        addressLine2?: string,
        addressLine3?: string,
        townCity: string,
        county: string,
        country: string,
        postcode: string,
        dxAddress?: [
          {
            dxExchange: string,
            dxNumber: string,
          }
        ],
    }]
}
