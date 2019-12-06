'use strict';

const { AMAZING_DELAY, SHORT_DELAY, MID_DELAY, LONG_DELAY } = require('../../support/constants');
class HeaderPage {

  constructor() {
    this.moPage = element(by.xpath("//a[contains(text(),'Manage Organisation details for civil and family law cases')]"));
    this.organisation = element(by.xpath("//a[contains(text(),'Organisationt')]"));
    this.user = element(by.xpath("//li/a[contains(text(),'Users')]"));
    this.inviteUser = element(by.css("[class='govuk-button hmcts-page-heading__button']"));
    this.back = element(by.xpath("//a[contains(text(),'Back')]"));
    this.signOut = element(by.xpath("//a[contains(text(),'Sign out')]"));
  }

  async clickUser(){
    await this.user.click();
    browser.sleep(AMAZING_DELAY);
  }



}
module.exports = HeaderPage;
