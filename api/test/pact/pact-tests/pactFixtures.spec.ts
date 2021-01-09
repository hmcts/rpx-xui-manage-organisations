import {pbaNumber} from '../../../../src/register/constants/pbaNumber';
import {PaymentAccountDto} from '../../../lib/models/transactions';

export interface OrganisationCreationRequest{
  name: string
  status: string
  sraId: string
  paymentAccount: PaymentAccountDto[]
  superUser: UserCreationRequest
}

export interface UserCreationRequest{
  firstName: string
  lastName: string
}

const responsePaymentAccountDto: PaymentAccountDto[] = [
  {
    pbaNumber:	'XDDDDDoDDDD',
    organisationId:	'B123456',
    userId:	'A123123'
  }
]

export interface UserProfileModel {
  orgId: string
  userId: string
  email: string
  rolesAdd: Roles[]
  rolesDelete: Roles[]

}
export interface Roles{
     name:string;
}

export const organisationRequestBody: Object = {
  name:'firstname',
  status:'status',
  sraId:'sraId',
  paymentAccount:[],
  superUser: {
    firstName: 'Joe',
    lastName: 'Bloggs'
  }
}

export interface organisationCreationDto{
  name: string
  status: string
  sraId: string
  paymentAccount: string[]
  superUser: UserCreationRequest

}

export interface contactInformation{
  companyNumber: string
  companyUrl: string
  name: string
  organisationIdentifier: string
}

export interface newUser {
  firstName: string,
  status: string,
  sraId: string;
  lastName: string,
  email: string,
  roles: [
    string
  ],
  jurisdictions: [
  {
      id: string
  }
  ],
  resendInvite: boolean
}




export interface superUser {
  firstName: string,
  lastName: string
}

export interface organisation {
  companyNumber: string,
  companyUrl: string,
  name: string,
  organisationIdentifier: string,
  sraId: string,
  sraRegulated: boolean,
  status: string,
  contactInformation: contactInformation
  superUser: superUser
}



export interface SuspendUserReponseDto{
  roleAdditionResponse?: {
    idamMessage: string,
    idamStatusCode: string
  },
  roleDeletionResponse?: [
    {
      idamMessage: string,
      idamStatusCode: string,
      roleName: string
    }
  ],
  statusUpdateResponse?: {
    idamMessage: string,
    idamStatusCode: string
  }
}


export interface EditUserPermissionsDto{
  roleAdditionResponse?: {
    idamMessage: string,
    idamStatusCode: string
  },
  roleDeletionResponse?: [
    {
      idamMessage: string,
      idamStatusCode: string,
      roleName: string
    }
  ],
  statusUpdateResponse?: {
    idamMessage: string,
    idamStatusCode: string
  }
}

export interface NewUserCreationResponse{
  idamStatus?: string,
  userIdentifier?: string
}


export interface InviteUserResponse{
  idamStatus?: string,
  userIdentifier?: string
}

