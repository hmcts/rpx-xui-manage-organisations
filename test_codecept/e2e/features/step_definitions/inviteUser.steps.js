
const loginPage = require('../pageObjects/loginLogoutObjects');
const HeaderPage = require('../pageObjects/headerPage');
const ViewUserPage = require('../pageObjects/viewUserPage.js');
const InviteUserPage = require('../pageObjects/inviteUserPage.js');
const TestData = require('../../utils/TestData.js');
const { AMAZING_DELAY, SHORT_DELAY, MID_DELAY, LONG_DELAY } = require('../../support/constants');

const Dropdown = require('../pageObjects/webdriver-components/dropdown.js');
const TextField = require('../pageObjects/webdriver-components/textField.js');
const { config } = require('../../config/common.conf.js');

const mailinatorService = require('../pageObjects/mailinatorService');
const browserWaits = require('../../support/customWaits');
const CucumberReportLogger = require('../../support/reportLogger');

const cucumberHtmlReporter = require('cucumber-html-reporter');
const { Error } = require('globalthis/implementation');

const inviteUserPage=new InviteUserPage();
const viewUserPage=new ViewUserPage();
const headerPage = new HeaderPage();

const invitedUserEmail = '';

When(/^I click on invite user button$/, async function () {
  await viewUserPage.clickInviteUser();
  // browser.sleep(LONG_DELAY);
});

When(/^I navigate to invite user page$/, async function () {
  const inviteUserPath = config.config.baseUrl.endsWith('/') ? 'users/invite-user' : '/users/invite-user';
  await browser.get(config.config.baseUrl + inviteUserPath);
  await inviteUserPage.waitForPage();
});

Then(/^I should be on display invite user page$/, async function () {
  // browser.sleep(AMAZING_DELAY);;
  await inviteUserPage.waitForPage();
  expect(await inviteUserPage.amOnPage(), 'Invite User page is not displayed').to.be.true;
});

When(/^I enter mandatory fields firstname,lastname,emailaddress,permissions and click on send invitation button$/, async function () {
  await inviteUserPage.waitForPage();
  await inviteUserPage.enterIntoTextFieldFirstName(TestData.firstName);
  await inviteUserPage.enterIntoTextFieldLastName(TestData.lastName);

  // var emailAddress =Math.random().toString(36).substring(2);
  global.latestInvitedUser = Math.random().toString(36).substring(2)+'@mailinator.com';
  global.latestInvitedUserPassword = 'Monday01';

  await inviteUserPage.enterIntoTextFieldEmailAddress(global.latestInvitedUser);
  await inviteUserPage.manageUserCheckbox.click();
  browser.sleep(LONG_DELAY);
  await inviteUserPage.clickSendInvitationButton();
  // browser.sleep(LONG_DELAY);
});
Then(/^user should be created successfuly$/, async function () {

  await browserWaits.waitForElement(inviteUserPage.userInvitaionConfirmation)
  await browserWaits.retryWithActionCallback(async () => {
    expect(await inviteUserPage.userInvitaionConfirmation.getText()).to.include('You\'ve invited');

  })
});

When(/^I not enter the mandatory fields firstname,lastname,emailaddress,permissions and click on send invitation button$/, async function () {
  await inviteUserPage.enterIntoTextFieldFirstName('');
  await inviteUserPage.enterIntoTextFieldLastName('');
  await inviteUserPage.enterIntoTextFieldEmailAddress('');
  await inviteUserPage.clickSendInvitationButton();
});

When('I enter mandatory fields firstname,lastname,emailaddress with permissions and click on send invitation button', async function (table) {
  await inviteUserPage.waitForPage();
  await inviteUserPage.enterIntoTextFieldFirstName(TestData.firstName);
  await inviteUserPage.enterIntoTextFieldLastName(TestData.lastName);
  global.latestInvitedUser = Math.random().toString(36).substring(2) + '@mailinator.com';
  global.latestInvitedUserPassword = 'Monday01';

  await inviteUserPage.enterIntoTextFieldEmailAddress(global.latestInvitedUser);
  const permissions = table.parse().hashes();
  for (let permCounter = 0; permCounter < permissions.length; permCounter++){
    await inviteUserPage.selectPermission(permissions[permCounter].Permission, true);
  }
  await inviteUserPage.clickSendInvitationButton();
});

