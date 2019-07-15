'use strict';

const headerPage = require('../pageObjects/headerPage');
const loginPage = require('../pageObjects/loginLogoutPage');
const { AMAZING_DELAY, SHORT_DELAY, MID_DELAY, LONG_DELAY } = require('../../support/constants');
const config = require('../../config/conf.js');
const EC = protractor.ExpectedConditions;

var {defineSupportCode} = require('cucumber');

defineSupportCode(function ({And, But, Given, Then, When}) {
  Given(/^I am on idam login page$/, async function () {
    await browser.get(config.config.baseUrl);
    await browser.driver.manage().deleteAllCookies();
    await browser.refresh();
    browser.sleep(AMAZING_DELAY);
    await expect(loginPage.signinTitle.getText()).to.eventually.equal('Sign in');
  });


  When(/^I enter an invalid email address (.*) or invalid password (.*) and click on login button$/, async function (emailAddress, password) {
    //await loginPage.givenIAmUnauthenticatedUser();
    await loginPage.emailAddress.sendKeys(emailAddress);
    browser.sleep(SHORT_DELAY);
    await loginPage.password.sendKeys(password);
    browser.sleep(MID_DELAY);
    await loginPage.clickSignIn();
    browser.sleep(AMAZING_DELAY);

  });

  Then(/^I should be redirected to the idam login page with failure error summary$/, async function () {
    browser.sleep(AMAZING_DELAY);
    await expect(loginPage.failure_error_heading.isDisplayed()).to.eventually.be.true;
    browser.sleep(MID_DELAY);
    await expect(loginPage.failure_error_heading.getText()).to.eventually.equal('Incorrect email or password');

  });

  When(/^I enter an email address (.*) and password (.*) and click on login button$/, async function (emailAddress, password) {
    browser.sleep(AMAZING_DELAY);
    await loginPage.emailAddress.sendKeys(emailAddress);
    await loginPage.password.sendKeys(password);
    await loginPage.clickSignIn();
    browser.sleep(AMAZING_DELAY);

  });

  Then(/^I should be redirected to manage organisation page$/, async function () {
    browser.sleep(AMAZING_DELAY);
    await expect(headerPage.moPage.isDisplayed()).to.eventually.be.true;
    browser.sleep(MID_DELAY);
    await expect(headerPage.moPage.getText()).to.eventually.equal('Manage Organisation details for civil and family law cases');
  });

  When(/^I click on the sign out link$/, async function () {
    headerPage.clickSignOut();
    browser.sleep(AMAZING_DELAY);
  });

  Then(/^I should be redirected to the idam login page$/, async function () {
    browser.sleep(AMAZING_DELAY);
    await expect(loginPage.signinTitle.getText()).to.eventually.equal('Sign in');
  });


});
