'use strict';

const { SHORT_DELAY, MID_DELAY, LONG_DELAY } = require('../../support/constants');

function HeaderPage() {

  this.moPage = element(by.xpath("//a[contains(text(),'Manage Organisation details for civil and family law cases')]"));
  this.signOut = element(by.xpath("//a[contains(text(),'Sign out')]"));

  this.clickSignOut = function () {
    this.signOut.click();
    browser.sleep(SHORT_DELAY);
  };
}

module.exports = new HeaderPage;
