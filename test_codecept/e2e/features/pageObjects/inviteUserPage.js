Button = require('./webdriver-components/button.js');
TextField = require('./webdriver-components/textField.js');

const { AMAZING_DELAY, SHORT_DELAY, MID_DELAY, LONG_DELAY } = require('../../support/constants');
const BrowserWaits = require('../../support/customWaits');

class InviteUserPage{
  constructor(){
    this.header = 'h1';
    this.firstName = element(by.css('#firstName'));
    this.lastName = element(by.css('#lastName'));
    this.emailAddress = element(by.css('#email'));
    this.sendInvitationButton = element(by.css('button[type=submit]'));
    
    this.manageCasesCheckbox = element(by.css('#roles'));
    this.manageUserCheckbox = element(by.css('#pui-user-manager'));
    this.manageOrgCheckbox = element(by.css('#pui-organisation-manager'));
    this.manageCaaCheckbox = element(by.css('#pui-caa'));
    this.manageFeeAccountsCheckbox = element(by.css('#pui-finance-manager'));

    this.nextPageLink = element(by.xpath('//a[contains(text(), "Next")]'));

    this.failure_error_heading = element(by.css('#error-summary-title'));
    this.back = element(by.xpath('//a[contains(text(),\'Back\')]'));

    this.userInvitaionConfirmation = element(by.css('.govuk-panel.govuk-panel--confirmation'));

    this.spinner = element(by.css('.spinner-wrapper'));

    this.activeUser = element(by.xpath('//tbody//tr//td[contains(text(),"Active")]/../td/a'));
    this.changeLink = element(by.xpath('//a[contains(text(),"Change")]'));
    this.suspendButton = element(by.css('a.hmcts-button--secondary'));
    this.editUserText = element(by.css('.govuk-heading-xl'));
    this.suspendUserText = element(by.css('.govuk-heading-xl'));

    this.userDetailsComponent = $('xuilib-user-details')
  }

  /**
   * Enter random text into the Text field
   * @returns EUIStringField Object
   */
  async enterIntoTextFieldFirstName(value){
    await this.firstName.sendKeys(value);
  }

  async selectPermission(permission, isSelect){
    
    const normalizedPermission = permission.toLowerCase();
    if (normalizedPermission.includes('manage cases')){
      await this.manageCasesCheckbox.click()
    } else if (normalizedPermission.includes('manage users')){
      await this.manageUserCheckbox.click()
    } else if (normalizedPermission.includes('manage organisation')) {
      await this.manageOrgCheckbox.click()
    } else if (normalizedPermission.includes('case access')) {
      await this.manageCaaCheckbox.click()
    } else if (normalizedPermission.includes('fee accounts')) {
      await this.manageFeeAccountsCheckbox.click()
    }else{
      throw Error(`Invalid or unrecognised user permission ${permission}`);
    }

  }


  async findNextActiveUser(){
    await BrowserWaits.waitForElement(this.nextPageLink);
    let activeUserVisible = await this.activeUser.isDisplayed();
   
    while (!activeUserVisible) {
      console.log('Unable to find an active user, clicking next page link');
      await BrowserWaits.retryWithActionCallback(async () => {
        await BrowserWaits.waitForElement(this.nextPageLink)
      })
      activeUserVisible = await this.activeUser.isDisplayed();
    } 


  }

  /**
   * Enter random text into the Text field
   * @returns EUIStringField Object
   */
  async enterIntoTextFieldLastName(value){
    await this.lastName.sendKeys(value);
  }

  /**
   * Enter random text into the Text field
   * @returns EUIStringField Object
   */
  async enterIntoTextFieldEmailAddress(value){
    await this.emailAddress.sendKeys(value);
  }

  /**
   * Final button to cancel the case/event
   * @returns {Promise<void>}
   */
  async clickSendInvitationButton(){
    // browser.sleep(AMAZING_DELAY);
    await this.sendInvitationButton.click();
  }

  async clickBackButton(){
    // browser.sleep(AMAZING_DELAY);
    await BrowserWaits.waitForElement(this.back);
    await BrowserWaits.waitForSpinnerToDissappear();

    await this.back.click();
  }

  async getPageHeader(){
    return await $(this.header).getText();
  }

  async amOnPage(){
    const header = await this.getPageHeader();
    return header === 'Invite user';
  }

  async amOnUserConfirmationPage(){
    await BrowserWaits.waitForElement(this.userInvitaionConfirmation);

    const header = await this.getPageHeader();
    return header === 'You\'ve invited';
  }

  async waitForPage(){
    await BrowserWaits.waitForElement(this.firstName);
  }
}
module.exports = InviteUserPage;
