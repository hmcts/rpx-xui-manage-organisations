Button = require('./webdriver-components/button.js');
TextField = require('./webdriver-components/textField.js');

const { SHORT_DELAY, MID_DELAY, LONG_DELAY } = require('../../support/constants');

class inviteUserPage{

  constructor(){
    this.header = '.page .heading-h1';
    this.firstName = element(by.css("#firstName"));
    this.lastName = element(by.css("#lastName"));
    this.emailAddress = element(by.css("#email"));
    this.sendInvitationButton = new Button('button[type=submit]');
    this.failure_error_heading = element(by.css("[id='error-summary-title']"));
  }

  /**
   * Enter random text into the Text field
   * @returns EUIStringField Object
   */
  async enterIntoTextFieldFirstName(value){
    await this.firstName.sendKeys(value);
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
    await this.sendInvitationButton.click();
  }

  async getPageHeader(){
    return await $(this.header).getText();
  }

  async amOnPage(){
    let header = await this.getPageHeader();
    return header === 'Invite user'
  }
}
module.exports = new inviteUserPage;
