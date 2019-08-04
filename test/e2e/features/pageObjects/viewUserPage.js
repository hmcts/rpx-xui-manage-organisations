'use strict';

const { AMAZING_DELAY, SHORT_DELAY, MID_DELAY, LONG_DELAY } = require('../../support/constants');

class ViewUserPage {

  constructor() {
    this.header = 'h1';
    this.inviteUser = element(by.css("body main a"));
  }

  async getPageHeader() {
    return await $(this.header).getText();
  }

  async amOnPage() {
    let header = await this.getPageHeader();
    console.log("hearder:" + header);
    return header === "Users";
  }

  async clickInviteUser() {
    await this.inviteUser.click();
    browser.sleep(AMAZING_DELAY);
  }
}
module.exports = ViewUserPage;

