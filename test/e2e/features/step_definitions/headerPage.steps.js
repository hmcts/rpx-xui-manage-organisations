
import { Then } from 'cucumber'

const HeaderPage = require('../pageObjects/headerPage');
const ViewUserPage = require('../pageObjects/viewUserPage.js');
const InviteUserPage = require('../pageObjects/inviteUserPage.js');
const TestData = require('../../utils/TestData.js');
const { AMAZING_DELAY, SHORT_DELAY, MID_DELAY, LONG_DELAY } = require('../../support/constants');

Dropdown = require('../pageObjects/webdriver-components/dropdown.js');
TextField = require('../pageObjects/webdriver-components/textField.js');
const config = require('../../config/common.conf.js');
const EC = protractor.ExpectedConditions;

const mailinatorService = require('../pageObjects/mailinatorService');


async function waitForElement(el) {
  await browser.wait((result) => {
    return element(by.className(el)).isPresent();
  }, 600000);
}

const headerPage = new HeaderPage();

Then('I should see navigation tab in header', async function (dataTable) {
  await headerPage.waitForPrimaryNavigationToDisplay();
  await headerPage.validateNavigationTabDisplayed(dataTable);
});
