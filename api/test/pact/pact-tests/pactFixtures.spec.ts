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

export const organisationRequestBody: OrganisationCreationRequest = {
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

