/*const { generateAPIRequest } = require('./utils/generateAPI');
const getCookie = require('./utils/getToken.js');*/

import { generateAPIRequest } from './utils';

suite('API/CASES -> Get Token', () => {
  let cookie = ''
  // getCookie.getOauth2Token().then(function (token) {
  //     cookie = token;
  // });
  // console.log(cookie)
    // this.timeout(10000);
    test('GET XUI Organisation column details', async () => {
      const response = await generateAPIRequest('GET', '/v1/organisations?status=ACTIVE', {});
      console.log(response);
    });
        /*.then(response => {
            response.statusCode.should.be.eql(200);
            // response.body.should.have.property('columns').which.is.Array();
            // response.body.columns[0].label.should.be.eql('Case Reference');
            // response.body.columns[1].label.should.be.eql('Parties');
            // response.body.columns[2].label.should.be.eql('Type');
            // response.body.columns[3].label.should.be.eql('Decision needed on');
            // response.body.columns[4].label.should.be.eql('Case received');
            // response.body.columns[5].label.should.be.eql('Date of last event');
        }));*/
});
