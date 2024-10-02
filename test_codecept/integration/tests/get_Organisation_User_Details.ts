import { generateAPIRequest } from './utils';
const should = require('chai').should();

suite('Manage Org -> Get Organisation User details', function() {
  this.timeout(50000);
  test('GET Manage Organisation User details', () => generateAPIRequest('GET', '/api/allUserList')
 
    // console.log('response', response.headers.get('cache-control'))
    .then((response) => {
      response.status.should.be.eql(500);
      const user = response.data.users.filter((idamUser) => idamUser.email ==='xuiapiorganisation@mailnesia.com');
      user[0].lastName.should.be.eql('Lee');
      user[0].firstName.should.be.eql('Jason');
      user[0].idamStatus.should.be.eql('ACTIVE');
    }));
});
