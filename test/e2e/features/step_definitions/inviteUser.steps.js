const loginPage = require('../pageObjects/loginLogoutObjects');
const headerPage = require('../pageObjects/headerPage');
const viewUserPage = require('../pageObjects/viewUserPage.js');
const InviteUserPage = require('../pageObjects/inviteUserPage.js');
let TestData = require('../../utils/TestData.js');
const { AMAZING_DELAY, SHORT_DELAY, MID_DELAY, LONG_DELAY } = require('../../support/constants');

Dropdown = require('../pageObjects/webdriver-components/dropdown.js');
TextField = require('../pageObjects/webdriver-components/textField.js');
const config = require('../../config/conf.js');
const EC = protractor.ExpectedConditions;

const { defineSupportCode } = require('cucumber');

defineSupportCode(function ({And, But, Given, Then, When}) {

  Then(/^I should be on display the user page$/, async function () {
    expect(await new ViewUserPage().amOnPage()).to.be.true;
  });
  When(/^I click on invite user button$/, async function () {
    await headerPage.clickInviteUser();
  });
  Then(/^I should be on display invite user page$/, async function () {
    expect(await new InviteUserPage().amOnPage()).to.be.true;
  });
  When(/^I enter mandatory fields firstname,lastname,emailaddress,permissions and click on send invitation button$/, async function () {

    await inviteUserPage.enterIntoTextFieldFirstName(TestData.firstName);
    await inviteUserPage.enterIntoTextFieldLastName(TestData.lastName);
    await inviteUserPage.enterIntoTextFieldEmailAddress(TestData.emailAddress);
    await inviteUserPage.sendInvitationButton();

  });
  Then(/^user should be created successfuly$/, async function () {
    expect(await new InviteUserPage().amOnPage()).to.be.true;

  });
  When(/^I not enter the mandatory fields firstname,lastname,emailaddress,permissions and click on send invitation button$/, async function () {

    await inviteUserPage.enterIntoTextFieldFirstName();
    await inviteUserPage.enterIntoTextFieldLastName();
    await inviteUserPage.enterIntoTextFieldEmailAddress();
    await inviteUserPage.sendInvitationButton();

  });
  Then(/^I should be display the validation error$/, async function () {
    await expect(InviteUserPage.failure_error_heading.isDisplayed()).to.eventually.be.true;
    await expect(InviteUserPage.failure_error_heading.getText())
      .to
      .eventually
      .equal(' There is a problem');
  });
  When(/^I click on back button$/, async function () {
    await headerPage.clickBack();

  });

});
