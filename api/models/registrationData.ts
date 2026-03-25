import { AddressModel } from '@hmcts/rpx-xui-common-lib';

export interface ContactDetails {
    firstName: string;
    lastName: string;
    workEmailAddress: string;
}

export interface Regulator {
    regulatorType: string;
    regulatorName?: string;
    organisationRegistrationNumber?: string;
}

export interface OrganisationType {
  key: string;
  description: string;
}

export type RegistrationData = {
    companyName: string;
    companyHouseNumber?: string;
    hasDxReference: boolean;
    dxNumber?: string;
    dxExchange?: string;
    services: {key: string, value: string}[];
    otherServices?: string;
    hasPBA: boolean;
    contactDetails: ContactDetails;
    address: AddressModel;
    organisationType: OrganisationType;
    otherOrganisationType?: OrganisationType;
    otherOrganisationDetail?: string;
    regulatorRegisteredWith: string;
    inInternationalMode: boolean;
    regulators: Regulator[];
    hasIndividualRegisteredWithRegulator: boolean;
    individualRegulators?: Regulator[];
    pbaNumbers: string[];
    sraRegulated?: boolean;
}

export type RegistrationRequest = {
    name: string,
    status?: string,
    statusMessage?: string,
    sraId?: string,
    sraRegulated?: boolean,
    companyNumber?: string,
    companyUrl?: string,
    superUser: {
      firstName: string,
      lastName: string,
      email: string
    },
    paymentAccount: string [],
    contactInformation: [
      {
        uprn?: string,
        addressLine1: string,
        addressLine2: string,
        addressLine3: string,
        townCity: string,
        county: string,
        country: string,
        postCode: string,
        dxAddress?: [
          {
            dxNumber: string,
            dxExchange: string
          }
        ]
      }
    ],
    orgType: string,
    orgAttributes?: {key: string, value: string}[]
}
