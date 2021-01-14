import { generateregPOSTAPIRequest } from './utils';
const should = require('chai').should();

suite('Register Org -> POST Register Organisation', function() {
  this.timeout(50000);

  const payload = {
  fromValues :
    {
      haveDXNumber: 'dontHaveDX',
      orgName: `API Test Org ${Math.round(Math.random() * 10000)}`,
      createButton : 'Continue',
      officeAddressOne: 'The Lodge Cafe',
      officeAddressTwo: '149 Piccadilly',
      townOrCity: 'London',
      county: null,
      postcode: 'W1J 7NT',
      PBAnumber1: null,
      PBAnumber2: null,
      haveDx: 'no',
      haveSra: 'no',
      firstName: 'Vam',
      lastName: 'Mun',
      emailAddress: `apitestorg${Math.round(Math.random() * 10000)}@mailnesia.com`,
      jurisdictions: [ {id : 'SSCS'}, {id: 'AUTOTEST1'}, {id: 'DIVORCE'}, {id: 'PROBATE'}, {id: 'PUBLICLAW'}, {id: 'bulkscan'}, {id: 'BULKSCAN'}, {id: 'IA'}, {id: 'EMPLOYMENT'}, {id: 'CMC'}]
    },
      event: 'continue' };

      test('POST Invite User', () => generateregPOSTAPIRequest ('POST', '/external/register-org/register', payload)
     // console.log('response', response.headers.get('cache-control'))
        .then(response => {
           response.status.should.be.eql(200);
           console.log(response);
        }));
});
