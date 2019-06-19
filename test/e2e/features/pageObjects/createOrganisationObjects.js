'use strict';

const { SHORT_DELAY, MID_DELAY, LONG_DELAY } = require('../../support/constants');

function createOrganisationObjects() {

  this.emailAddress = element(by.css("[id='emailAddress']"));
  this.password = element(by.css("[id='password']"));
  this.signinTitle = element(by.css("h1.heading-large"));
  this.signinBtn = element(by.css("input.button"));
  this.signOutlink = element(by.xpath("//a[contains(text(),'Signout')]"));
  this.failure_error_heading = element(by.css("[id='validation-error-summary-heading']"));
  this.start_button= element(by.xpath("//a[@class='govuk-button govuk-button--start']"));
  this.org_name= element(by.css("[id='orgName']"));
  this.continue_button=element(by.css("[id='createButtonContinue']"));
  this.officeAddressOne= element(by.css("[id='officeAddressOne']"));
  this.townName= element(by.css("[id='townOrCity']"));
  this.postcode= element(by.css("[id='postcode']"));
  this.PBAnumber1= element(by.css("[id='PBAnumber1']"));
  this.DXNumber= element(by.css("[id='DXnumber']"));
  this.DXexchange= element(by.css("[id='DXexchange']"));
  this.firstName= element(by.css("[id='firstName']"));
  this.lastName= element(by.css("[id='lastName']"));
  this.submit_button= element(by.css("[class='div.govuk-button']"));


  this.givenIAmUnauthenticatedUser = async function () {
    await this.enterUrEmail("test@gmail.com");
    await this.enterPassword("123");
    await this.clickSignIn();
  };

  this.enterUrEmail = async function (email) {
    await this.emailAddress.sendKeys(email);
  };

  this.enterPassword = async function (password) {
    await this.password.sendKeys(password);
  };

  this.clickSignIn = function () {
    this.signinBtn.click();
    browser.sleep(SHORT_DELAY);
  };

  this.waitFor = function (selector) {
    return browser.wait(function () {
      return browser.isElementPresent(selector);
    }, LONG_DELAY);
  };


  this.defaultTime = function () {
    this.setDefaultTimeout(60 * 1000);
  };


}

module.exports = new createOrganisationObjects;
