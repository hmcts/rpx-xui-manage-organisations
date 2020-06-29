import { generatePOSTAPIRequest } from './utils';
const should = require('chai').should()

suite('API/CASES3 -> POST Invite User', function() {
  this.timeout(50000);
  const payload = {
    firstName: 'Vamshi',
    lastName: 'Muniganti',
    email: `vam.mun${Math.round(Math.random() * 10000)}@mailnesia.com`,
    roles: [
    'pui-user-manager'
  ],
    jurisdictions: [
    {
      id: 'Probate'
    }
  ],
    resendInvite: false
  };
  test('POST Invite User', () => generatePOSTAPIRequest ('POST', '/refdata/external/v1/organisations/users/', payload)
     // console.log('response', response.headers.get('cache-control'))
        .then(response => {
           response.status.should.be.eql(201);
           console.log(response);
        }));
});
