'use strict';

const { SHORT_DELAY, MID_DELAY, LONG_DELAY } = require('../../support/constants');

function HeaderPage() {

  this.moPage = element(by.xpath("//a[contains(text(),'Manage Organisation details for civil and family law cases')]"));
  this.organisation= element(by.xpath("//a[contains(text(),'Organisationt')]"));
  this.user=element(by.xpath("//a[contains(text(),'Users')]"));
  this.inviteUser=element(by.css("[class='govuk-button hmcts-page-heading__button']"));
  this.back=element(by.xpath("//a[contains(text(),'Back')]"));
  this.signOut = element(by.xpath("//a[contains(text(),'Sign out')]"));

  this.clickMOPage = function () {
    this.moPage.click();
    browser.sleep(SHORT_DELAY);
  };
  this.clickOrganisation = function () {
    this.organisation.click();
    browser.sleep(SHORT_DELAY);
  };
  this.clickUser = function () {
    this.user.click();
    browser.sleep(SHORT_DELAY);
  };
  this.clickInviteUser = function () {
    this.inviteUser.click();
    browser.sleep(SHORT_DELAY);
  };
  this.clickBack = function () {
    this.back.click();
    browser.sleep(SHORT_DELAY);
  };
  this.clickSignOut = function () {
    this.signOut.click();
    browser.sleep(SHORT_DELAY);
  };

}

module.exports = new HeaderPage;
