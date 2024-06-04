const AppActions = require('../helpers/applicationActions');
const PallyActions = require('../helpers/pallyActions');

const assert = require('assert');
const { pa11ytest, getResults, initBrowser } = require('../helpers/pa11yUtil');
const html = require('pa11y-reporter-html');

const { conf } = require('../config/config');

// const MockApp = require('../../nodeMock/app');

describe('Pa11y tests', function () {
  beforeEach(function(){
    // MockApp.init();
  });
  afterEach(async function (done) {
    // await MockApp.stopServer();
    done();
  });

  conf.unauthenticatedUrls.forEach((pageUrl) => {
    it('Registration page url2 ' + pageUrl, async function () {
      await initBrowser();
      const actions = [];
      actions.push(...PallyActions.waitForPageWithCssLocator('#content'));
      actions.push(...PallyActions.navigateTourl(conf.baseUrl + pageUrl));
      actions.push(...PallyActions.waitForPageWithCssLocator('#content'));
      await pa11ytest(this, actions);
    });
  });

  it('Registration Check your Answers Page ', async function () {
    await initBrowser();
    // actions.push(...PallyActions.navigateTourl(conf.baseUrl + pageUrl));
    const actions = regitrationActions();
    await pa11ytest(this, actions);
  });

  it('Registration Success Page ', async function () {
    await initBrowser();
    // actions.push(...PallyActions.navigateTourl(conf.baseUrl + pageUrl));

    const actions = regitrationActions();
    actions.push(...PallyActions.clickElement('app-check-your-answers button'));
    actions.push(...PallyActions.waitForPageWithCssLocator('app-submitted-confirmation h2'));

    await pa11ytest(this, actions);
  });

  it.skip('Registration Error Page ', async function () {
   
    await initBrowserr();
    const actions = regitrationActions();
    actions.push(...PallyActions.clickElement('app-check-your-answers button'));
    actions.push(...PallyActions.waitForPageWithCssLocator('.govuk-error-summary'));
    await pa11ytest(this, actions);
  });

  function regitrationActions(){
    const createButtonLocator = '#createButton';
    const actions = [];
    actions.push(...PallyActions.waitForPageWithCssLocator('#content'));
    actions.push(...PallyActions.navigateTourl(conf.baseUrl + 'register-org/register/organisation-name'));
    actions.push(...PallyActions.waitForPageWithCssLocator('#content'));

    actions.push(...PallyActions.inputField('#orgName', 'Test Organisation'));
    actions.push(...PallyActions.clickElement(createButtonLocator));

    actions.push(...PallyActions.inputField('#officeAddressOne', 'test street officeAddressOne'));
    actions.push(...PallyActions.inputField('#officeAddressTwo', 'test street officeAddressTwo'));
    actions.push(...PallyActions.inputField('#townOrCity', 'test town'));
    actions.push(...PallyActions.inputField('#county', 'test county'));
    actions.push(...PallyActions.inputField('#postcode', 'PA1 1YY'));
    actions.push(...PallyActions.clickElement(createButtonLocator));

    actions.push(...PallyActions.inputField('#PBANumber1', 'PBA1234567'));

    actions.push(...PallyActions.clickElement(createButtonLocator));

    actions.push(...PallyActions.clickElement('#haveDxyes'));
    actions.push(...PallyActions.clickElement(createButtonLocator));

    actions.push(...PallyActions.inputField('#DXnumber', 'DX123456789'));
    actions.push(...PallyActions.inputField('#DXexchange', 'A11Y City'));
    actions.push(...PallyActions.clickElement(createButtonLocator));

    actions.push(...PallyActions.clickElement('#haveSrayes'));
    actions.push(...PallyActions.clickElement(createButtonLocator));

    actions.push(...PallyActions.inputField('#sraNumber', 'SRA12345678'));
    actions.push(...PallyActions.clickElement(createButtonLocator));

    actions.push(...PallyActions.inputField('#firstName', 'testfname'));
    actions.push(...PallyActions.inputField('#lastName', 'testlname'));
    actions.push(...PallyActions.clickElement(createButtonLocator));

    actions.push(...PallyActions.inputField('#emailAddress', 'test@test.com'));
    actions.push(...PallyActions.clickElement(createButtonLocator));

    actions.push(...PallyActions.waitForPageWithCssLocator('.govuk-check-your-answers'));
    return actions;
  }
});

