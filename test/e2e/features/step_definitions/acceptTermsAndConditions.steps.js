const { Then, When } = require('@cucumber/cucumber');

const acceptTermsAndConditionsPage = require('../pageObjects/termsAndConditionsConfirmPage');
const HeaderPage = require('../pageObjects/headerPage');

const { config } = require('../../config/common.conf');
const browserWaits = require('../../support/customWaits');


const headerPage = new HeaderPage();
Then('I am on Accept Terms and Conditions page', async function () {
  const world = this;
  if (await acceptTermsAndConditionsPage.isFeatureToggleEnabled()){
    await browserWaits.waitForElement(acceptTermsAndConditionsPage.accepttermsAndConditionsContainer);
    expect(await acceptTermsAndConditionsPage.amOnPage()).to.be.true;
  } else {
    world.attach('Accept Terms and Conditions feature disabled in config. ../../config/common.conf.js. Validating Home page displayed');
    await headerPage.waitForPrimaryNavigationToDisplay();
  }
});

When('I click Confirm in Accept Terms and Conditions page', async function () {
  const world = this;
  if (await acceptTermsAndConditionsPage.isFeatureToggleEnabled()) {
    await browserWaits.waitForElement(acceptTermsAndConditionsPage.accepttermsAndConditionsContainer);
    await acceptTermsAndConditionsPage.acceptTremsAndConditions();
    await headerPage.waitForPrimaryNavigationToDisplay();
  } else {
    world.attach('Accept Terms and Conditions feature disabled in config. ../../config/common.conf.js.Validating Home page displayed');
    await headerPage.waitForPrimaryNavigationToDisplay();
  }
});
