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


    it('Unassigned Cases', async function () {
        await MockApp.startServer();
        const actions = [];
        actions.push(...PallyActions.navigateTourl(conf.baseUrl + 'unassigned-cases'));
        actions.push(...PallyActions.waitForPageWithCssLocator('app-unassigned-cases-component'));
        await pa11ytest(this, actions);
    });


    it('Unassigned Cases Share a case', async function () {
        await MockApp.startServer();
        const actions = [];
        actions.push(...PallyActions.navigateTourl(conf.baseUrl + 'unassigned-cases/case-share'));
        actions.push(...PallyActions.waitForPageWithCssLocator('xuilib-share-case'));
        await pa11ytest(this, actions);
    });


    it('Share Case Confirm Page', async function () {
        await MockApp.startServer();

        const actions = [];
        actions.push(...PallyActions.navigateTourl(conf.baseUrl + 'unassigned-cases/case-share'));
        actions.push(...PallyActions.waitForPageWithCssLocator('exui-case-share'));
        actions.push(...PallyActions.clickElement('.govuk-accordion__controls button'));
        actions.push(...PallyActions.clickElement('tr td a'));
        actions.push(...PallyActions.clickElement('#share-case-nav button'));
        actions.push(...PallyActions.waitForPageWithCssLocator('xuilib-share-case-confirm'));

        const result = await pa11ytest(this, actions);
    });


});


