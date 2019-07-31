'use strict';

const { SHORT_DELAY, MID_DELAY, LONG_DELAY } = require('../../support/constants');

class ViewUserPage {

  constructor(){
    this.header= '#main-content h1';
  }

  async getPageHeader(){
    return await $(this.header).getText();
  }

  async amOnPage(){
    let header = await this.getPageHeader();
    return header === 'Sorry, there is a problem with the service'
  }
}
module.exports = ViewUserPage;
