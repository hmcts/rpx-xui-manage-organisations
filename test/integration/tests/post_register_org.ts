import { generateregPOSTAPIRequest } from './utils';
const should = require('chai').should();

suite('API/CASES3 -> POST Register Organisation', function() {
  this.timeout(50000);

  const payload = {
      name: 'Test org5',
      status: 'PENDING',
      sraId: 'SRA43667774334',
      contactInformation: [{
        addressLine1: 'The Lodge Cafe', addressLine2: '149 Piccadilly', townCity: 'London', county: null,
        dxAddress: [{dxNumber: 'DX345667777', dxExchange: 'DX London'}]
      }],
      superUser: { firstName: 'VAMSHI apitest3',
        lastName: 'VAMSHI apitest3',
        email: `apitestorg${Math.round(Math.random() * 10000)}@mailnesia.com`},
      jurisdictions: [
          {
            id: 'Probate'
          }],
      paymentAccount: ['PBA8573395', 'PBA4566666']
    };
  test('POST Invite User', () => generateregPOSTAPIRequest ('POST', 'api/register-org', payload)
     // console.log('response', response.headers.get('cache-control'))
        .then(response => {
           response.status.should.be.eql(200);
           console.log(response);
        }));
});
