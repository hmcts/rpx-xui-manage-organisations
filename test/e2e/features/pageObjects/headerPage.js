'use strict';

const { AMAZING_DELAY, SHORT_DELAY, MID_DELAY, LONG_DELAY } = require('../../support/constants');
var BrowserWaits = require('../../support/customWaits')

class HeaderPage {

  constructor() {
    this.moPage = element(by.xpath("//a[contains(text(),'Manage organisation details for civil, family, and tribunal law cases')]"));

    this.hmctsPrimaryNavigation = element(by.css(".hmcts-primary-navigation"));

    this.organisation = element(by.xpath("//*[contains(@class, 'hmcts-primary-navigation__link') and text() = 'Organisation']"));
    this.user = element(by.xpath("//*[contains(@class, 'hmcts-primary-navigation__link') and text() = 'Users']"));
    this.feeAccounts = element(by.xpath("//*[contains(@class, 'hmcts-primary-navigation__link') and text() = 'Fee Accounts']"));


    this.inviteUser = element(by.css("[class='govuk-button hmcts-page-heading__button']"));
    this.back = element(by.xpath("//a[contains(text(),'Back')]"));
    this.signOut = element(by.xpath("//a[contains(text(),'Sign out')]"));

    this.spinner = element(by.css(".spinner-wrapper"));
  }

  async waitForPrimaryNavigationToDisplay(){
    await BrowserWaits.waitForElement(this.hmctsPrimaryNavigation);
 
  }

  async isHeaderTabPresent(displayText){
    return await element(by.xpath("//*[contains(@class, 'hmcts-primary-navigation__link') and text() = '" + displayText+"']")).isPresent();
  }

  async validateNavigationTabDisplayed(datatable){
    let navTabs = datatable.hashes();

    console.log("bavigation tab databale : "+JSON.stringify(navTabs));

    for(let tabCounter = 0; tabCounter < navTabs.length; tabCounter++){
      let isNavTabPresent = await this.isHeaderTabPresent(navTabs[tabCounter].NavigationTab); 
      assert(isNavTabPresent, "Navigation Tab is not displayed/present : " + navTabs[tabCounter].NavigationTab);
    }
  }

  async clickUser(){
    await this.waitForSpinnerNotPresent();
    await BrowserWaits.waitForElementNotVisible(this.spinner);
    await BrowserWaits.waitForElement(this.user);
    await BrowserWaits.waitForElementClickable(this.user);
    await this.user.click();
    // browser.sleep(AMAZING_DELAY);
  }

  async clickOrganisation() {
    await this.waitForSpinnerNotPresent();
    await BrowserWaits.waitForElementNotVisible(this.spinner);
    await BrowserWaits.waitForElement(this.organisation);
    await BrowserWaits.waitForElementClickable(this.organisation);
    await this.organisation.click();
    // browser.sleep(AMAZING_DELAY);
  }

  async waitForSpinnerNotPresent(){
    await BrowserWaits.waitForElementNotVisible(element(by.css('div.spinner-wrapper')), 60000);

  }



}
module.exports = HeaderPage;
