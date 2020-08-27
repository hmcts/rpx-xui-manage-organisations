'use strict';

let CreateOrganisationObjects = require('../pageObjects/createOrganisationObjects');
const { defineSupportCode } = require('cucumber');
const { AMAZING_DELAY, SHORT_DELAY, MID_DELAY, LONG_DELAY } = require('../../support/constants');
const {config} = require('../../config/common.conf.js');
const approveOrganizationService = require('../pageObjects/approveOrganizationService');

const EC = protractor.ExpectedConditions;

async function waitForElement(el) {
    await browser.wait(result => {
        return element(by.className(el)).isPresent();
    }, 600000);
}

defineSupportCode(function ({ Given, When, Then }) {
  let createOrganisationObject = new CreateOrganisationObjects();

  When(/^I navigate to EUI Manage Organisation Url$/, async function () {
    await browser.get(config.config.baseUrl + '/register-org/register');
    browser.sleep(MID_DELAY);
  });

  Then('I am on Register organisation start page', async function () {
   await createOrganisationObject.waitForStartRegisterPage();
    await expect(createOrganisationObject.start_button.isDisplayed()).to.eventually.be.true;
    await expect(createOrganisationObject.start_button.getText())
      .to
      .eventually
      .equal('Start');
  });

  Then(/^I land on register organisation page and continue$/, { timeout: 600 * 1000 }, async function () {
        // await waitForElement('govuk-heading-xl');
        browser.sleep(LONG_DELAY);
        await waitForElement('govuk-heading-xl', LONG_DELAY);
        await expect(createOrganisationObject.start_button.isDisplayed()).to.eventually.be.true;
        await expect(createOrganisationObject.start_button.getText())
            .to
            .eventually
            .equal('Start');
        await createOrganisationObject.start_button.click();
    });

  Then(/^I Enter the Organization name$/, { timeout: 600 * 1000 }, async function () {
    // await waitForElement('govuk-heading-xl');
    await expect(createOrganisationObject.org_name.isDisplayed()).to.eventually.be.true;
    await createOrganisationObject.enterOrgName();
    await createOrganisationObject.continue_button.click();
    // browser.sleep(MID_DELAY);
  });

  Then(/^I Enter the Office Address details$/, { timeout: 600 * 1000 }, async function () {
    // await waitForElement(createOrganisationObject.officeAddressOne);
    await expect(createOrganisationObject.officeAddressOne.isDisplayed()).to.eventually.be.true;
    await createOrganisationObject.officeAddressOne.sendKeys("1, Cliffinton");
    // browser.sleep(MID_DELAY);
    await expect(createOrganisationObject.townName.isDisplayed()).to.eventually.be.true;
    await createOrganisationObject.townName.sendKeys("London");
    await expect(createOrganisationObject.postcode.isDisplayed()).to.eventually.be.true;
    await createOrganisationObject.postcode.sendKeys("SE15TY");
    await createOrganisationObject.continue_button.click();
    // browser.sleep(MID_DELAY);
  });

  Then(/^I Enter the PBA1 and PBA2 details$/, async function () {
    // await waitForElement('govuk-heading-xl');
    browser.sleep(MID_DELAY);
    await createOrganisationObject.PBAnumber1.isDisplayed();
    await createOrganisationObject.enterPBANumber();
    await createOrganisationObject.PBAnumber2.isDisplayed();
    await createOrganisationObject.enterPBA2Number();
    await createOrganisationObject.continue_button.click();
    browser.sleep(MID_DELAY);
  });

  Then(/^I Enter the DX Reference details$/, { timeout: 600 * 1000 }, async function () {
    await createOrganisationObject.clickDXreferenceCheck();
    browser.sleep(MID_DELAY);
    await createOrganisationObject.DXNumber.isDisplayed();
    await createOrganisationObject.enterDXNumber();
    await createOrganisationObject.DXexchange.isDisplayed();
    await createOrganisationObject.enterDXENumber();
    await createOrganisationObject.continue_button.click();
    // browser.sleep(MID_DELAY);

  });

  Then(/^I Select and Enter the SRA number$/, { timeout: 600 * 1000 }, async function () {
    // await waitForElement('govuk-heading-xl');
    //await expect(createOrganisationObject.SRACheckBox.isDisplayed()).to.eventually.be.true;
    await createOrganisationObject.clickSRAreferenceCheck();
    // browser.sleep(MID_DELAY);
    // await waitForElement('govuk-heading-xl');
    await expect(createOrganisationObject.SRANumber.isDisplayed()).to.eventually.be.true;
    await createOrganisationObject.enterSRANumber();
    await createOrganisationObject.continue_button.click();
    // browser.sleep(MID_DELAY);
  });

  Then(/^I Enter the firstName and lastName$/, { timeout: 600 * 1000 }, async function () {
    await waitForElement('govuk-heading-xl');
    expect(createOrganisationObject.firstName.isDisplayed()).to.eventually.be.true;
    await createOrganisationObject.firstName.sendKeys("Mario");
    expect(createOrganisationObject.lastName.isDisplayed()).to.eventually.be.true;
    await createOrganisationObject.lastName.sendKeys("Perta");
    await createOrganisationObject.continue_button.click();
    // browser.sleep(MID_DELAY);
  });

  Then(/^I Enter the Email Address$/, { timeout: 600 * 1000 }, async function () {
    // await waitForElement('govuk-heading-xl');
    await expect(createOrganisationObject.emailAddr.isDisplayed()).to.eventually.be.true;

    global.latestOrgSuperUser = Math.random().toString(36).substring(2) + "@mailinator.com";
    global.latestOrgSuperUserPassword = "Monday01";

    await createOrganisationObject.enterEmailAddress(global.latestOrgSuperUser);
    await createOrganisationObject.continue_button.click();


    // browser.sleep(MID_DELAY);
  });

  Then(/^I land on the summary page and check submit$/, async function () {
    // browser.sleep(MID_DELAY);
    // await waitForElement('govuk-heading-l');

    await expect(createOrganisationObject.submit_button.isDisplayed()).to.eventually.be.true;
    await expect(createOrganisationObject.submit_button.getText())
      .to
      .eventually
      .equal('Confirm and submit details');
    await createOrganisationObject.submit_button.click();

  });

  Then(/^I created the organisation successfully$/,  async function () {
    // browser.sleep(MID_DELAY);
    createOrganisationObject.waitForSubmission();
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

    await createOrganisationObject.officeAddressOne.sendKeys();
    await createOrganisationObject.townName.sendKeys();
    await createOrganisationObject.postcode.sendKeys();
    await createOrganisationObject.continue_button.click();
    // browser.sleep(LONG_DELAY);
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
    await createOrganisationObject.waitForPage("Enter your organisation SRA ID");
    await createOrganisationObject.SRANumber.sendKeys();
    await createOrganisationObject.continue_button.click();
    // browser.sleep(MID_DELAY);
  });

  Then(/^I should be display SRA error$/, async function () {
    await createOrganisationObject.waitForPage("Enter your organisation SRA ID");
      await expect(createOrganisationObject.sra_error_heading.getText())
      .to
      .eventually
      .equal('There is a problem');

  });

  When(/^I am not entered the email address$/,  async function () {
    await expect(createOrganisationObject.emailAddr.isDisplayed()).to.eventually.be.true;
    await createOrganisationObject.emailAddr.sendKeys();
    await createOrganisationObject.continue_button.click();
    // browser.sleep(MID_DELAY);
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
    await createOrganisationObject.PBAnumber1.sendKeys(1234455558);
    await createOrganisationObject.PBAnumber2.sendKeys(1233334988);
    await createOrganisationObject.continue_button.click();
    // browser.sleep(LONG_DELAY);
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
    await createOrganisationObject.firstName.sendKeys();
    await createOrganisationObject.lastName.sendKeys();
    await createOrganisationObject.continue_button.click();
    // browser.sleep(MID_DELAY);
  });

  Then(/^I should be display firstName and lastName error$/,  async function () {
    await expect(createOrganisationObject.name_error_heading.isDisplayed()).to.eventually.be.true;
    await expect(createOrganisationObject.name_error_heading.getText())
      .to
      .eventually
      .equal('There is a problem');

  });

  When('I am on page {string} in registration step', async function (page) {
    await createOrganisationObject.waitForPage(page);
  });

  Then('I see content header already registered account',  function () {
    expect(createOrganisationObject.getAlreadyRegisteredAccountHeaderText()).to
    .eventually.
    equal('Already registered for a MyHMCTS account?');
  });

  Then('I see manage cases link under already registered account header',  function () {
    expect(createOrganisationObject.isManageCasesLinkPresent()).to
      .eventually.
      be.true;
  });

  Then('I see manage org link under already registered account header',  function () {
    expect(createOrganisationObject.isManageOrgLinkPresent()).to
      .eventually.
      be.true;
  });

  Then('I click and validate MC link opens in new tab', async function () {
    await createOrganisationObject.clickAndValidateMCLink();
  });

  Then('I click and validate MO link opens in new tab', async function () {
    await createOrganisationObject.clickAndValidateMOLink();
  })

  When('I click back link in register org workflow', async function () {
    await createOrganisationObject.clickBackLink();

  });
});
