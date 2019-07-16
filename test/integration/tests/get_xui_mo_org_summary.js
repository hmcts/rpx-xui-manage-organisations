const { generateAPIRequest } = require('./utils/generateAPI');

let url;

suite('API/CASES -> XUI Organisation Details', function() {
    this.timeout(10000);
    test('GET XUI Org User details: (/cases)', () => generateAPIRequest('GET', '/api/cases', {})
        .then(response => {
            response.statusCode.should.be.eql(200);
            response.body.should.have.property('columns').which.is.Array();
            const myVar = response.body.results[0].case_id;
            //url = `/api/case/DIVORCE/FinancialRemedyMVP2/${myVar}`;
            console.log(url);
        }));

    test('GET JUI case  details: (/cases)', () => generateAPIRequest('GET', url, {})
        .then(response => {
            response.statusCode.should.be.eql(200);
            response.body.should.have.property('sections').which.is.Array();
            response.body.sections[0].name.should.be.eql('Summary');
        }));
});
