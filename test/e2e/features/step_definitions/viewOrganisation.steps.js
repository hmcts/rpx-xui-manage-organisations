let ViewOrganisationPage = require('../pageObjects/viewOrganisationPage.js');
const headerPage = require('../pageObjects/headerPage');
const loginPage = require('../pageObjects/loginLogoutObjects');
const { AMAZING_DELAY, SHORT_DELAY, MID_DELAY, LONG_DELAY } = require('../../support/constants');
const EC = protractor.ExpectedConditions;
const browserWaits = require('../../support/customWaits');

var {defineSupportCode} = require('cucumber');

defineSupportCode(function ({And, But, Given, Then, When}) {
  let viewOrganisationPage=new ViewOrganisationPage();

  When(/^I click on organisation button$/, { timeout: 600 * 1000 } ,async function () {
    await headerPage.clickOrganisation();

    await browserWaits.retryWithAction(viewOrganisationPage.header, async function (message) {
      world.attach("Retrying Click Organisation  : " + message);
      await headerPage.clickOrganisation();
    });
  });

  Then(/^I should be on display the name and address details of organisation$/, { timeout: 600 * 1000 } ,async function () {
    // browser.sleep(LONG_DELAY);
    const world = this;
 
    await browserWaits.retryWithAction(viewOrganisationPage.header, async function (message) {
      world.attach("Retrying Click Organisation  : " + message);
      await headerPage.clickOrganisation();
    });
    expect(await viewOrganisationPage.amOnPage()).to.be.true;
  });

  Then(/^I should see name and address details of Organisation$/, async function () {
    // browser.sleep(LONG_DELAY);
    const world = this;

    await browserWaits.retryWithAction(viewOrganisationPage.header, async function (message) {
      world.attach("Retrying Click Organisation  : " + message);
      await headerPage.clickOrganisation();
    });
    expect(await viewOrganisationPage.amOnPage()).to.be.true;
  })

});
