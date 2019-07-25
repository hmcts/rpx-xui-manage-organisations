let ViewUserPage = require('../pageObjects/viewUserPage.js');
const headerPage = require('../pageObjects/headerPage');
const loginPage = require('../pageObjects/loginLogoutObjects');
const { defineSupportCode } = require('cucumber');
const { AMAZING_DELAY, SHORT_DELAY, MID_DELAY, LONG_DELAY } = require('../../support/constants');
const config = require('../../config/conf.js');
const EC = protractor.ExpectedConditions;

async function waitForElement(el) {
  await browser.wait(result => {
    return element(by.className(el)).isPresent();
  }, 600000);
}
defineSupportCode(function ({And, But, Given, Then, When}) {
  //let viewUserPage = new ViewUserPage();

  When(/^I click on user button$/, async function () {
    await headerPage.clickUser();

  });
  Then(/^I should be on display the user details$/, async function () {
    expect(await new ViewUserPage().amOnPage()).to.be.true;

  });
});
