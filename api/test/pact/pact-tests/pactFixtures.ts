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

export interface RoleResponse {
  idamMessage: string;
  idamStatusCode: string;
}

export interface RoleDeletionResponse extends RoleResponse {
  roleName: string;
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

export const organisationRequestBody: object = {
  name: 'firstname',
  status: 'status',
  sraId: 'sraId',
  paymentAccount: [],
  superUser: {
    firstName: 'Joe',
    lastName: 'Bloggs'
  }
};

export interface OrganisationCreationDto {
  name: string;
  status: string;
  sraId: string;
  paymentAccount: string[];
  superUser: UserCreationRequest;
}

export interface ContactInformation {
  addressLine1: string;
  addressLine2: string;
  country: string;
  postCode: string;
}

export interface NewUser {
  firstName: string;
  status: string;
  sraId: string;
  lastName: string;
  email: string;
  roles: string[];
  jurisdictions: { id: string }[];
  resendInvite: boolean;
}

export interface SuperUser {
  firstName: string;
  lastName: string;
}

export interface Organisation {
  companyNumber: string;
  companyUrl: string;
  name: string;
  organisationIdentifier: string;
  sraId: string;
  sraRegulated: boolean;
  status: string;
  contactInformation: ContactInformation[];
  superUser: SuperUser;
}

export interface OrganisationWithUsers {
  organisationIdentifier: string,
  organisationStatus: string,
  organisationProfileIds: string[],
  users: [
    {
      userIdentifier: string,
      firstName: string,
      lastName: string,
      email: string,
      idamStatus: string,
      roles: string[];
      idamStatusCode: string,
      idamMessage: string,
      lastUpdated: string,
      userAccessTypes: UserAccessType[]
    }
  ]
}

export interface UserAccessType {
      jurisdictionId: string,
      organisationProfileId: string,
      accessTypeId: string,
      enabled: boolean
}

export interface SuspendUserReponseDto {
  roleAdditionResponse?: RoleResponse;
  roleDeletionResponse?: RoleDeletionResponse[];
  statusUpdateResponse?: RoleResponse;
}

export interface EditUserPermissionsDto {
  roleAdditionResponse?: RoleResponse;
  roleDeletionResponse?: RoleDeletionResponse[];
  statusUpdateResponse?: RoleResponse;
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
