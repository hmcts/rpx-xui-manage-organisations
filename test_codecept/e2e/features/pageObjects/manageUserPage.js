const { element, by, ElementFinder } = require('protractor');
const BrowserWaits = require('../../support/customWaits');

class ManageUserPage {
  constructor() {
    this.header = 'h1';
    this.firstName = element(by.css('#firstName'));
    this.lastName = element(by.css('#lastName'));
    this.emailAddress = element(by.css('#email'));

    this.submitButton = element(by.css('#saveUserBtn'));
    this.back = element(by.xpath('//a[contains(text(),\'Back\')]'));
    this.cancelButton = element(by.xpath('//a[contains(text(),\'Cancel\')]'));

    this.manageCaaCheckbox = element(by.css('#isCaseAccessAdmin'));
    this.manageOrgCheckbox = element(by.css('#isPuiOrganisationManager'));
    this.manageUserCheckbox = element(by.css('#isPuiUserManager'));
    this.manageFeeAccountsCheckbox = element(by.css('#isPuiFinanceManager'));

    this.manageCasesForOrganisationCheckbox = element(by.css('#enableCaseManagement'));
  }

  async selectPermission(permission, isSelect){
    const normalizedPermission = permission.toLowerCase();
    if (normalizedPermission.includes('manage cases for your organisation')){
    // get if the checkbox is checked
      await this.setCheckbox(this.manageCasesForOrganisationCheckbox, isSelect);
    } else if (normalizedPermission.includes('manage users')){
      await this.setCheckbox(this.manageUserCheckbox, isSelect);
    } else if (normalizedPermission.includes('manage organisation')) {
      await this.setCheckbox(this.manageOrgCheckbox, isSelect);
    } else if (normalizedPermission.includes('case access administrator')) {
      await this.setCheckbox(this.manageCaaCheckbox, isSelect);
    } else if (normalizedPermission.includes('manage fee accounts')) {
      await this.setCheckbox(this.manageFeeAccountsCheckbox, isSelect);
    } else {
      throw Error(`Invalid or unrecognised user permission ${permission}`);
    }
  }

  async selectAccessType(accessTypeDescription){
    // need to ensure the case access for org permission is chcked first
    await this.setCheckbox(this.manageCasesForOrganisationCheckbox, true);
    const checkbox = element(by.xpath(`//label[normalize-space()='${accessTypeDescription}']/preceding-sibling::input`));
    await this.setCheckbox(checkbox, true);
  }

  async setCheckbox(checkbox, isSelect) {
    const selected = await checkbox.isSelected();
    if (selected !== isSelect) {
      return checkbox.click();
    }
  }

  async clickBackButton(){
    await BrowserWaits.waitForElement(this.back);
    await BrowserWaits.waitForSpinnerToDissappear();

    await this.back.click();
  }
}

module.exports = ManageUserPage;
