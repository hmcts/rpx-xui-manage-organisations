'use strict';

const { SHORT_DELAY, MID_DELAY, LONG_DELAY } = require('../../support/constants');

class ViewOrganisationPage {
  constructor(){
    //this.header= element(by.xpath("//h1[@class='govuk-heading-xl']"));
    this.header= '#content h1';
  }

  async getPageHeader(){
    console.log("header:" + $(this.header).getText());
    return await $(this.header).getText();
  }

  async amOnPage(){
    let header = await this.getPageHeader();
    return header === 'Organisation';
  }

}
module.exports = ViewOrganisationPage;
