const BrowserWaits = require('../../support/customWaits');
const { config } = require('../../config/common.conf');

class TermsAndConditionsConfirmPage{
  constructor(){
    this.accepttermsAndConditionsContainer = element(by.id('mo-tc'));
    this.confirmBtn = element(by.xpath('//*[@id = \'mo-tc\']//button[contains(text(),\'Confirm\')]'));

    this.isFeatureEnabled = undefined;
  }

  async amOnPage(){
    try {
      await BrowserWaits.waitForElement(this.accepttermsAndConditionsContainer);
    } catch (err){
      console.log('T & C accept page not displayed after default wait time.');
    }
    return await this.accepttermsAndConditionsContainer.isPresent();
  }

  async acceptTremsAndConditions(){
    await BrowserWaits.waitForElement(this.confirmBtn);
    await this.confirmBtn.click();
  }

  async isFeatureToggleEnabled(world){
    if (this.isFeatureEnabled !== undefined){
      return this.isFeatureEnabled;
    }

    const mainWinHandle = await browser.driver.getWindowHandle();
    await browser.executeScript('window.open()');
    const winHandles = await browser.driver.getAllWindowHandles();
    await browser.switchTo().window(winHandles[1]);
    const configPath = 'external/configuration-ui';
    const url = config.config.baseUrl.endsWith('/') ? config.config.baseUrl + configPath : config.config.baseUrl +'/' +configPath;
    await browser.get(url);

    const bodyElement = element(by.css('body pre'));
    await BrowserWaits.waitForElement(bodyElement);
    const feattureToggleStatus = await bodyElement.getText();
    let termsEnabled = false;
    try {
      const parsed = JSON.parse(feattureToggleStatus);
      termsEnabled = Boolean(parsed.termsAndConditionsEnabled);
    } catch (err) {
      termsEnabled = feattureToggleStatus.includes('"termsAndConditionsEnabled": true');
    }
    const browserCurrentUtl = await browser.getCurrentUrl();
    if (world) {
      world.attach(feattureToggleStatus + ' is reposne  from T&C feature status api ' + browserCurrentUtl);
    }
    await browser.driver.close();
    await browser.switchTo().window(mainWinHandle);
    this.isFeatureEnabled = termsEnabled;
    return this.isFeatureEnabled;
  }
}

module.exports = termsAndConditionsConfirmPage = new TermsAndConditionsConfirmPage();
