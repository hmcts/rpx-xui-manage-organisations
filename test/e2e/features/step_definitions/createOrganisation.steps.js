'use strict';

let CreateOrganisationObjects = require('../pageObjects/createOrganisationObjects');
const { defineSupportCode } = require('cucumber');
const { AMAZING_DELAY, SHORT_DELAY, MID_DELAY, LONG_DELAY } = require('../../support/constants');
const config = require('../../config/conf.js');
const EC = protractor.ExpectedConditions;

async function waitForElement(el) {
    await browser.wait(result => {
        return element(by.className(el)).isPresent();
    }, 600000);
}

defineSupportCode(function ({ Given, When, Then }) {
  let createOrganisationObject = new CreateOrganisationObjects();

  When(/^I navigate to EUI Manage Organisation Url$/, { timeout: 600 * 1000 }, async function () {
    await browser.get(config.config.baseUrl + '/register-org/register');
    browser.sleep(AMAZING_DELAY);
  });

  Then(/^I land on register organisation page and continue$/, { timeout: 600 * 1000 }, async function () {
        await waitForElement('govuk-heading-xl');
        browser.sleep(LONG_DELAY);
        await expect(createOrganisationObject.start_button.isDisplayed()).to.eventually.be.true;
        await expect(createOrganisationObject.start_button.getText())
            .to
            .eventually
            .equal('Start');
        await createOrganisationObject.start_button.click();
    });

  Then(/^I Enter the Organization name$/, { timeout: 600 * 1000 }, async function () {
    await waitForElement('govuk-heading-xl');
    await expect(createOrganisationObject.org_name.isDisplayed()).to.eventually.be.true;
    await expect(createOrganisationObject.org_name.sendKeys("OrganisationTest"));
    await createOrganisationObject.continue_button.click();
  });

  Then(/^I Enter the Office Address details$/, { timeout: 600 * 1000 }, async function () {
    await waitForElement('govuk-heading-xl');
    await expect(createOrganisationObject.officeAddressOne.isDisplayed()).to.eventually.be.true;
    await expect(createOrganisationObject.officeAddressOne.sendKeys("1, Cliffinton"));
    await expect(createOrganisationObject.townName.isDisplayed()).to.eventually.be.true;
    await expect(createOrganisationObject.townName.sendKeys("London"));
    await expect(createOrganisationObject.postcode.isDisplayed()).to.eventually.be.true;
    await expect(createOrganisationObject.postcode.sendKeys("SE15TY"));
    await createOrganisationObject.continue_button.click();
  });

  Then(/^I Enter the PBA1 details$/, { timeout: 600 * 1000 }, async function () {
    await waitForElement('govuk-heading-xl');
    await expect(createOrganisationObject.PBAnumber1.isDisplayed()).to.eventually.be.true;
    await expect(createOrganisationObject.PBAnumber1.sendKeys("TY23656"));
    await createOrganisationObject.continue_button.click();
  });

  Then(/^I Enter the DX Reference details$/, { timeout: 600 * 1000 }, async function () {
    await waitForElement('govuk-heading-xl');
    await createOrganisationObject.clickDXreferenceCheck.click();
    await expect(createOrganisationObject.DXNumber.isDisplayed()).to.eventually.be.true;
    await expect(createOrganisationObject.DXNumber.sendKeys("1234567891234"));
    await expect(createOrganisationObject.DXexchange.isDisplayed()).to.eventually.be.true;
    await expect(createOrganisationObject.DXexchange.sendKeys("DXLondon"));
    await createOrganisationObject.continue_button.click();
  });

  Then(/^I Select and Enter the SRA number$/, { timeout: 600 * 1000 }, async function () {
    await waitForElement('govuk-heading-xl');
    await expect(createOrganisationObject.SRACheckBox.isDisplayed()).to.eventually.be.true;
    await expect(createOrganisationObject.SRACheckBox.click());
    browser.sleep(LONG_DELAY);
    await waitForElement('govuk-heading-xl');
    await expect(createOrganisationObject.SRANumber.isDisplayed()).to.eventually.be.true;
    await expect(createOrganisationObject.SRANumber.sendKeys("SRA13453453"));
    await createOrganisationObject.continue_button.click();
  });

  Then(/^I Enter the User name$/, { timeout: 600 * 1000 }, async function () {
    await waitForElement('govuk-heading-xl');
    await expect(createOrganisationObject.firstName.isDisplayed()).to.eventually.be.true;
    await expect(createOrganisationObject.firstName.sendKeys("Mario"));
    await expect(createOrganisationObject.lastName.isDisplayed()).to.eventually.be.true;
    await expect(createOrganisationObject.lastName.sendKeys("Perta"));
    await createOrganisationObject.continue_button.click();
  });

  Then(/^I Enter the Email Address$/, { timeout: 600 * 1000 }, async function () {
    await waitForElement('govuk-heading-xl');
    await expect(createOrganisationObject.emailAddress.isDisplayed()).to.eventually.be.true;
    await expect(createOrganisationObject.emailAddress.sendKeys("admin@xol.com"));
    await createOrganisationObject.continue_button.click();
  });

  Then(/^I land on the summary page and check submit$/, { timeout: 600 * 1000 }, async function () {
    await waitForElement('govuk-heading-l');
    await expect(createOrganisationObject.submit_button.isDisplayed()).to.eventually.be.true;
    await expect(createOrganisationObject.submit_button.getText())
      .to
      .eventually
      .equal('Submit');
  });

  When(/^I am not entered Organization name$/, async function () {
    browser.sleep(AMAZING_DELAY);
    createOrganisationObject.org_name.sendKeys();
    await createOrganisationObject.continue_button.click();
  });

  Then(/^I should be display organization error$/, async function () {
    await expect(createOrganisationObject.org_failure_error_heading.isDisplayed()).to.eventually.be.true;
    await expect(createOrganisationObject.org_failure_error_heading.getText())
      .to
      .eventually
      .equal('There is a problem');

  });
});
