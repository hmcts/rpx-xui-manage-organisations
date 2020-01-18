;
let HeaderPage = require('../pageObjects/headerPage');
let ViewUserPage = require('../pageObjects/viewUserPage.js');
let InviteUserPage = require('../pageObjects/inviteUserPage.js');
let TestData = require('../../utils/TestData.js');
const { AMAZING_DELAY, SHORT_DELAY, MID_DELAY, LONG_DELAY } = require('../../support/constants');

Dropdown = require('../pageObjects/webdriver-components/dropdown.js');
TextField = require('../pageObjects/webdriver-components/textField.js');
const config = require('../../config/conf.js');
const EC = protractor.ExpectedConditions;

const mailinatorService = require('../pageObjects/mailinatorService');

var { defineSupportCode } = require('cucumber');

async function waitForElement(el) {
    await browser.wait(result => {
        return element(by.className(el)).isPresent();
    }, 600000);
}

defineSupportCode(function ({ And, But, Given, Then, When }) {

    let headerPage = new HeaderPage();

    Then('I should see navigation tab in header', async function (dataTable) { 
        await headerPage.waitForPrimaryNavigationToDisplay();
        await headerPage.validateNavigationTabDisplayed(dataTable);
    });

});
