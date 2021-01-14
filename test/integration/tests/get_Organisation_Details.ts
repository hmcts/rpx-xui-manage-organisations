import { generateAPIRequest } from './utils';
const should = require('chai').should()

suite('Manage Org -> Get Organisation details', function() {
  this.timeout(50000);
  test('GET Manage Organisation details', () => generateAPIRequest ('GET', '/api/organisation')
     // console.log('response', response.headers.get('cache-control'))
        .then(response => {
          response.status.should.be.eql(200);
          console.log(response.data.organisationIdentifier);
          response.data.organisationIdentifier.should.be.eql('CIOWLIC');
          response.data.name.should.be.eql('xuiapiorganisation');
          response.data.status.should.be.eql('ACTIVE');
          response.data.sraId.should.be.eql('SRA34367744334');
          response.data.sraRegulated.should.be.eql(false);
          response.data.paymentAccount[0].should.be.eql('PBA4677332');
          response.data.paymentAccount[1].should.be.eql('PBA7853435');
          response.data.contactInformation[0].addressLine1.should.be.eql('2');
          response.data.contactInformation[0].addressLine2.should.be.eql('Leman Street');
          response.data.contactInformation[0].townCity.should.be.eql('Aldgate');
          response.data.contactInformation[0].dxAddress[0].dxNumber.should.be.eql('DX8235563323');
          response.data.contactInformation[0].dxAddress[0].dxExchange.should.be.eql('DX London');
        }));
});
