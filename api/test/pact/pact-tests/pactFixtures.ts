import { PaymentAccountDto } from '../../../lib/models/transactions';

/**
 *
 * A Utility Class that holds all Request and Responses that get used in the pact-tests .
 * Request usually represent the body.Request and Responses are those that are returned from the downstream call.
 * @see
 * http://rd-professional-api-aat.service.core-compute-aat.internal/swagger-ui.html#
 * for Swagger docs [VPN + FOXY PROXY 'On']
 *
 */

export interface OrganisationCreationRequest {
    name: string;
    status: string;
    sraId: string;
    paymentAccount: PaymentAccountDto[];
    superUser: UserCreationRequest;
}

export interface UserCreationRequest {
    firstName: string;
    lastName: string;
}

export interface UserProfileModel {
    orgId: string;
    userId: string;
    email: string;
    rolesAdd: Roles[];
    rolesDelete: Roles[];
}

export interface Roles {
    name: string;
}

export const organisationRequestBody = {
    name: 'firstname',
    paymentAccount: [],
    sraId: 'sraId',
    status: 'status',
    superUser: {
        firstName: 'Joe',
        lastName: 'Bloggs',
    },
};

export interface OrganisationCreationDto {
    name: string;
    paymentAccount: string[];
    sraId: string;
    status: string;
    superUser: UserCreationRequest;
}

export interface ContactInformation {
    addressLine1: string;
    addressLine2: string;
    country: string;
    postCode: string;
}

export interface NewUser {
    email: string;
    firstName: string;
    lastName: string;
    jurisdictions: [
        {
            id: string
        }
    ];
    resendInvite: boolean;
    roles: [string];
    sraId: string;
    status: string;
}

export interface SuperUser {
    firstName: string;
    lastName: string;
}

export interface Organisation {
    companyNumber: string;
    companyUrl: string;
    contactInformation: [ContactInformation];
    name: string;
    organisationIdentifier: string;
    sraId: string;
    sraRegulated: boolean;
    status: string;
    superUser: SuperUser;
}

export interface SuspendUserReponseDto {
    roleAdditionResponse?: {
        idamMessage: string
        idamStatusCode: string
    };
    roleDeletionResponse?: [
        {
            idamMessage: string
            idamStatusCode: string
            roleName: string
        }
    ];
    statusUpdateResponse?: {
        idamMessage: string
        idamStatusCode: string
    };
}

export interface EditUserPermissionsDto {
    roleAdditionResponse?: {
        idamMessage: string
        idamStatusCode: string
    };
    roleDeletionResponse?: [
        {
            idamMessage: string
            idamStatusCode: string
            roleName: string
        }
    ];
    statusUpdateResponse?: {
        idamMessage: string
        idamStatusCode: string
    };
}

export interface NewUserCreationResponse {
    idamStatus?: string;
    userIdentifier?: string;
}

export interface InviteUserResponse {
    idamStatus?: string;
    userIdentifier?: string;
}

export interface OrganisationCreatedResponse {
    organisationIdentifier: string;
}
