import {PaymentAccountDto} from '../../../lib/models/transactions';

export interface OrganisationCreationRequest{
  name: string
  status: string
  sraId: string
  paymentAccount: string[]
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

const organisationRequestBody: OrganisationCreationRequest = {
  name:'firstname',
  status:'status',
  sraId:'sraId',
  paymentAccount:['pay1','pay2'],
  superUser:null
}
