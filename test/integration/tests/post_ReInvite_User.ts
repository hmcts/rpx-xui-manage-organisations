import {Error} from 'tslint/lib/error';
import { generatePOSTAPIRequest } from './utils';
const should = require('chai').should();

suite('Manage Org -> POST Re Invite User', function() {
  this.timeout(50000);

  const payload = {
    firstName: 'Vamshi',
    lastName: 'Muniganti',
    email: 'vam.mun1752@mailnesia.com',
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
    roles: ['pui-organisation-manager'],
    resendInvite: true,
  };
  test('POST Invite User', () => generatePOSTAPIRequest ('POST', '/api/inviteUser', payload)
     // console.log('response', response.headers.get('cache-control'))
        .then(response => {
          if (response.status === 429 ) {
          console.log(`User Already Invited: ${response.status}`);
           }
          if (response.status === 200 ) {
            console.log(`User Re Invited: ${response.status}`);
          }
          // if (response.status === 404 ) {
          //  throw new Error(console.log(`User doesn't exist: ${response.status}`));
          // }
        }));
});
