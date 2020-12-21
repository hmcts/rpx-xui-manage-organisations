import { generateAPIRequest } from './utils';
const should = require('chai').should()

suite('API/CASES2 -> Get Organisation User details', function() {
  this.timeout(50000);
  test('GET Manage Organisation User details', () => generateAPIRequest ('GET', 'api/userDetails')
     // console.log('response', response.headers.get('cache-control'))
        .then(response => {
           response.status.should.be.eql(200);
           console.log(response.data.users[0].email);
           // response.data.users[14].userIdentifier.should.be.eql('fb25e17b-2456-4ce0-909d-071b68d10d59');
           response.data.users[0].firstName.should.be.eql('Vamshi');
           response.data.users[0].lastName.should.be.eql('Muniganti');
           // response.data.users[0].email.should.be.eql('xuiapitestuser@mailnesia.com');
           response.data.users[0].idamStatus.should.be.eql('PENDING');
        }));
});
