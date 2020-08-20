;

const AppActions = require('../helpers/applicationActions');
const PallyActions = require('../helpers/pallyActions');

const assert = require('assert');
const { pa11ytest, getResults } = require('../helpers/pa11yUtil');
const html = require('pa11y-reporter-html');

const {conf} = require('../config/config');

const MockApp = require('../../nodeMock/app');

describe('Pa11y tests', function () {
    beforeEach(function(){
        MockApp.init()
    });
      afterEach(async function (done) {
        await MockApp.stopServer(); 
        done();
     });

    conf.unauthenticatedUrls.forEach(  (pageUrl) => {
        it('Registration page url ' + pageUrl, async function () {

            await MockApp.startServer();
            const actions = [];
            actions.push(...PallyActions.navigateTourl(conf.baseUrl + pageUrl));
            actions.push(...PallyActions.waitForPageWithCssLocator('#content'));
            await pa11ytest(this, actions);
        });

    });


});


