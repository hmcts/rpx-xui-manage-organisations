let viewOrganisationPage = require('../pageObjects/viewOrganisationPage.js');
const headerPage = require('../pageObjects/headerPage');
const loginPage = require('../pageObjects/loginLogoutObjects');
const { defineSupportCode } = require('cucumber');
const { AMAZING_DELAY, SHORT_DELAY, MID_DELAY, LONG_DELAY } = require('../../support/constants');
const config = require('../../config/conf.js');
const EC = protractor.ExpectedConditions;

defineSupportCode(function ({And, But, Given, Then, When}) {

  When(/^I click on organisation button$/, async function () {
    await headerPage.clickOrganisation();
  });

  Then(/^I should be on display the name and address details of organisation$/, async function () {
    expect(await new ViewOrganisationPage().amOnPage()).to.be.true;

  });
});
