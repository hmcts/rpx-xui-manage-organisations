
const AppActions = require('../helpers/applicationActions');
const PallyActions = require('../helpers/pallyActions');

const assert = require('assert');
const { pa11ytest, getResults, initBrowser } = require('../helpers/pa11yUtil');
const html = require('pa11y-reporter-html');

const { conf } = require('../config/config');

// const MockApp = require('../../nodeMock/app');
describe('Pa11y tests', function () {
  beforeEach(function () {
    // MockApp.init();
  });
  afterEach(async function (done) {
    // await MockApp.stopServer();
    done();
  });

  it('Unassigned Cases', async function () {
    await initBrowser();
    const actions = [];
    actions.push(...PallyActions.navigateTourl(conf.baseUrl ));

    actions.push(...PallyActions.clickElement('.hmcts-primary-navigation__item:nth-of-type(3) a'));
    actions.push(...PallyActions.waitForPageWithCssLocator('app-caa-cases-component'));
    await pa11ytest(this, actions);
  });
});

