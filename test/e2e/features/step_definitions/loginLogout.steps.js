'use strict';

const loginPage = require('../pageObjects/loginLogoutObjects');
const { defineSupportCode } = require('cucumber');
const { AMAZING_DELAY, SHORT_DELAY, MID_DELAY, LONG_DELAY } = require('../../support/constants');
const {config} = require('../../config/common.conf.js');
const EC = protractor.ExpectedConditions;

const browserWaits = require('../../support/customWaits');

const mailinatorService = require('../pageObjects/mailinatorService');
const manageCasesService = require('../pageObjects/manageCasesService');

const HeaderPage = require('../pageObjects/headerPage');
const headerPage = new HeaderPage();

async function waitForElement(el) {
  await browser.wait(result => {
    return element(by.className(el)).isPresent();
  }, 40000);
}

defineSupportCode(function ({ Given, When, Then }) {

  When(/^I navigate to manage organisation Url$/, { timeout: 600 * 1000 }, async function () {
    const world = this;

    await browser.get(config.config.baseUrl);
    await browser.driver.manage()
      .deleteAllCookies();
    await browser.refresh();
    await browserWaits.retryWithAction(loginPage.emailAddress, async function (message) {
      world.attach("Retrying Login page load : " + message);
      browser.takeScreenshot()
        .then(stream => {
          const decodedImage = new Buffer(stream.replace(/^data:image\/(png|gif|jpeg);base64,/, ''), 'base64');
          world.attach(decodedImage, 'image/png');
        });
      await browser.get(config.config.baseUrl);
    });
    await browserWaits.waitForElement(loginPage.emailAddress);
    
  });

  Then(/^I should see failure error summary$/, async function () {
    await waitForElement('heading-large');
    await expect(loginPage.failure_error_heading.isDisplayed()).to.eventually.be.true;
    await expect(loginPage.failure_error_heading.getText())
      .to
      .eventually
      .equal('Incorrect email or password');
  });


  Then(/^I am on Idam login page$/, { timeout: 600 * 1000 }, async function () {
    await waitForElement('heading-large');
    await expect(loginPage.signinTitle.isDisplayed()).to.eventually.be.true;
    await expect(loginPage.signinTitle.getText())
      .to
      .eventually
      .equal('Sign in');
    await expect(loginPage.emailAddress.isDisplayed()).to.eventually.be.true;
    await expect(loginPage.password.isDisplayed()).to.eventually.be.true;

  });

  When("I login with latest invited user", async function () {
    const world = this;

    await loginPage.emailAddress.sendKeys(global.latestInvitedUser);          //replace username and password
    await loginPage.password.sendKeys(global.latestInvitedUserPassword);
    // browser.sleep(SHORT_DELAY);
    await loginPage.signinBtn.click();

    await browserWaits.retryForPageLoad($(".hmcts-header__link"), function (message) {
      world.attach("Retrying page load after login : " + message)
    });
    await waitForElement('hmcts-header__link');
    await expect(loginPage.dashboard_header.isDisplayed()).to.eventually.be.true;
    await expect(loginPage.dashboard_header.getText())
      .to
      .eventually
      .equal('Manage organisation details for civil, family, and tribunal law cases');

  });

  When(/^I enter an valid email-address and password to login$/, async function () {
    await loginPage.emailAddress.sendKeys(config.config.username);          //replace username and password
    await loginPage.password.sendKeys(config.config.password);
    // browser.sleep(SHORT_DELAY);
    await loginPage.signinBtn.click();
    browser.sleep(SHORT_DELAY);

  });


  When(/^I enter an Invalid email-address and password to login$/, async function () {
    await loginPage.givenIAmUnauthenticatedUser();

  });


  Given(/^I should be redirected to the Idam login page$/, async function () {
    browser.sleep(LONG_DELAY);
    await expect(loginPage.signinTitle.getText())
      .to
      .eventually
      .equal('Sign in');
    browser.sleep(LONG_DELAY);
  });


  Then(/^I select the sign out link$/, async function () {
    browser.sleep(SHORT_DELAY);
    await expect(loginPage.signOutlink.isDisplayed()).to.eventually.be.true;
    browser.sleep(SHORT_DELAY);
    await headerPage.waitForSpinnerNotPresent();
    await loginPage.signOutlink.click();
    browser.sleep(SHORT_DELAY);
  });

  Then(/^I should be redirected to manage organisation dashboard page$/, async function () {
    browser.sleep(LONG_DELAY);
    // await waitForElement('hmcts-header__link');
    expect(loginPage.dashboard_header.isDisplayed()).to.eventually.be.true;
    expect(loginPage.dashboard_header.getText())
      .to
      .eventually
      .equal('Manage organisation details for civil, family, and tribunal law cases');
    browser.sleep(LONG_DELAY);
  });

  // Given(/^I am logged into manage organisation with ManageOrg user details$/, async function () {
  //   browser.sleep(LONG_DELAY);
  //   await loginPage.emailAddress.sendKeys(config.config.username);
  //   await loginPage.password.sendKeys(config.config.password);
  //   await loginPage.clickSignIn();
  //   browser.sleep(MID_DELAY);
  // });

  // Given(/^I am logged into manage organisation with ManageOrg user details$/, async function () {
  //   browser.sleep(LONG_DELAY);
  //   await loginPage.emailAddress.sendKeys(config.config.username);
  //   await loginPage.password.sendKeys(config.config.password);
  //   await loginPage.clickSignIn();
  //   browser.sleep(MID_DELAY);
  // });

  Given(/^I am logged into manage organisation with ManageOrg user details$/, async function () {
    // browser.sleep(LONG_DELAY);
    const world = this;
    await browserWaits.retryForPageLoad(loginPage.emailAddress,async function (message) {
      world.attach("Retrying Login page load : " + message);
      browser.takeScreenshot()
        .then(stream => {
          const decodedImage = new Buffer(stream.replace(/^data:image\/(png|gif|jpeg);base64,/, ''), 'base64');
          world.attach(decodedImage, 'image/png');
        });
      await browser.get(config.config.baseUrl);
    });

    await browserWaits.waitForElement(loginPage.emailAddress);
    await loginPage.emailAddress.sendKeys(config.config.username);
    await loginPage.password.sendKeys(config.config.password);
    await loginPage.clickSignIn();
    // browser.sleep(LONG_DELAY);
  });

  Given("I am logged in to created approve organisation", async function () {
    // browser.sleep(LONG_DELAY);
    await loginPage.emailAddress.sendKeys(global.latestOrgSuperUser);
    await loginPage.password.sendKeys("Monday01");
    await loginPage.clickSignIn();

    browser.wait(async () => { return !(await loginPage.emailAddress.isPresent())},30000);

    if(config.config.twoFactorAuthEnabled){
      let verificationCodeInput = element(by.css("#code"));
      await browserWaits.waitForElement(verificationCodeInput);
      if (await verificationCodeInput.isPresent()) {
        let loginVerificationCode = await mailinatorService.getLoginVerificationEmailCode(global.latestOrgSuperUser);
        await verificationCodeInput.sendKeys(loginVerificationCode);
        await element(by.css(".button[type = 'submit']")).click();
      }
    }
    
   
  });

  Given(/^I navigate to manage organisation Url direct link$/, { timeout: 600 * 1000 }, async function () {
    await browser.get(config.config.baseUrl + '/cases/case-filter');
    await browser.driver.manage()
      .deleteAllCookies();
    await browser.refresh();
    browser.sleep(AMAZING_DELAY);
  });

  Then(/^I should be redirected back to Login page after direct link$/, async function () {
    browser.sleep(LONG_DELAY);
    await expect(loginPage.signinTitle.getText())
      .to
      .eventually
      .equal('Sign in');
    browser.sleep(LONG_DELAY);
  });

  Then('I login to MC with invited user', async function () {
    await manageCasesService.login(global.latestInvitedUser, global.latestInvitedUserPassword);
  });

  Then('I see login to MC with invited user is {string}', async function (loginStatus) {
    if (loginStatus.includes('success')){
      await manageCasesService.validateLoginSuccess();
    }else{
      await manageCasesService.validateLoginFailure();

    }
  });

});
