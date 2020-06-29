process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
import * as Mocha from 'mocha';
import {config} from '../../../api/lib/config';
import * as tunnel from '../../../api/lib/tunnel';

if (config.proxy) {
  tunnel.init();
}

const mocha = new Mocha({
     ui: 'tdd',
    // reporter: 'spec',
   // bail: 'yes',
    reporter: 'mochawesome',
    reporterOptions: {
        reportDir: 'reports/tests/api_functional/',
        reportName: 'XUI_MO_Integration_tests'
    }
});

mocha.addFile('test/integration/tests/get_Organisation_Details.ts');
mocha.addFile('test/integration/tests/get_Organisation_User_Details.ts');
mocha.addFile('test/integration/tests/post_Invite_User.ts');
mocha.run( (failures) => {
    process.exitCode = failures ? 1 : 0; // exit with non-zero status if there were failures
});
