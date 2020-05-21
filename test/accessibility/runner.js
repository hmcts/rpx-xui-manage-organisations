const Mocha = require('mocha');


const mocha = new Mocha({
    ui: 'tdd',
    // reporter: 'spec',
    // bail: 'yes',
    reporter: 'mochawesome',
    reporterOptions: {
        reportDir: 'reports/tests/pally_tests/',
        reportName: 'XUI_MO_pally_tests'
    }
});

mocha.addFile('test/accessibility/tests/index.js');
// mocha.addFile('test/integration/tests/get_Organisation_User_Details.ts');
// mocha.addFile('test/integration/tests/get_jui_cases.js');
// mocha.addFile('test/integration/tests/get_jui_case_details.js');
// mocha.addFile('test/integration/tests/get_jui_case_fields.js');
// mocha.addFile('test/integration/tests/get_jui_case_summary.js');
mocha.run((failures) => {
    process.exitCode = failures ? 1 : 0; // exit with non-zero status if there were failures
});
