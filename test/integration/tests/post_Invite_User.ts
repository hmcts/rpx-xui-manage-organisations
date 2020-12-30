import { generatePOSTAPIRequest } from './utils';
const should = require('chai').should();

suite('API/CASES3 -> POST Invite User', function() {
  this.timeout(50000);
  const payload = {
    firstName: 'Vamshi',
    lastName: 'Muniganti',
    email: `vam.mun${Math.round(Math.random() * 10000)}@mailnesia.com`,
    roles: [
    'pui-organisation-manager'
  ],
    jurisdictions: [
      {id: 'SSCS'},
      {id: 'AUTOTEST1'},
      {id: 'DIVORCE'},
      {id: 'PROBATE'},
      {id: 'PUBLICLAW'},
      {id: 'bulkscan'},
      {id: 'BULKSCAN'},
      {id: 'IA'},
      {id: 'EMPLOYMENT'},
      {id: 'CMC'},
  ],
    resendInvite: false
  };


  test('POST Invite User', () => generatePOSTAPIRequest ('POST', '/api/inviteUser', payload)
     // console.log('response', response.headers.get('cache-control'))
        .then(response => {
           response.status.should.be.eql(200);
           console.log(response);
        }));
});
