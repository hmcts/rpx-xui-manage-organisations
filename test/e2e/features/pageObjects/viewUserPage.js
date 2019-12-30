'use strict';

const { AMAZING_DELAY, SHORT_DELAY, MID_DELAY, LONG_DELAY } = require('../../support/constants');
var BrowserWaits = require('../../support/customWaits')

class ViewUserPage {

  constructor() {
    this.header = 'h1';
    this.inviteUser = element(by.xpath("//*[contains(@class,'govuk-button') and contains(text(),'Invite user')]"));

    this.header = element(by.xpath("//h1[text() = 'Users']"));
    this.spinner = element(by.css(".spinner-wrapper"));

    this.userstable = element(by.css('table'))

  }

  async getPageHeader() {
    return await $(this.header).getText();
  }

  async amOnPage() {
    // browser.sleep(LONG_DELAY);
    await BrowserWaits.waitForElement(this.header);
    // let header = await this.getPageHeader();
    return true;
    // browser.sleep(LONG_DELAY);
  }

  async clickInviteUser() {
    await BrowserWaits.waitForElementNotVisible(this.spinner);
    await BrowserWaits.waitForElement(this.userstable);

    await BrowserWaits.waitForElementClickable(this.inviteUser);


    await this.inviteUser.click();
    // browser.sleep(AMAZING_DELAY);
  }
}
module.exports = ViewUserPage;

