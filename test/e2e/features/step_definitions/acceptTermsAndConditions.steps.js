
const acceptTermsAndConditionsPage = require('../pageObjects/termsAndConditionsConfirmPage');
let HeaderPage = require('../pageObjects/headerPage');

const { config } = require('../../config/common.conf');
const browserWaits = require('../../support/customWaits');


var { defineSupportCode } = require('cucumber');


defineSupportCode(function ({ And, But, Given, Then, When }) {

    let headerPage = new HeaderPage();
    Then("I am on Accept Terms and Conditions page", async function () {
        const world = this;
        if (await acceptTermsAndConditionsPage.isFeatureToggleEnabled()){
            await browserWaits.waitForElement(acceptTermsAndConditionsPage.accepttermsAndConditionsContainer); 
            expect(await acceptTermsAndConditionsPage.amOnPage(),"Accept T&C page not displayed").to.be.true;
        }else{
            world.attach("Accept Terms and Conditions feature disabled in config. ../../config/common.conf.js. Validating Home page displayed");
            await headerPage.waitForPrimaryNavigationToDisplay();
        }
    });

    When("I click Confirm in Accept Terms and Conditions page", async function () {
        const world = this;
        if (await acceptTermsAndConditionsPage.isFeatureToggleEnabled()) {
            await browserWaits.waitForElement(acceptTermsAndConditionsPage.accepttermsAndConditionsContainer,10000," Accept T&C contained not present"); 
            await acceptTermsAndConditionsPage.acceptTremsAndConditions();
            await headerPage.waitForPrimaryNavigationToDisplay();
        } else {
            world.attach("Accept Terms and Conditions feature disabled in config. ../../config/common.conf.js.Validating Home page displayed");
            await headerPage.waitForPrimaryNavigationToDisplay();
        }
    })

});