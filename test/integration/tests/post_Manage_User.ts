import { generatePOSTAPIRequest } from './utils';
const should = require('chai').should();

suite('Manage Org -> POST Manage User', function() {
  this.timeout(50000);
  const payload = {
    orgIdsPayload: ['SOLICITOR_PROFILE'],
    userPayload: {
      email: 'xuiapiorganisation@mailnesia.com',
      firstName: 'Jason',
      lastName: 'Lee',
      idamStatus: 'Active',
      idamStatusCode: 'A',
      roles: ['pui-case-manager', 'pui-user-manager', 'pui-caa'],
      id: 'b5a4ad13-4e6a-4b1b-9c41-29ed273744a3',
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
      ] }
  };

  test('POST Manage User', () => generatePOSTAPIRequest('PUT', `/api/ogd-flow/update/${payload.userPayload.id}`, payload)
  // console.log('response', response.headers.get('cache-control'))
    .then((response) => {
      console.log('RESPONSE: ', response);
      response.status.should.be.eql(200);
    }));
});