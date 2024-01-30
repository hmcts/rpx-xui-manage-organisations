const BrowserWaits = require('../../support/customWaits');

class UnassignedAssignedCasesPage{
  constructor(){
    this.headerTitle = $('h1.govuk-heading-xl');
    this.filterContainer = $('app-caa-filter')

    this.searchUnassignedCaseInput = element(by.xpath(`//h2[contains(text(),'Search for an unassigned case')]/../div/input`))
    this.filterApplyButton = element(by.xpath(`//button[contains(text(),'Apply filter')]`))
    this.filterResetButton = element(by.xpath(`//button[contains(text(),'Reset')]`))

    this.shareCaseButton = element(by.xpath(`//button[contains(text(),'Share case')]`))

    this.manageCaseSharingButton = element(by.xpath(`//button[contains(text(),'Manage case sharing')]`))


    this.errorSummary = $('.govuk-error-summary__body')

  }

  async isFilterContainerDisplayed(){
    return this.filterContainer.isDisplayed()
  }

  getFilterButtonElement(action){
    return element(by.xpath(`//app-caa-cases-component//button[contains(text(),'${action}')]`))
  }

  getCaseTypeTabElement(tab){
    return element(by.xpath(`//div[contains(@class,'mat-tab-label-content')][contains(text(),'${tab}')]`))
  }

  isCaseTypeTabContainerDisplayed(tab){
    const ele = element(by.xpath(`//mat-tab-body//strong[contains(text(),'${tab}')]`))
    return ele.isDisplayed();
  }

  async isFilterButtonDisplayed(action){
    return await this.getFilterButtonElement(action).isDisplayed()
  }

  async clickFilterButton(action){
    await this.getFilterButtonElement(action).click()
  }

  async enterSearchCaseInput(caseId){
    await this.searchUnassignedCaseInput.sendKeys(caseId)
  }

  async clickApplyFilterButton(){
    await this.filterApplyButton.click()
  }

  async clickResetFilterButton() {
    await this.filterResetButton.click()
  }

  async isErrorSummaryDisplayed() {
    return this.errorSummary.isDisplayed();
  }

  async getErrorSummary(){
    return this.errorSummary.getText();
  }

  async waitForPageToLoad(pageheaderText){
    await BrowserWaits.waitForElement(this.headerTitle, undefined, `${pageheaderText} Page header not displayed`);
    await BrowserWaits.waitForCondition(async () => {
      return (await this.headerTitle.getText()).includes(pageheaderText);
    });
  }


  async amOnPage(){
    await this.waitForPageToLoad();
    return true;
  }


  async validateCaseListColumnDisplaysValue(field, value){
    const column = element(by.xpath(`//th[contains(@class,'govuk-table__header')][contains(text(),'${field}')]`))
    const colvalue = element(by.xpath(`//td[contains(@class,'govuk-table__cell')][contains(text(),'${value}')]`))
    expect(await column.isDisplayed()).to.be.true
    expect(await colvalue.isDisplayed()).to.be.true

  }

  async selectCase(caseid){
    const ele = element(by.xpath(`//th//input[contains(@id,'${caseid}')]`))
    await ele.click()
  }

  async isShareCaseButttonEnabled(){
    const attr =  await this.shareCaseButton.getAttribute('disabled')
    return attr === null
  }

  async isManageCaseSharingutttonEnabled() {
    const attr = await this.manageCaseSharingButton.getAttribute('disabled')
    return attr === null
  }

  async clickShareCaseButton(){
    await this.shareCaseButton.click()
  }

  async clickManageCaseSharingButton() {
    await this.manageCaseSharingButton.click()
  }


}

class AssignedCasesFilter{
  constructor(){

  }


}

module.exports = new UnassignedAssignedCasesPage();
