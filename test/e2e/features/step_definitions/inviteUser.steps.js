const loginPage = require('../pageObjects/loginLogoutObjects');
let HeaderPage = require('../pageObjects/headerPage');
let ViewUserPage = require('../pageObjects/viewUserPage.js');
let InviteUserPage = require('../pageObjects/inviteUserPage.js');
let TestData = require('../../utils/TestData.js');
const { AMAZING_DELAY, SHORT_DELAY, MID_DELAY, LONG_DELAY } = require('../../support/constants');

Dropdown = require('../pageObjects/webdriver-components/dropdown.js');
TextField = require('../pageObjects/webdriver-components/textField.js');
const config = require('../../config/conf.js');
const EC = protractor.ExpectedConditions;

const MailinatorService = require('../pageObjects/mailinatorService');
let mailinatorService = new MailinatorService();

var { defineSupportCode } = require('cucumber');

async function waitForElement(el) {
  await browser.wait(result => {
    return element(by.className(el)).isPresent();
  }, 600000);
}

defineSupportCode(function ({And, But, Given, Then, When}) {
  let inviteUserPage=new InviteUserPage();
  let viewUserPage=new ViewUserPage();
  let headerPage = new HeaderPage();

  let invitedUserEmail = "";

  When(/^I click on invite user button$/, async function () {
    await viewUserPage.clickInviteUser();
    // browser.sleep(LONG_DELAY);
  });

  Then(/^I should be on display invite user page$/, async function () {
    // browser.sleep(AMAZING_DELAY);
    await inviteUserPage.waitForPage();
    expect(await inviteUserPage.amOnPage()).to.be.true;
  });

  When(/^I enter mandatory fields firstname,lastname,emailaddress,permissions and click on send invitation button$/, async function () {
    await inviteUserPage.waitForPage(); 
    await inviteUserPage.enterIntoTextFieldFirstName(TestData.firstName);
    await inviteUserPage.enterIntoTextFieldLastName(TestData.lastName);

      // var emailAddress =Math.random().toString(36).substring(2);
    global.latestInvitedUser = Math.random().toString(36).substring(2)+"@mailinator.com";
    global.latestInvitedUserPassword = "Monday01"; 

    await inviteUserPage.enterIntoTextFieldEmailAddress(global.latestInvitedUser);
    await inviteUserPage.manageUserCheckbox.click();
    // browser.sleep(LONG_DELAY);
    await inviteUserPage.clickSendInvitationButton();
    // browser.sleep(LONG_DELAY);

  });
  Then(/^user should be created successfuly$/, async function () {
    browser.sleep(LONG_DELAY);
    expect(await new InviteUserPage().amOnUserConfirmationPage()).to.be.true;

  });

  When(/^I not enter the mandatory fields firstname,lastname,emailaddress,permissions and click on send invitation button$/, async function () {

    await inviteUserPage.enterIntoTextFieldFirstName("");
    await inviteUserPage.enterIntoTextFieldLastName("");
    await inviteUserPage.enterIntoTextFieldEmailAddress("");
    await inviteUserPage.clickSendInvitationButton();

  });

  When('I enter mandatory fields firstname,lastname,emailaddress with permissions and click on send invitation button', async function (table) {
    await inviteUserPage.waitForPage();
    await inviteUserPage.enterIntoTextFieldFirstName(TestData.firstName);
    await inviteUserPage.enterIntoTextFieldLastName(TestData.lastName);
    global.latestInvitedUser = Math.random().toString(36).substring(2) + "@mailinator.com";
    global.latestInvitedUserPassword = "Monday01";

    await inviteUserPage.enterIntoTextFieldEmailAddress(global.latestInvitedUser);
    let permissions = table.hashes(); 
    for (let permCounter = 0; permCounter < permissions.length;permCounter++){
      await inviteUserPage.selectPermission(permissions[permCounter].Permission,true); 
    }
    await inviteUserPage.clickSendInvitationButton()
  });

  When('I edit user permissions', async function (table) {
    let permissions = table.hashes();
    for (let permCounter = 0; permCounter < permissions.length; permCounter++) {
      await inviteUserPage.selectPermission(permissions[permCounter].Permission, permissions[permCounter].isSelected === "true");
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

  Then("I activate invited user", async function () {
    await mailinatorService.init();
    await mailinatorService.openRegistrationEmailForUser(global.latestInvitedUser);
    await mailinatorService.completeUserRegistrationFromEmail();
  });

});
