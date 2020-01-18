let ViewUserPage = require('../pageObjects/viewUserPage.js');
let HeaderPage = require('../pageObjects/headerPage');
const loginPage = require('../pageObjects/loginLogoutObjects');

const { AMAZING_DELAY, SHORT_DELAY, MID_DELAY, LONG_DELAY } = require('../../support/constants');
const config = require('../../config/conf.js');
const EC = protractor.ExpectedConditions;

var {defineSupportCode} = require('cucumber');

defineSupportCode(function ({And, But, Given, Then, When}) {
  let viewUserPage = new ViewUserPage();
  let headerPage = new HeaderPage();

  When(/^I click on user button$/, async function () {
    // browser.sleep(LONG_DELAY);
    await headerPage.clickUser();
    await viewUserPage.amOnPage(); 

    // browser.sleep(AMAZING_DELAY);
  });

  Then(/^I should be on display the user details$/, async function () {
    // browser.sleep(AMAZING_DELAY);
    expect(await viewUserPage.amOnPage()).to.be.true;
    // browser.sleep(LONG_DELAY);
  });

  Then("I should see invited user is listed in users table", async function () {
    await viewUserPage.validateUserWithEmailListed(global.latestInvitedUser);
  });

  Then("I should see all user details displayed in table", async function () {
    await viewUserPage.validateUsersTableDisplaysAllDetails();
  });

});
