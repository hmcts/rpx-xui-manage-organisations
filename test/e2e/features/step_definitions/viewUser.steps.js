let ViewUserPage = require('../pageObjects/viewUserPage.js');
const headerPage = require('../pageObjects/headerPage');
const loginPage = require('../pageObjects/loginLogoutObjects');

const { AMAZING_DELAY, SHORT_DELAY, MID_DELAY, LONG_DELAY } = require('../../support/constants');
const config = require('../../config/conf.js');
const EC = protractor.ExpectedConditions;


var {defineSupportCode} = require('cucumber');

defineSupportCode(function ({And, But, Given, Then, When}) {
  let viewUserPage = new ViewUserPage();

  When(/^I click on user button$/, async function () {
    browser.sleep(AMAZING_DELAY);
    await headerPage.clickUser();
  });

  Then(/^I should be on display the user details$/, async function () {
    browser.sleep(LONG_DELAY);
    expect(await new ViewUserPage().amOnPage()).to.be.true;

  });
});
