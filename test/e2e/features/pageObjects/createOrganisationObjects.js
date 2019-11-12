'use strict';
let RadioField = require('./webdriver-components/radioField.js');
const { AMAZING_DELAY, SHORT_DELAY, MID_DELAY, LONG_DELAY } = require('../../support/constants');

class CreateOrganisationObjects {
  constructor() {
    this.emailAddress = element(by.css("[id='emailAddress']"));
    this.password = element(by.css("[id='password']"));
    this.signinTitle = element(by.css("h1.heading-large"));
    this.signinBtn = element(by.css("input.button"));
    this.signOutlink = element(by.xpath("//a[contains(text(),'Signout')]"));
    this.failure_error_heading = element(by.css("[id='validation-error-summary-heading']"));
    this.start_button = element(by.xpath("//*[@id='content']/div/div/a"));
    this.org_name = element(by.css("[id='orgName']"));
    this.continue_button = element(by.css("[id='createButtonContinue']"));
    this.officeAddressOne =element(by.xpath("//*[@id=\"officeAddressOne\"]"));
    this.townName = element(by.xpath("//input[@id='townOrCity']"));
    this.postcode = element(by.css("[id='postcode']"));
    this.PBAnumber1 = element(by.css("#PBAnumber1"));
    this.PBAnumber2 = element(by.css("#PBAnumber2"));
    this.DXreference = element(by.css("[id='haveDxyes']"));
    this.DXNumber = element(by.css("[id='DXnumber']"));
    this.DXContinuee = element(by.xpath("//input[@id='createButtonContinue']"));
    this.DXexchange = element(by.css("[id='DXexchange']"));
    this.SRACheckBox = element(by.css("[id='haveSrayes']"));
    this.SRAContinuee = element(by.xpath("//input[@id='createButtonContinue']"));
    this.SRANumber = element(by.css("[id='sraNumber']"));
    this.firstName = element(by.css("[id='firstName']"));
    this.lastName = element(by.css("[id='lastName']"));
    this.emailAddr = element(by.css("#emailAddress"));
    this.submit_button = element(by.css("[class='govuk-button']"));
    this.org_success_heading = element(by.css("[class='govuk-panel__title']"))
    this.org_failure_error_heading = element(by.css("#error-summary-title"));
    this.off_address_error_heading = element(by.css("#error-summary-title"));
    this.pba_error_heading = element(by.css("#error-summary-title"));
    this.name_error_heading = element(by.css("#error-summary-title"));
    this.sra_error_heading = element(by.css("#error-summary-title"));
    this.email_error_heading = element(by.css("#error-summary-title"));
  }
  async clickDXreferenceCheck(){
    browser.sleep(AMAZING_DELAY);
    await this.DXreference.click();
    browser.sleep(AMAZING_DELAY);
    await this.DXContinuee.click();
  }

  async clickSRAreferenceCheck(){
    browser.sleep(AMAZING_DELAY);
    await this.SRACheckBox.click();
    browser.sleep(AMAZING_DELAY);
    await this.SRAContinuee.click();
  }

  async enterPBANumber() {
    var ramdomPBA = Math.floor(Math.random() * 9000000) + 1000000;
    await this.PBAnumber1.sendKeys("PBA" + ramdomPBA);

  }
  async enterPBA2Number() {
    var ramdomPBA2 = Math.floor(Math.random() * 9000000) + 1000000;
    await this.PBAnumber2.sendKeys("PBA" + ramdomPBA2);

  }

  async enterDXNumber() {
    var ramdomDX = Math.floor(Math.random() * 9000000000) + 1000000000;
    await this.DXNumber.sendKeys("DX " + ramdomDX);

  }

  async enterDXENumber() {
    var ramdomDX = Math.floor(Math.random() * 9000000000) + 1000000000;
    await this.DXexchange.sendKeys("DXE" + ramdomDX);

  }
  async enterSRANumber() {
    var ramdomSRA = Math.floor(Math.random() * 9000000000) + 1000000000;
    await this.SRANumber.sendKeys("SRA" + ramdomSRA);

  }

  async enterOrgName() {
    var orgName =Math.random().toString(36).substring(2);

      //Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    await this.org_name.sendKeys(orgName);

  }
  async enterEmailAddress() {
    var emailAddress =Math.random().toString(36).substring(2);
    await this.emailAddr.sendKeys(emailAddress+"@gmail.com");

  }
}
module.exports = CreateOrganisationObjects;
