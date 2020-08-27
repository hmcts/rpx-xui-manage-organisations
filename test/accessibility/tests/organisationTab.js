;

const AppActions = require('../helpers/applicationActions');
const PallyActions = require('../helpers/pallyActions');

const assert = require('assert');
const { pa11ytest, getResults } = require('../helpers/pa11yUtil');
const html = require('pa11y-reporter-html');

const { conf } = require('../config/config');

const MockApp = require('../../nodeMock/app');

describe('Pa11y tests', function () {
    beforeEach(function () {
        MockApp.init()
    });
    afterEach(async function (done) {
        await MockApp.stopServer();
        done();
    });

    it('Organisation page', async function () {
        await MockApp.startServer();
        const actions = [];
        actions.push(...PallyActions.navigateTourl(conf.baseUrl + 'organisation'));
        actions.push(...PallyActions.waitForPageWithCssLocator('app-prd-organisation-component'));
        await pa11ytest(this, actions);
    });

});


