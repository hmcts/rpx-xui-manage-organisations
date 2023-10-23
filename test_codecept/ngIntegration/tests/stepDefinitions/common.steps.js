
const browserUtil = require('../../util/browserUtil');
// const nodeAppMockData = require('../../../nodeMock/nodeApp/mockData');
const CucumberReporter = require('../../../codeceptCommon/reportLogger');
const BrowserWaits = require('../../../e2e/support/customWaits');
const headerpage = require('../../../e2e/features/pageObjects/headerPage');


// const ccdApi = require('../../../nodeMock/ccd/ccdApi');


    Then('I validate session storage has key {string}', async function(key){
        await BrowserWaits.retryWithActionCallback(async () => {
            const sessionStorageVal = await browserUtil.getFromSessionStorage(key);
            expect(sessionStorageVal !== null && sessionStorageVal !== undefined, `Session stoarge does not have ${key} key ${sessionStorageVal}`).to.be.true;
        });
        
    });