When('I edit user permissions', async function (table) {
  const permissions = table.hashes();
  for (let permCounter = 0; permCounter < permissions.length; permCounter++) {
    await inviteUserPage.selectPermission(permissions[permCounter].Permission, permissions[permCounter].isSelected === 'true');
  }
});

Then(/^I should be display the validation error$/, async function () {
  await expect(inviteUserPage.failure_error_heading.isDisplayed()).to.eventually.be.true;
  await expect(inviteUserPage.failure_error_heading.getText())
    .to
    .eventually
    .equal('There is a problem');
});

When(/^I click on back button$/, async function () {
  // browser.sleep(AMAZING_DELAY);
  await inviteUserPage.clickBackButton();
});

Then('I activate invited user',  async function () {
  await mailinatorService.init();
  try {
    mailinatorService.setLogger((message, isScreenshot) => logger(this, message, isScreenshot));
    await mailinatorService.openRegistrationEmailForUser(global.latestInvitedUser);
    this.attach('Registration email received successfully.');
    await mailinatorService.completeUserRegistrationFromEmail();
    this.attach('Registration completed successfully.');
    await mailinatorService.destroy();
  } catch (err){
    await CucumberReportLogger.AddScreenshot(mailinatorService.getScreenShotUtil());
    await mailinatorService.destroy();
    throw new Error('Error occured during user activation steps', err);
  }
});

Then(/^I click on a Active User$/, async function () {
  await inviteUserPage.findNextActiveUser();
  await browserWaits.waitForElement(inviteUserPage.activeUser)
  await expect(inviteUserPage.activeUser.isDisplayed()).to.eventually.be.true;
  await inviteUserPage.activeUser.click();
});

Then(/^I see change link and suspend button$/, async function () {

  await browserWaits.waitForElement(inviteUserPage.userDetailsComponent);
  await browserWaits.waitForElement(inviteUserPage.changeLink);
  await browserWaits.waitForElement(inviteUserPage.suspendButton);

  await expect(inviteUserPage.changeLink.isDisplayed(), 'chnage link not displayed').to.eventually.be.true;
  await expect(inviteUserPage.suspendButton.isDisplayed(), 'suspend button not displayed').to.eventually.be.true;
});

Then(/^I click on change link$/, async function () {
  browser.sleep(MID_DELAY);
  await inviteUserPage.changeLink.click();
  await expect(inviteUserPage.editUserText.isDisplayed()).to.eventually.be.true;
  await expect(inviteUserPage.editUserText.getText())
    .to
    .eventually
    .equal('Edit user');
});

Then(/^I edit the Manage User checkbox and click submit$/, async function () {
  browser.sleep(MID_DELAY);
  await inviteUserPage.manageUserCheckbox.click();
  await inviteUserPage.clickSendInvitationButton();
  browser.sleep(MID_DELAY);
  await viewUserPage.waitForUserDetailsPage();
  await expect(inviteUserPage.suspendButton.isDisplayed()).to.eventually.be.true;
});

Then(/^I click the suspend button$/, async function () {
  await inviteUserPage.suspendButton.click();
});

Then(/^I see the suspend user page$/, async function () {
  browser.sleep(MID_DELAY);
  await expect(inviteUserPage.editUserText.isDisplayed()).to.eventually.be.true;
  await expect(inviteUserPage.editUserText.getText())
    .to
    .eventually
    .equal('Are you sure you want to suspend this account?');
});


function logger(world, message, isScreenshot){
  if (isScreenshot){
    world.attach(message, 'image/png');
    console.log('Screenshot attached');
  } else {
    world.attach(message);
    console.log(message);
  }
}
