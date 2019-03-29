import {UserInterface} from '../models/user.model';
export const userMock: UserInterface = {
  id: '12313',
  emailId: 'example@example.com',
  firstName: 'James',
  lastName: 'Doe',
  status: 'active',
  organisationId: 'A2BASDASD',
  pbaAccount: 'A12312312',
  addresses: [
    {
    id: 'A123123sdas',
    houseNoBuildingName: 'Something Seomthing',
    addressLine1: 'Something Seomthing',
    addressLine2: 'Something Seomthing',
    townCity: 'Something Seomthing',
    county: 'Something Seomthing',
    country: 'Something Seomthing',
    postcode: 'Something Seomthing',
    userId: 'Something Seomthing',
  }
  ]
}
