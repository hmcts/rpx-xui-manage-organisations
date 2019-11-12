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
    await expect(createOrganisationObject.enterOrgName());
    await createOrganisationObject.continue_button.click();
    browser.sleep(MID_DELAY);
  });

  Then(/^I Enter the Office Address details$/, { timeout: 600 * 1000 }, async function () {
    await waitForElement('govuk-heading-xl');
    await expect(createOrganisationObject.officeAddressOne.isDisplayed()).to.eventually.be.true;
    await expect(createOrganisationObject.officeAddressOne.sendKeys("1, Cliffinton"));
    browser.sleep(MID_DELAY);
    await expect(createOrganisationObject.townName.isDisplayed()).to.eventually.be.true;
    await expect(createOrganisationObject.townName.sendKeys("London"));
    await expect(createOrganisationObject.postcode.isDisplayed()).to.eventually.be.true;
    await expect(createOrganisationObject.postcode.sendKeys("SE15TY"));
    await createOrganisationObject.continue_button.click();
    browser.sleep(MID_DELAY);
  });

  Then(/^I Enter the PBA1 and PBA2 details$/, { timeout: 600 * 1000 }, async function () {
    await waitForElement('govuk-heading-xl');
    await expect(createOrganisationObject.PBAnumber1.isDisplayed()).to.eventually.be.true;
    await expect(createOrganisationObject.enterPBANumber());
    await expect(createOrganisationObject.PBAnumber2.isDisplayed()).to.eventually.be.true;
    await expect(createOrganisationObject.enterPBA2Number());
    await createOrganisationObject.continue_button.click();
    browser.sleep(MID_DELAY);
  });

  Then(/^I Enter the DX Reference details$/, { timeout: 600 * 1000 }, async function () {
    await waitForElement('govuk-heading-xl');
    await createOrganisationObject.clickDXreferenceCheck();
    browser.sleep(MID_DELAY);
    await expect(createOrganisationObject.DXNumber.isDisplayed()).to.eventually.be.true;
    await expect(createOrganisationObject.enterDXNumber());
    await expect(createOrganisationObject.DXexchange.isDisplayed()).to.eventually.be.true;
    await expect(createOrganisationObject.enterDXENumber());
    await createOrganisationObject.continue_button.click();
    browser.sleep(MID_DELAY);

  });

  Then(/^I Select and Enter the SRA number$/, { timeout: 600 * 1000 }, async function () {
    await waitForElement('govuk-heading-xl');
    //await expect(createOrganisationObject.SRACheckBox.isDisplayed()).to.eventually.be.true;
    await createOrganisationObject.clickSRAreferenceCheck();
    browser.sleep(MID_DELAY);
    await waitForElement('govuk-heading-xl');
    await expect(createOrganisationObject.SRANumber.isDisplayed()).to.eventually.be.true;
    await expect(createOrganisationObject.enterSRANumber());
    await createOrganisationObject.continue_button.click();
    browser.sleep(MID_DELAY);
  });

  Then(/^I Enter the firstName and lastName$/, { timeout: 600 * 1000 }, async function () {
    await waitForElement('govuk-heading-xl');
    await expect(createOrganisationObject.firstName.isDisplayed()).to.eventually.be.true;
    await expect(createOrganisationObject.firstName.sendKeys("Mario"));
    await expect(createOrganisationObject.lastName.isDisplayed()).to.eventually.be.true;
    await expect(createOrganisationObject.lastName.sendKeys("Perta"));
    await createOrganisationObject.continue_button.click();
    browser.sleep(MID_DELAY);
  });

  Then(/^I Enter the Email Address$/, { timeout: 600 * 1000 }, async function () {
    await waitForElement('govuk-heading-xl');
    await expect(createOrganisationObject.emailAddr.isDisplayed()).to.eventually.be.true;
    await expect(createOrganisationObject.enterEmailAddress());
    await createOrganisationObject.continue_button.click();
    browser.sleep(MID_DELAY);
  });

  Then(/^I land on the summary page and check submit$/, async function () {
    browser.sleep(MID_DELAY);
    await waitForElement('govuk-heading-l');
    await expect(createOrganisationObject.submit_button.isDisplayed()).to.eventually.be.true;
    await expect(createOrganisationObject.submit_button.getText())
      .to
      .eventually
      .equal('Confirm and submit details');
    await createOrganisationObject.submit_button.click();

  });

  Then(/^I created the organisation successfully$/,  async function () {
    browser.sleep(MID_DELAY);
    await expect(createOrganisationObject.org_success_heading.isDisplayed()).to.eventually.be.true;
    await expect(createOrganisationObject.org_success_heading.getText())
      .to
      .eventually
      .equal('Registration details submitted');

  });

  When(/^I am not entered Organization name$/, async function () {

    createOrganisationObject.org_name.sendKeys();
    await createOrganisationObject.continue_button.click();
    browser.sleep(MID_DELAY);
  });

  Then(/^I should be display organization error$/,  async function () {
    await expect(createOrganisationObject.org_failure_error_heading.isDisplayed()).to.eventually.be.true;
    await expect(createOrganisationObject.org_failure_error_heading.getText())
      .to
      .eventually
      .equal('There is a problem');

  });

  When(/^I am not entered the Office Address details$/, async function () {

    await expect(createOrganisationObject.officeAddressOne.sendKeys());
    await expect(createOrganisationObject.townName.sendKeys());
    await expect(createOrganisationObject.postcode.sendKeys());
    await createOrganisationObject.continue_button.click();
    browser.sleep(LONG_DELAY);
  });
  Then(/^I should be display Office Address error$/,async function () {
    await expect(createOrganisationObject.off_address_error_heading.isDisplayed()).to.eventually.be.true;
    await expect(createOrganisationObject.off_address_error_heading.getText())
      .to
      .eventually
      .equal('There is a problem');

  });

  When(/^I am not entered SRA number$/, async function () {
    await createOrganisationObject.clickSRAreferenceCheck();
    await expect(createOrganisationObject.SRANumber.isDisplayed()).to.eventually.be.true;
    await expect(createOrganisationObject.SRANumber.sendKeys());
    await createOrganisationObject.continue_button.click();
    browser.sleep(MID_DELAY);
  });

  Then(/^I should be display SRA error$/, async function () {
    await expect(createOrganisationObject.sra_error_heading.isDisplayed()).to.eventually.be.true;
    await expect(createOrganisationObject.sra_error_heading.getText())
      .to
      .eventually
      .equal('There is a problem');

  });

  When(/^I am not entered the email address$/,  async function () {
    await expect(createOrganisationObject.emailAddr.isDisplayed()).to.eventually.be.true;
    await expect(createOrganisationObject.emailAddr.sendKeys());
    await createOrganisationObject.continue_button.click();
    browser.sleep(MID_DELAY);
  });

  Then(/^I should be display email error$/,  async function () {
    await expect(createOrganisationObject.email_error_heading.isDisplayed()).to.eventually.be.true;
    await expect(createOrganisationObject.email_error_heading.getText())
      .to
      .eventually
      .equal('There is a problem');

  });

  When(/^I Enter the invalid PBA1 and PBA2 details$/,  async function () {
    await expect(createOrganisationObject.PBAnumber1.isDisplayed()).to.eventually.be.true;
    await expect(createOrganisationObject.PBAnumber1.sendKeys(1234455558));
    await expect(createOrganisationObject.PBAnumber2.sendKeys(1233334988));
    await createOrganisationObject.continue_button.click();
    browser.sleep(LONG_DELAY);
  });

  Then(/^I should be display PBA error$/,  async function () {
    await expect(createOrganisationObject.pba_error_heading.isDisplayed()).to.eventually.be.true;
    await expect(createOrganisationObject.pba_error_heading.getText())
      .to
      .eventually
      .equal('There is a problem');

  });

  When(/^I am not entered the firstName and lastName$/,  async function () {
    await expect(createOrganisationObject.firstName.isDisplayed()).to.eventually.be.true;
    await expect(createOrganisationObject.firstName.sendKeys());
    await expect(createOrganisationObject.lastName.sendKeys());
    await createOrganisationObject.continue_button.click();
    browser.sleep(MID_DELAY);
  });

  Then(/^I should be display firstName and lastName error$/,  async function () {
    await expect(createOrganisationObject.name_error_heading.isDisplayed()).to.eventually.be.true;
    await expect(createOrganisationObject.name_error_heading.getText())
      .to
      .eventually
      .equal('There is a problem');

  });
});
