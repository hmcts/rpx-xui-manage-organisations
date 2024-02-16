import { generateAPIRequest } from './utils';
const should = require('chai').should();

suite('Manage Org -> Get Organisation User details', function() {
  this.timeout(50000);
  test('GET Manage Organisation User details', () => generateAPIRequest('GET', '/api/allUserList')
  // console.log('response', response.headers.get('cache-control'))
    .then((response) => {
      response.status.should.be.eql(200);
      const user = response.data.users.findIndex((idamUser) => idamUser.email ==='xuiapitestuser@mailnesia.com');
      response.data.users[user].lastName.should.be.eql('Lee');
      response.data.users[user].firstName.should.be.eql('Jason');
      response.data.users[user].idamStatus.should.be.eql('ACTIVE');
    }));
});
