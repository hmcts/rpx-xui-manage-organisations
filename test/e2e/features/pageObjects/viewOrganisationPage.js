'use strict';

const { SHORT_DELAY, MID_DELAY, LONG_DELAY } = require('../../support/constants');
var BrowserWaits = require('../../support/customWaits')

class ViewOrganisationPage {
  constructor(){
    this.header = element(by.xpath("//*[contains(@class,'govuk-heading-xl') and contains(text(),'Organisation')]"));
  }

  async getPageHeader(){
    await BrowserWaits.waitForElement(this.header);
    return await this.header.getText();
  }

  async amOnPage(){

    let header = await this.getPageHeader();
    return header === 'Organisation';
  }

}
module.exports = ViewOrganisationPage;
