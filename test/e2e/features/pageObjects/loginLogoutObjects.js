'use strict';

const { SHORT_DELAY, MID_DELAY, LONG_DELAY } = require('../../support/constants');

function loginLogoutObjects() {
  console.log('in loginLogoutObjects');
  console.log('emailAddress is: ' + element(by.css('input#username')));
  this.emailAddress = element(by.css('[id=\'username\']'));
  console.log('emailAddress value is: ' + this.emailAddress.getAttribute('value'));
  console.log('emailAddress is: ' + this.emailAddress.toString());
  console.log('password: ' + element(by.css('[id=\'password\']')));
  this.password = element(by.css('[id=\'password\']'));
  console.log('password: ' + this.password.toString());
  console.log('signinTitle: ' + element(by.css('h1.heading-large')));
  this.signinTitle= element(by.xpath('//h1[@class=\'heading-large\']'));
  console.log('singinTitle: ' + this.signinTitle.toString());
  //this.signinTitle = element(by.css("h1"));
  console.log('signinBtn: ' + element(by.css('input.button')));
  this.signinBtn = element(by.css('input.button'));
  console.log('signOutlink: ' + element(by.xpath('//a[@class=\'hmcts-header__navigation-link\']')));
  this.signOutlink = element(by.xpath('//a[@class=\'hmcts-header__navigation-link\']'));
  console.log('failure_error_heading: ' + element(by.css('[id=\'validation-error-summary-heading\']')));
  this.failure_error_heading = element(by.css('[id=\'validation-error-summary-heading\']'));
  console.log('failure_error_message: ' + element(by.css('[id=\'validation-error-summary-list\']')));
  this.dashboard_header= element(by.css('a.hmcts-header__link'));

  this.givenIAmLoggedIn = async function () {
    await this.enterUrEmail('');
    await this.enterPassword('');
    await this.clickSignIn();
  };

  this.givenIAmUnauthenticatedUser = async function () {
    await this.enterUrEmail('test@gmail.com');
    await this.enterPassword('123');
    await this.clickSignIn();
  };

  this.loginWithCredentials = async function (email, password) {
    await this.waitFor(this.emailAddress);
    await this.enterUrEmail(email);
    await this.enterPassword(password);
    await this.clickSignIn();
  };

  this.enterUrEmail = async function (email) {
    await this.emailAddress.sendKeys(email);
  };

  this.enterPassword = async function (password) {
    await this.password.sendKeys(password);
  };

  this.clickSignIn = async function () {
    await this.signinBtn.click();
    await browser.sleep(SHORT_DELAY);
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

module.exports = new loginLogoutObjects();
