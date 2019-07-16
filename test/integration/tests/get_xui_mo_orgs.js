const { generateAPIRequest } = require('./utils/generateAPI');

suite('API/CASES -> JUI cases -> simple GET-s', function() {
    this.timeout(10000);
    test('GET XUI MO Organisations: (/cases)', () => generateAPIRequest('GET', '/v1/organisations', {})
        .then(response => {
            response.statusCode.should.be.eql(200);
            response.body.should.have.property('results').which.is.Array();
        }));
});
