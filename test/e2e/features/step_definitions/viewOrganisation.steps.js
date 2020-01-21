let ViewOrganisationPage = require('../pageObjects/viewOrganisationPage.js');
const headerPage = require('../pageObjects/headerPage');
const loginPage = require('../pageObjects/loginLogoutObjects');
const { AMAZING_DELAY, SHORT_DELAY, MID_DELAY, LONG_DELAY } = require('../../support/constants');
const EC = protractor.ExpectedConditions;

var {defineSupportCode} = require('cucumber');

defineSupportCode(function ({And, But, Given, Then, When}) {
  let viewOrganisationPage=new ViewOrganisationPage();

  When(/^I click on organisation button$/, async function () {
    browser.sleep(LONG_DELAY);
    await headerPage.clickOrganisation();
  });

  Then('I should be on display the name and address details of organisation', async function () {
    // browser.sleep(LONG_DELAY);
    
    expect(await viewOrganisationPage.amOnPage()).to.be.true;
  });

});
