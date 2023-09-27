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

export type RegistrationData = {
    companyName: string;
    companyHouseNumber?: string;
    hasDxReference: boolean;
    dxNumber?: string;
    dxExchange?: string;
    services: string[];
    otherServices?: string;
    hasPBA: boolean;
    contactDetails: ContactDetails;
    address: AddressModel;
    organisationType: string;
    otherOrganisationType?: string;
    otherOrganisationDetail?: string;
    regulatorRegisteredWith: string;
    inInternationalMode: boolean;
    regulators: Regulator[];
    hasIndividualRegisteredWithRegulator: boolean;
    individualRegulators?: Regulator[];
    pbaNumbers: string[];
}
