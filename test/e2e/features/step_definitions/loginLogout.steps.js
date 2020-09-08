'use strict';

const loginPage = require('../pageObjects/loginLogoutObjects');
const { defineSupportCode } = require('cucumber');
const { AMAZING_DELAY, SHORT_DELAY, MID_DELAY, LONG_DELAY } = require('../../support/constants');
const {config} = require('../../config/common.conf.js');
const EC = protractor.ExpectedConditions;

const browserWaits = require('../../support/customWaits');

const mailinatorService = require('../pageObjects/mailinatorService');
const manageCasesService = require('../pageObjects/manageCasesService');
const acceptTermsAndConditionsPage = require('../pageObjects/termsAndConditionsConfirmPage');

const HeaderPage = require('../pageObjects/headerPage');
const { browser } = require('protractor');
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
    await browserWaits.retryWithAction(loginPage.emailAddress, async function (message) {
      let stream = await browser.takeScreenshot();
      const decodedImage = new Buffer(stream.replace(/^data:image\/(png|gif|jpeg);base64,/, ''), 'base64');
      world.attach(decodedImage, 'image/png');
      await browser.get(config.config.baseUrl);

    });
    await browserWaits.waitForElement(loginPage.emailAddress, LONG_DELAY,"IDAM login page Email Address input not present");
    
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
    this.attach("User email : " + global.latestInvitedUser);
    await loginWithCredentials(global.latestInvitedUser, global.latestInvitedUserPassword,world);

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
    await browserWaits.waitForElement(loginPage.signOutlink, LONG_DELAY, "Signout link not present in page");
    await expect(loginPage.signOutlink.isDisplayed()).to.eventually.be.true;
    await headerPage.waitForSpinnerNotPresent();
    await loginPage.signOutlink.click();
    await browserWaits.waitForElement(loginPage.emailAddress, LONG_DELAY, "Login page is not displayed after signout");
  });

  Then(/^I should be redirected to manage organisation dashboard page$/, async function () {
    await browserWaits.waitForElement(loginPage.dashboard_header, LONG_DELAY,"Dashboard Header not present");
    await browserWaits.waitForElement(headerPage.hmctsPrimaryNavigation, LONG_DELAY,"Primary navigation Tab not present"); 
 
    await expect(loginPage.dashboard_header.isDisplayed(),"Dashboard header not displayed").to.eventually.be.true;
    await expect(loginPage.dashboard_header.getText())
      .to
      .eventually
      .equal('Manage organisation details for civil, family, and tribunal law cases');
 
    await expect(headerPage.isPrimaryNavigationTabDisplayed(),"Primary navigation tabs not displayed").to.eventually.be.true;
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

    await loginWithCredentials('autotest_readonly_superuser@mailinator.com', 'Monday01',world);

    // browser.sleep(LONG_DELAY);
  });

  Given(/^I am logged into manage organisation to invite users$/, async function () {
    // browser.sleep(LONG_DELAY);
    const world = this;

    await loginWithCredentials(config.config.username_rw, config.config.password_rw, world);

    // browser.sleep(LONG_DELAY);
  });

  Given('I am logged into manage organisation with test org user', async function(){
    const world = this;
    this.attach('Login user : ' + global.testorg_rw_superuser_email);
    console.log('Login user : ' + global.testorg_rw_superuser_email);
    await loginWithCredentials(global.testorg_rw_superuser_email, 'Monday01',world);

    let tandcfeatureToggle = await acceptTermsAndConditionsPage.isFeatureToggleEnabled(this);
    if (tandcfeatureToggle){
      if (global.testorgStatus >= 4) {
        console.log("User accepted T&C already");
      } else {
        await waitForElement('hmcts-header__link');
        let tandcAcceptPageDisplayed = await acceptTermsAndConditionsPage.amOnPage();
        console.log("tandcAcceptPageDisplayed : " + tandcAcceptPageDisplayed);
        await acceptTermsAndConditionsPage.acceptTremsAndConditions();
        global.testorgStatus = 4;
      }
    } 
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
    await waitForElement(loginPage.emailAddress);
    await expect(loginPage.signinTitle.getText())
      .to
      .eventually
      .equal('Sign in');
    browser.sleep(LONG_DELAY);
  });

  Then('I login to MC with invited user', { timeout: 120 * 1000 },async function () {
    await manageCasesService.init();
    manageCasesService.setLogger((message, isScreenshot) => logger(this, message, isScreenshot));
    // manageCasesService.setWorld(this);
    await manageCasesService.login(global.latestInvitedUser, global.latestInvitedUserPassword);
    await manageCasesService.destroy(); 

  });

  Then('I see login to MC with invited user is {string}', { timeout: 120 * 1000 }, async function (loginStatus) {
    await manageCasesService.init();
    manageCasesService.setLogger((message, isScreenshot) => logger(this, message, isScreenshot));
    try{
      await manageCasesService.login(global.latestInvitedUser, global.latestInvitedUserPassword)
      if (loginStatus.includes('success')) {
        await manageCasesService.validateLoginSuccess();
      } else {
        await manageCasesService.validateLoginFailure();
      }
      await manageCasesService.destroy();
    }catch(err){
      await manageCasesService.attachScreenshot();
      await manageCasesService.destroy()
      throw err;
    }
   
  });

});


async function loginWithCredentials(username,password,world){
  await browserWaits.retryForPageLoad(loginPage.emailAddress, async function (message) {
    world.attach("Retrying Login page load : " + message);
    let stream = await browser.takeScreenshot();
    const decodedImage = new Buffer(stream.replace(/^data:image\/(png|gif|jpeg);base64,/, ''), 'base64');
    world.attach(decodedImage, 'image/png');
    await browser.get(config.config.baseUrl);
  });

  await browserWaits.waitForElement(loginPage.emailAddress);
  await loginPage.emailAddress.sendKeys(username);
  await loginPage.password.sendKeys(password);
  await browserWaits.waitForElement(loginPage.signinBtn);
  await loginPage.clickSignIn();


  await browserWaits.retryWithAction($('app-header'), async function (message) {
    world.attach("Retrying Login attempt: " + message);
    let stream = await browser.takeScreenshot();
    const decodedImage = new Buffer(stream.replace(/^data:image\/(png|gif|jpeg);base64,/, ''), 'base64');
    world.attach(decodedImage, 'image/png');
    await browser.get(config.config.baseUrl);
    await browserWaits.waitForElement(loginPage.emailAddress);
    await loginPage.emailAddress.sendKeys(username);
    await loginPage.password.sendKeys(password);
    await browserWaits.waitForElement(loginPage.signinBtn);
    await loginPage.clickSignIn();
  });


}

function logger(world, message, isScreenshot) {
  if (isScreenshot) {
    world.attach(message, 'image/png');
    console.log('Screenshot attached');
  } else {
    world.attach(message);
    console.log(message);
  }

}
