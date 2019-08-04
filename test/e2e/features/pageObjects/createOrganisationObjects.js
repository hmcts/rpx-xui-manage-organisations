'use strict';

const { SHORT_DELAY, MID_DELAY, LONG_DELAY } = require('../../support/constants');

class CreateOrganisationObjects {
  constructor() {
    this.emailAddress = element(by.css("[id='emailAddress']"));
    this.password = element(by.css("[id='password']"));
    this.signinTitle = element(by.css("h1.heading-large"));
    this.signinBtn = element(by.css("input.button"));
    this.signOutlink = element(by.xpath("//a[contains(text(),'Signout')]"));
    this.failure_error_heading = element(by.css("[id='validation-error-summary-heading']"));
    this.start_button = element(by.xpath("//a[@class='govuk-button govuk-button--start']"));
    this.org_name = element(by.css("#orgName"));
    this.continue_button = element(by.css("[id='createButtonContinue']"));
    this.officeAddressOne = element(by.css("[id='officeAddressOne']"));
    this.townName = element(by.css("[id='townOrCity']"));
    this.postcode = element(by.css("[id='postcode']"));
    this.PBAnumber1 = element(by.css("[id='PBAnumber1']"));
    this.DXreference = element(by.css("#haveyes"));
    this.DXNumber = element(by.css("[id='DXnumber']"));
    this.DXexchange = element(by.css("[id='DXexchange']"));
    this.firstName = element(by.css("[id='firstName']"));
    this.lastName = element(by.css("[id='lastName']"));
    this.submit_button = element(by.css("[class='div.govuk-button']"));
    this.SRACheckBox = element(by.xpath("//input[@id='haveyes']"));
    this.SRANumber = element(by.xpath("//input[@id='sraNumber']"));
    this.org_failure_error_heading = element(by.css("#error-summary-title"));
  }
  async clickDXreferenceCheck(){
    browser.sleep(AMAZING_DELAY);
    await this.DXreference.click();
  }
}
module.exports = CreateOrganisationObjects;
