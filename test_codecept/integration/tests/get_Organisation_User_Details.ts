import { generateAPIRequest } from './utils';
const should = require('chai').should();

suite('Manage Org -> Get Organisation User details', function() {
  this.timeout(50000);
  test('GET Manage Organisation User details', () => generateAPIRequest('GET', '/api/allUserList')
 
    // console.log('response', response.headers.get('cache-control'))
    .then((response) => {
      response.status.should.be.eql(200);
      const user = response.data.users.filter((idamUser) => idamUser.email ==='probate.aat.manage.org2@gmail.com');
      user[0].lastName.should.be.eql('Org2');
      user[0].firstName.should.be.eql('Probate');
      user[0].idamStatus.should.be.eql('ACTIVE');
    }));
});
