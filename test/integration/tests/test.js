const Mocha = require('mocha');

const mocha = new Mocha({
    ui: 'tdd',
    // reporter: 'spec',
    bail: 'yes',
    reporter: 'mochawesome',
    reporterOptions: {
        reportDir: 'reports/tests/api_functional/',
        reportName: 'XUI_MO_Integration_tests'
    }
});

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
mocha.addFile('test/integration/tests/get_token.js');
// mocha.addFile('test/integration/tests/get_jui_cases.js');
// mocha.addFile('test/integration/tests/get_jui_case_details.js');
// mocha.addFile('test/integration/tests/get_jui_case_fields.js');
// mocha.addFile('test/integration/tests/get_jui_case_summary.js');
mocha.run();
