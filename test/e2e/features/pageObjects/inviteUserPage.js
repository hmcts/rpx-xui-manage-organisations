Button = require('./webdriver-components/button.js');
TextField = require('./webdriver-components/textField.js');

const { AMAZING_DELAY, SHORT_DELAY, MID_DELAY, LONG_DELAY } = require('../../support/constants');
var BrowserWaits = require('../../support/customWaits')

class InviteUserPage{

  constructor(){
    this.header = 'h1';
    this.firstName = element(by.css("#firstName"));
    this.lastName = element(by.css("#lastName"));
    this.emailAddress = element(by.css("#email"));
    this.sendInvitationButton = element(by.css('button[type=submit]'));
    this.manageUserCheckbox = element(by.css('#pui-user-manager'));
    this.failure_error_heading = element(by.css('#error-summary-title'));
    this.back = element(by.xpath("//a[contains(text(),'Back')]"));

    this.userInvitaionConfirmation = element(by.css(".govuk-panel.govuk-panel--confirmation"));

    this.spinner = element(by.css(".spinner-wrapper"));

  }

  /**
   * Enter random text into the Text field
   * @returns EUIStringField Object
   */
  async enterIntoTextFieldFirstName(value){
    await this.firstName.sendKeys(value);
  }

  async selectPermission(permission,isSelect){
    const permisssionCheckboxXpath = by.xpath('//div[@class = "govuk-checkboxes"]//div[contains(@class,"govuk-checkboxes__item")]/label[contains(text(),"' + permission+'")]/../input');
    
    let isSelected = await element(permisssionCheckboxXpath).isSelected();
    console.log(isSelected);

    if (isSelect !== isSelected){
      await element(permisssionCheckboxXpath).click();

    }
    isSelected = await element(permisssionCheckboxXpath).isSelected();
    assert(isSelected === isSelect, permission + " selection status is not  " + isSelect );  
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
    await BrowserWaits.waitForElementNotVisible(this.spinner);

    await this.back.click();
  }

  async getPageHeader(){
    return await $(this.header).getText();
  }

  async amOnPage(){
    let header = await this.getPageHeader();
    return header === 'Invite user';
  }

  async amOnUserConfirmationPage(){
    await BrowserWaits.waitForElement(this.userInvitaionConfirmation );

    let header = await this.getPageHeader();
    return header === "You've invited";
  }

  async waitForPage(){
    await BrowserWaits.waitForElement(this.firstName);
  }

}
module.exports = InviteUserPage;
