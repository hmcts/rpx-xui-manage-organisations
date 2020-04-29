let ViewUserPage = require('../pageObjects/viewUserPage.js');
let HeaderPage = require('../pageObjects/headerPage');
const loginPage = require('../pageObjects/loginLogoutObjects');

const { AMAZING_DELAY, SHORT_DELAY, MID_DELAY, LONG_DELAY } = require('../../support/constants');
const EC = protractor.ExpectedConditions;
const { config } = require('../../config/common.conf.js');

var {defineSupportCode} = require('cucumber');
const browserWaits = require('../../support/customWaits');



defineSupportCode(function ({And, But, Given, Then, When}) {
  let viewUserPage = new ViewUserPage();
  let headerPage = new HeaderPage();

  When(/^I click on user button$/, { timeout: 600 * 1000 } ,async function () {
    // browser.sleep(LONG_DELAY);
    const world = this;

    await headerPage.clickUser();

    await browserWaits.retryWithAction(viewUserPage.header, async function (message) {
      world.attach("Retrying Click User  : " + message);
      let stream = await global.screenShotUtils.takeScreenshot();
      const decodedImage = new Buffer(stream.replace(/^data:image\/(png|gif|jpeg);base64,/, ''), 'base64');
      world.attach(decodedImage, 'image/png')
      await browser.get(config.config.baseUrl+'/users');
      // await headerPage.clickUser();
    });

    await viewUserPage.amOnPage(); 

    // browser.sleep(AMAZING_DELAY);
  });

  Then(/^I should be on display the user details$/, async function () {
    // browser.sleep(AMAZING_DELAY);
    expect(await viewUserPage.amOnPage()).to.be.true;
    // browser.sleep(LONG_DELAY);
  });

  Then("I should see invited user is listed in users table", { timeout: 300 * 1000 },async function () {
    await viewUserPage.validateUserWithEmailListed(global.latestInvitedUser);
  });

  Then("I should see all user details displayed in table", async function () {
    await viewUserPage.validateUsersTableDisplaysAllDetails();
  });

  Then("I should see no empty cells in table", async function () {
    await viewUserPage.validateTableHasNoEmptyCells();
  })

});
