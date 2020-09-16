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

 async isPrimaryNavigationTabDisplayed(){
   return await this.hmctsPrimaryNavigation.isPresent();
  }

  async isHeaderTabPresent(displayText){
    await this.waitForPrimaryNavigationToDisplay();
    return await element(by.xpath("//*[contains(@class, 'hmcts-primary-navigation__link') and text() = '" + displayText+"']")).isPresent();
  }

  async getHeaderTabs() {
    await this.waitForPrimaryNavigationToDisplay();
    let headerTabs = $$(".hmcts-primary-navigation__link");
    let headersCount = await headerTabs.count();
    let headerTexts = []; 
    for(let i = 0; i< headersCount; i++){
      headerTexts.push(await (await headerTabs.get(i)).getText());
    } 
    return headerTexts;
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
    // await this.waitForSpinnerNotPresent();

    await BrowserWaits.waitForCondition(async () => {
      const isSpinnerPresent = await this.spinner.isPresent();
      return !isSpinnerPresent;
    });
    await BrowserWaits.waitForElement(this.user);
    await this.clickHeaderTab(this.user);
  }


  async clickOrganisation() {
    await BrowserWaits.waitForCondition( async () => {
      const isSpinnerPresent = await this.spinner.isPresent();
      console.log("Spinner present status : " + isSpinnerPresent);
      return !isSpinnerPresent;
    });
    await BrowserWaits.waitForElement(this.organisation);
    await this.clickHeaderTab(this.organisation);
    // browser.sleep(AMAZING_DELAY);
  }


  async clickHeaderTab(tabElement) {
    let clickSuccess = false;
    let counter = 0;
    while (!clickSuccess && counter < 5) {
      try {
        await tabElement.click();
        clickSuccess = true;
      }
      catch (err) {
        counter++;
    browser.sleep(SHORT_DELAY);
        console.log("Error clicking element : " + err);
      }
    }

  }

  async clickHeaderTabWithtext(headerText){
    let headerElement = element(by.xpath("//*[contains(@class, 'hmcts-primary-navigation__link') and text() = '" + headerText+"']"));
    await this.clickHeaderTab(headerElement);
  }

 
  async waitForSpinnerNotPresent(){
    await BrowserWaits.waitForElementNotVisible(this.spinner, 60000);

  }



}
module.exports = HeaderPage;
