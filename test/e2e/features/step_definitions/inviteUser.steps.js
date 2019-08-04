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


  When(/^I click on invite user button$/, async function () {
    await viewUserPage.clickInviteUser();
  });

  Then(/^I should be on display invite user page$/, async function () {
    browser.sleep(AMAZING_DELAY);
    expect(await inviteUserPage.amOnPage()).to.be.true;
  });

  When(/^I enter mandatory fields firstname,lastname,emailaddress,permissions and click on send invitation button$/, async function () {

    await inviteUserPage.enterIntoTextFieldFirstName(TestData.firstName);
    await inviteUserPage.enterIntoTextFieldLastName(TestData.lastName);
    await inviteUserPage.enterIntoTextFieldEmailAddress(TestData.emailAddress);
    await inviteUserPage.manageUserCheckbox.click();
    browser.sleep(AMAZING_DELAY);
    await inviteUserPage.clickSendInvitationButton();

  });
  Then(/^user should be created successfuly$/, async function () {
    expect(await new InviteUserPage().amOnPage()).to.be.true;

  });
  When(/^I not enter the mandatory fields firstname,lastname,emailaddress,permissions and click on send invitation button$/, async function () {

    await inviteUserPage.enterIntoTextFieldFirstName("");
    await inviteUserPage.enterIntoTextFieldLastName("");
    await inviteUserPage.enterIntoTextFieldEmailAddress("");
    await inviteUserPage.clickSendInvitationButton();

  });
  Then(/^I should be display the validation error$/, async function () {
    await expect(inviteUserPage.failure_error_heading.isDisplayed()).to.eventually.be.true;
    await expect(inviteUserPage.failure_error_heading.getText())
      .to
      .eventually
      .equal('There is a problem');
  });
  When(/^I click on back button$/, async function () {
    browser.sleep(AMAZING_DELAY);
    await inviteUserPage.clickBackButton();

  });

});
