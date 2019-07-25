'use strict';

const { SHORT_DELAY, MID_DELAY, LONG_DELAY } = require('../../support/constants');

class viewUserPage {

  constructor(){
    this.header = '.page .heading-h1';

  }

  async getPageHeader(){
    return await $(this.header).getText();
  }

  async amOnPage(){
    let header = await this.getPageHeader();
    return header === 'Users'
  }
}
module.exports = new viewUserPage;
