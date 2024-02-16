import { generateAPIRequest } from './utils';
const should = require('chai').should();

suite('Manage Org -> Get Organisation User details', function() {
  this.timeout(50000);
  test('GET Manage Organisation User details', () => generateAPIRequest('GET', '/api/allUserList')
 
    // console.log('response', response.headers.get('cache-control'))
    .then((response) => {
      response.status.should.be.eql(200);
      const user = response.data.users.findIndex((idamUser) => idamUser.email ==='probate.aat.manage.org2@gmail.com');
      response.data.users[user].lastName.should.be.eql('Org2');
      response.data.users[user].firstName.should.be.eql('Probate');
      response.data.users[user].idamStatus.should.be.eql('ACTIVE');
    }));
});
