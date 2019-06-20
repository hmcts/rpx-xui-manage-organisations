'use strict';

const loginPage = require('../../pageObjects/createOrganisationObjects');
const { defineSupportCode } = require('cucumber');
const { AMAZING_DELAY, SHORT_DELAY, MID_DELAY, LONG_DELAY } = require('../../../support/constants');
const config = require('../../../config/conf.js');
const EC = protractor.ExpectedConditions;

async function waitForElement(el) {
    await browser.wait(result => {
        return element(by.className(el)).isPresent();
    }, 600000);
}

defineSupportCode(function ({ Given, When, Then }) {

    When(/^I navigate to EUI Manage Organisation Url$/, { timeout: 600 * 1000 }, async function () {
        await browser.get(config.config.baseUrl + '/register-org/register');
        await browser.driver.manage()
            .deleteAllCookies();
        await browser.refresh();
        browser.sleep(AMAZING_DELAY);
    });

    Then(/^I should see failure error summary$/, async function () {
        await waitForElement('heading-large');
        await expect(loginPage.failure_error_heading.isDisplayed()).to.eventually.be.true;
        await expect(loginPage.failure_error_heading.getText())
            .to
            .eventually
            .equal('Incorrect email or password');
    });


    Then(/^I land on register organisation page and continue$/, { timeout: 600 * 1000 }, async function () {
        await waitForElement('govuk-heading-xl');
        browser.sleep(LONG_DELAY);
        await expect(loginPage.start_button.isDisplayed()).to.eventually.be.true;
        await expect(loginPage.start_button.getText())
            .to
            .eventually
            .equal('Start');
        await loginPage.start_button.click();
    });

  Then(/^I Enter the Organization name$/, { timeout: 600 * 1000 }, async function () {
    await waitForElement('govuk-heading-xl');
    await expect(loginPage.org_name.isDisplayed()).to.eventually.be.true;
    await expect(loginPage.org_name.sendKeys("OrganisationTest"));
    await loginPage.continue_button.click();
  });

  Then(/^I Enter the Office Address details$/, { timeout: 600 * 1000 }, async function () {
    await waitForElement('govuk-heading-xl');
    await expect(loginPage.officeAddressOne.isDisplayed()).to.eventually.be.true;
    await expect(loginPage.officeAddressOne.sendKeys("1, Cliffinton"));
    await expect(loginPage.townName.isDisplayed()).to.eventually.be.true;
    await expect(loginPage.townName.sendKeys("London"));
    await expect(loginPage.postcode.isDisplayed()).to.eventually.be.true;
    await expect(loginPage.postcode.sendKeys("SE15TY"));
    await loginPage.continue_button.click();
  });

  Then(/^I Enter the PBA1 details$/, { timeout: 600 * 1000 }, async function () {
    await waitForElement('govuk-heading-xl');
    await expect(loginPage.PBAnumber1.isDisplayed()).to.eventually.be.true;
    await expect(loginPage.PBAnumber1.sendKeys("TY23656"));
    await loginPage.continue_button.click();
  });

  Then(/^I Enter the DX Reference details$/, { timeout: 600 * 1000 }, async function () {
    await waitForElement('govuk-heading-xl');
    await expect(loginPage.DXNumber.isDisplayed()).to.eventually.be.true;
    await expect(loginPage.DXNumber.sendKeys("HT345345"));
    await expect(loginPage.DXexchange.isDisplayed()).to.eventually.be.true;
    await expect(loginPage.DXexchange.sendKeys("DXLondon"));
    await loginPage.continue_button.click();
  });

  Then(/^I Enter the User name$/, { timeout: 600 * 1000 }, async function () {
    await waitForElement('govuk-heading-xl');
    await expect(loginPage.firstName.isDisplayed()).to.eventually.be.true;
    await expect(loginPage.firstName.sendKeys("Mario"));
    await expect(loginPage.lastName.isDisplayed()).to.eventually.be.true;
    await expect(loginPage.lastName.sendKeys("Perta"));
    await loginPage.continue_button.click();
  });

  Then(/^I Enter the Email Address$/, { timeout: 600 * 1000 }, async function () {
    await waitForElement('govuk-heading-xl');
    await expect(loginPage.emailAddress.isDisplayed()).to.eventually.be.true;
    await expect(loginPage.emailAddress.sendKeys("admin@xol.com"));
    await loginPage.continue_button.click();
  });

  Then(/^I land on the summary page and check submit$/, { timeout: 600 * 1000 }, async function () {
    await waitForElement('govuk-heading-l');
    await expect(loginPage.submit_button.isDisplayed()).to.eventually.be.true;
    await expect(loginPage.submit_button.getText())
      .to
      .eventually
      .equal('Submit');
  });

});
