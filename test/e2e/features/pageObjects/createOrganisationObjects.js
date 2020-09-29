'use strict';
let RadioField = require('./webdriver-components/radioField.js');
const { AMAZING_DELAY, SHORT_DELAY, MID_DELAY, LONG_DELAY } = require('../../support/constants');

var BrowserWaits = require('../../support/customWaits')

class CreateOrganisationObjects {
  constructor() {
    this.emailAddress = element(by.css("[id='emailAddress']"));
    this.password = element(by.css("[id='password']"));
    this.signinTitle = element(by.css("h1.heading-large"));
    this.signinBtn = element(by.css("input.button"));
    this.signOutlink = element(by.xpath("//a[contains(text(),'Signout')]"));
    this.failure_error_heading = element(by.css("[id='validation-error-summary-heading']"));
    this.start_button = element(by.css("app-check-your-answers button"));
    this.org_name = element(by.css("[id='orgName']"));
    this.continue_button = element(by.css("[id='createButtonContinue']"));
    this.officeAddressOne =element(by.xpath("//*[@id=\"officeAddressOne\"]"));
    this.townName = element(by.xpath("//input[@id='townOrCity']"));
    this.postcode = element(by.css("[id='postcode']"));
    this.PBAnumber1 = element(by.css("#PBAnumber1"));
    this.PBAnumber2 = element(by.css("#PBAnumber2"));
    this.DXreference = element(by.css("input[id='haveDxyes']"));
    this.DXNumber = element(by.css("[id='DXnumber']"));
    this.DXContinuee = element(by.xpath("//input[@id='createButtonContinue']"));
    this.DXexchange = element(by.css("[id='DXexchange']"));
    this.SRACheckBox = element(by.css("[id='haveSrayes']"));
    this.SRAContinuee = element(by.xpath("//input[@id='createButtonContinue']"));
    this.SRANumber = element(by.css("[id='sraNumber']"));
    this.firstName = element(by.css("[id='firstName']"));
    this.lastName = element(by.css("[id='lastName']"));
    this.emailAddr = element(by.css("#emailAddress"));
    this.submit_button = element(by.css("[class='govuk-button']"));
    this.org_success_heading = element(by.css("[class='govuk-panel__title']"))
    this.org_failure_error_heading = element(by.css("#error-summary-title"));
    this.off_address_error_heading = element(by.css("#error-summary-title"));
    this.pba_error_heading = element(by.css("#error-summary-title"));
    this.name_error_heading = element(by.css("#error-summary-title"));
    this.sra_error_heading = element(by.css("#error-summary-title"));
    this.email_error_heading = element(by.css("#error-summary-title"));

    this.checkYourAnswers = element(by.css(".govuk-check-your-answers"));

    this.registrationDetailsSubmitted = element(by.xpath("//h1[contains(text() ,'Registration details submitted')]"));

    this.backLink = element(by.css('.govuk-back-link'));
    this.alreadyRegisteredAccountHeader = element(by.css('h3.govuk-heading-m'));
    this.manageCasesAppLink = element(by.xpath('//a[contains(text(),"manage your cases")]'));
    this.manageOrgAppLink = element(by.xpath('//a[contains(text(),"manage your organisation")]'));
    this.mcWindowHandle = "";
  }
  async clickDXreferenceCheck(){
    BrowserWaits.waitForElement(this.DXContinuee); 
        // browser.sleep(AMAZING_DELAY);

      await this.DXreference.click();
    // browser.sleep(AMAZING_DELAY);
    await this.DXContinuee.click();
  }

  async clickSRAreferenceCheck(){
    BrowserWaits.waitForElement(this.SRAContinuee); 
    // browser.sleep(AMAZING_DELAY);
    await this.SRACheckBox.click();
    // browser.sleep(AMAZING_DELAY);
    await this.SRAContinuee.click();
  }

  async enterPBANumber() {
    BrowserWaits.waitForElement(this.PBAnumber1);

    var ramdomPBA = Math.floor(Math.random() * 9000000) + 1000000;
    await this.PBAnumber1.sendKeys("PBA" + ramdomPBA);

  }
  async enterPBA2Number() {
    BrowserWaits.waitForElement(this.PBAnumber2);

    var ramdomPBA2 = Math.floor(Math.random() * 9000000) + 1000000;
    await this.PBAnumber2.sendKeys("PBA" + ramdomPBA2);

  }

  async enterDXNumber() {
    BrowserWaits.waitForElement(this.DXNumber);

    var ramdomDX = Math.floor(Math.random() * 9000000000) + 1000000000;
    await this.DXNumber.sendKeys("DX " + ramdomDX);

  }

  async enterDXENumber() {
    BrowserWaits.waitForElement(this.DXexchange);

    var ramdomDX = Math.floor(Math.random() * 9000000000) + 1000000000;
    await this.DXexchange.sendKeys("DXE" + ramdomDX);

  }
  async enterSRANumber() {
    BrowserWaits.waitForElement(this.SRANumber);
 
    var ramdomSRA = Math.floor(Math.random() * 9000000000) + 1000000000;
    await this.SRANumber.sendKeys("SRA" + ramdomSRA);

  }

  async enterOrgName(testorgName) {
    BrowserWaits.waitForElement(this.org_name);
    var orgName ="AutoTest"+Math.random().toString(36).substring(2);
      //Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    global.latestOrgCreated = orgName;
    await this.org_name.sendKeys(testorgName ? testorgName : orgName);

    await browser.sleep(1000);

  }
  async enterEmailAddress(email) {
    BrowserWaits.waitForElement(this.emailAddr);
    // var emailAddress =Math.random().toString(36).substring(2)+"@mailinator.com";
    await this.emailAddr.sendKeys(email);

  }

