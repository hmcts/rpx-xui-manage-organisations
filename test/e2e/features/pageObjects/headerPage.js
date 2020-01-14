'use strict';

const { AMAZING_DELAY, SHORT_DELAY, MID_DELAY, LONG_DELAY } = require('../../support/constants');
var BrowserWaits = require('../../support/customWaits')

class HeaderPage {

  constructor() {
    this.moPage = element(by.xpath("//a[contains(text(),'Manage Organisation details for civil and family law cases')]"));

    this.organisation = element(by.xpath("//*[contains(@class, 'hmcts-primary-navigation__link') and text() = 'Organisation']"));
    this.user = element(by.xpath("//*[contains(@class, 'hmcts-primary-navigation__link') and text() = 'Users']"));
    this.feeAccounts = element(by.xpath("//*[contains(@class, 'hmcts-primary-navigation__link') and text() = 'Fee Accounts']"));


    this.inviteUser = element(by.css("[class='govuk-button hmcts-page-heading__button']"));
    this.back = element(by.xpath("//a[contains(text(),'Back')]"));
    this.signOut = element(by.xpath("//a[contains(text(),'Sign out')]"));

    this.spinner = element(by.css(".spinner-wrapper"));
  }

  async isHeaderTabPresent(displayText){
    return await element(by.xpath("//*[contains(@class, 'hmcts-primary-navigation__link') and text() = '" + displayText+"']")).isPresent();
  }

  async clickUser(){
    await BrowserWaits.waitForElementNotVisible(this.spinner);
    await BrowserWaits.waitForElement(this.user);
    await BrowserWaits.waitForElementClickable(this.user);
    await this.user.click();
    // browser.sleep(AMAZING_DELAY);
  }



}
module.exports = HeaderPage;
