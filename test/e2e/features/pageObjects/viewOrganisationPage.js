'use strict';

const { SHORT_DELAY, MID_DELAY, LONG_DELAY } = require('../../support/constants');

class viewOrganisationPage {
  constructor(){
    this.header = 'h1';

  }

  async getPageHeader(){
    return await $(this.header).getText();
  }

  async amOnPage(){
    let header = await this.getPageHeader();
    return header === 'Organisation'
  }

}
module.exports = new viewOrganisationPage;
