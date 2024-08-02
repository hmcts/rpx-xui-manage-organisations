const { When, Then} = require('cucumber');

const ViewOrganisationPage = require('../pageObjects/viewOrganisationPage.js');
const HeaderPage = require('../pageObjects/headerPage');
const loginPage = require('../pageObjects/loginLogoutObjects');
const { AMAZING_DELAY, SHORT_DELAY, MID_DELAY, LONG_DELAY } = require('../../support/constants');
const browserWaits = require('../../support/customWaits');
const { config } = require('../../config/common.conf.js');


const viewOrganisationPage=new ViewOrganisationPage();
const headerPage = new HeaderPage();

When(/^I click on organisation button$/,  async function () {
  await headerPage.clickOrganisation();
  const world = this;
  await browserWaits.retryWithAction(viewOrganisationPage.header, async function (message) {
    world.attach('Retrying Click Organisation  : ' + message);
    global.screenShotUtils.takeScreenshot()
      .then((stream) => {
        const decodedImage = new Buffer(stream.replace(/^data:image\/(png|gif|jpeg);base64,/, ''), 'base64');
        world.attach(decodedImage, 'image/png');
      });
    await browser.get(config.config.baseUrl + '/organisation');

    // await headerPage.clickOrganisation();
  });
});

Then(/^I should be on display the name and address details of organisation$/, async function () {
  // browser.sleep(LONG_DELAY);
  const world = this;
  await browserWaits.retryWithActionCallback( async function (message) {
    await headerPage.clickOrganisation();
    await browserWaits.waitForElement(viewOrganisationPage.header)
  });
  expect(await viewOrganisationPage.amOnPage(), 'Organisation page not displayed').to.be.true;
});

Then(/^I should see name and address details of Organisation$/, async function () {
  // browser.sleep(LONG_DELAY);
  const world = this;

  await browserWaits.retryWithAction(viewOrganisationPage.header, async function (message) {
    world.attach('Retrying Click Organisation  : ' + message);
    screenShotUtils.takeScreenshot()
      .then((stream) => {
        const decodedImage = new Buffer(stream.replace(/^data:image\/(png|gif|jpeg);base64,/, ''), 'base64');
        world.attach(decodedImage, 'image/png');
      });
    await headerPage.clickOrganisation();
  });
  expect(await viewOrganisationPage.amOnPage(), 'Organisation page not displayed').to.be.true;
});