  async waitForPage(page){
    switch(page){
      case "What's the name of your organisation?":
        await BrowserWaits.waitForElement(this.org_name);
      break;
      case "What's the address of your main office?":
        await BrowserWaits.waitForElement(this.officeAddressOne);
      break;
      case "What's your payment by account (PBA) number for your organisation?":
        await BrowserWaits.waitForElement(this.PBAnumber1);
      break;
      case "Do you have a DX reference for your main office?":
     
        await BrowserWaits.waitForElement(element(by.xpath("//h1[contains(text(),'Do you have a DX reference for your main office')]")));
      break;
      case "What's the DX reference for your main office?":
        await BrowserWaits.waitForElement(this.DXNumber);
      break;
      case "Do you have an organisation SRA ID?":
        await BrowserWaits.waitForElement(element(by.xpath("//h1[contains(text(),'Do you have an organisation SRA ID')]")));
        break;
      case "Enter your organisation SRA ID":
        await BrowserWaits.waitForElement(this.SRANumber);
      break;
      case "What's your name?":
        await BrowserWaits.waitForElement(this.lastName);
      break;
      case "What's your email address?":
        await BrowserWaits.waitForElement(this.emailAddress);
        break;
      case "Check your answers before you register":
        await BrowserWaits.waitForElement(this.checkYourAnswers);
      break;
    }
  }

  async waitForSubmission(){
    await BrowserWaits.waitForElement(this.registrationDetailsSubmitted);
 
  }

async enterAddressDetails(){
  await this.officeAddressOne.isDisplayed()
  await this.officeAddressOne.sendKeys("1, Cliffinton");

  await this.townName.sendKeys("London");
  await this.postcode.sendKeys("SE15TY");
}

async enterUserFirtandLastName(){
  await this.firstName.sendKeys("Mario");
  await this.lastName.sendKeys("Perta");
}

  async createOrganisation(orgName,email){
   ;

    await BrowserWaits.waitForElement(this.start_button);
    await this.start_button.click();

    await BrowserWaits.waitForElement(this.org_name);
    await this.enterOrgName(orgName);
    await this.continue_button.click();

    await BrowserWaits.waitForElement(this.officeAddressOne);
    await this.enterAddressDetails();
    await this.continue_button.click();

    await BrowserWaits.waitForElement(this.PBAnumber1);
    await this.enterPBANumber();
    await this.enterPBA2Number();
    await this.continue_button.click();

    await this.clickDXreferenceCheck();

    await BrowserWaits.waitForElement(this.DXNumber);
    await this.enterDXNumber();
    await this.enterDXENumber();
    await this.continue_button.click();

    await this.clickSRAreferenceCheck();

    await BrowserWaits.waitForElement(this.SRANumber);
    await this.enterSRANumber();
    await this.continue_button.click();

    await BrowserWaits.waitForElement(this.firstName);
    await this.enterUserFirtandLastName();
    await this.continue_button.click();

    await BrowserWaits.waitForElement(this.emailAddress);
    await this.enterEmailAddress(email);
    await this.continue_button.click();

    await BrowserWaits.waitForElement(this.checkYourAnswers);
    await this.submit_button.click();
    await BrowserWaits.waitForElement(this.registrationDetailsSubmitted);

    ;
  }
  async clickBackLink(){
    await BrowserWaits.waitForElement(this.backLink);
    await this.backLink.click();
  }

  async waitForStartRegisterPage(){
    await BrowserWaits.waitForElement(this.start_button);

  }

  async getAlreadyRegisteredAccountHeaderText(){
    await BrowserWaits.waitForElement(this.alreadyRegisteredAccountHeader);
    return await this.alreadyRegisteredAccountHeader.getText();
  }

  async isManageCasesLinkPresent() {
    await BrowserWaits.waitForElement(this.alreadyRegisteredAccountHeader);
    return await this.manageCasesAppLink.isPresent();
  }

  async isManageOrgLinkPresent() {
    await BrowserWaits.waitForElement(this.alreadyRegisteredAccountHeader);
    return await this.manageOrgAppLink.isPresent();
  }

  async clickAndValidateMCLink(){
    await BrowserWaits.waitForElement(this.alreadyRegisteredAccountHeader);
    this.mainWindowHandle = await browser.driver.getWindowHandle();

    await this.manageCasesAppLink.click();
    let windowHandles = await browser.driver.getAllWindowHandles();
    expect(windowHandles.length > 1).to.be.true;
    await browser.switchTo().window(windowHandles[1]);

    await browser.driver.close();
    await browser.switchTo().window(this.mainWindowHandle);
    let url = await browser.getCurrentUrl();
    expect(url.includes("xui-webapp-"));

  }

  async clickAndValidateMOLink() {
    await BrowserWaits.waitForElement(this.alreadyRegisteredAccountHeader);
    this.mainWindowHandle = await browser.driver.getWindowHandle();

    await this.manageOrgAppLink.click();
    let windowHandles = await browser.driver.getAllWindowHandles();
    expect(windowHandles.length > 1).to.be.true;
    await browser.switchTo().window(windowHandles[1]);

    await browser.driver.close();
    await browser.switchTo().window(this.mainWindowHandle);
    let url = await browser.getCurrentUrl();
    expect(url.includes("xui-webapp-"));

  }
  
}
module.exports = CreateOrganisationObjects;
