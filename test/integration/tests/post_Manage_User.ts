import { generatePOSTAPIRequest } from './utils';
const should = require('chai').should();

suite('Manage Org -> POST Manage User', function() {
  this.timeout(50000);
  const payload = {
    email: 'john_AT@doe.com',
    firstName: 'John',
    lastName: 'Doe',
    idamStatus: 'Active',
    idamStatusCode: 'A',
    roles: ['pui-case-manager', 'pui-user-manager', 'pui-caa'],
    id: '123',
    userAccessTypes: [
      {
        accessTypeId: '10',
        jurisdictionId: '6',
        organisationProfileId: 'SOLICITOR_PROFILE',
        enabled: true
      },
      {
        accessTypeId: '101',
        jurisdictionId: '6',
        organisationProfileId: 'SOLICITOR_PROFILE',
        enabled: false
      }
    ]
  };

  test('POST Manage User', () => generatePOSTAPIRequest('PUT', `/api/editUserPermissions/users/${payload.id}`, payload)
  // console.log('response', response.headers.get('cache-control'))
    .then((response) => {
      response.status.should.be.eql(200);
      console.log(response);
    }));
});
