const reportLogger = require("../../../../codeceptCommon/reportLogger");

class CheckYourAnswersPage{

    constructor(){
        this.container = $('app-check-your-answers')
    }



    async isDisplayed() {
        return await this.pageContainer.isDisplayed()
    }

    async clickChangeLinkForField(field) {
        const fieldLocators = this.getRowElementLocators(field);
        const changeLinkForField = element(by.xpath(fieldLocators.changeLinkElement))
        await changeLinkForField.click();
    }

    getRowElementLocators(field) {

        let nameELement = null;
        let valueElement = null;
        let changeLinkElement = null;

        switch(field){
            case 'Regulatory organisation type':
            case 'What regulators are you (as an individual) registered with?':
                nameELement = `//dl[contains(@class,'govuk-summary-list')]//span[contains(text(),'${field}')]`;
                valueElement = `//dl[contains(@class,'govuk-summary-list')]//span[contains(text(),'${field}')]/../../dd[contains(@class,'govuk-summary-list__value')]//span`;
                changeLinkElement = `//dl[contains(@class,'govuk-summary-list')]//span[contains(text(),'${field}')]/../../dd[contains(@class,'govuk-summary-list__actions')]/a`;
                break;
            default:
                nameELement = `//div[contains(@class,'govuk-summary-list')]//dt[contains(@class,'govuk-summary-list__key')][contains(text(),'${field}')]`;
                valueElement = `//div[contains(@class,'govuk-summary-list')]//dt[contains(@class,'govuk-summary-list__key')][contains(text(),'${field}')]/../dd[contains(@class,'govuk-summary-list__value')]`;
                changeLinkElement = `//div[contains(@class,'govuk-summary-list')]//dt[contains(@class,'govuk-summary-list__key')][contains(text(),'${field}')]/../dd[contains(@class,'govuk-summary-list__actions')]/a`;
    }

        return {
            nameElement: nameELement,
            valueElement: valueElement,
            changeLinkElement: changeLinkElement
        }
    }

    async validateSummaryFieldWithValueDisplayed(field, value) {

        let fieldLevelLocators = this.getRowElementLocators(field)
        await reportLogger.AddMessage(`${JSON.stringify(fieldLevelLocators, null,2)}`);
        expect(await element(by.xpath(fieldLevelLocators.nameElement)).isDisplayed(), `field ${field} not displayed`).to.be.true
        const valuesList = value.split(',');
        for (let val of valuesList) {
            expect(await element(by.xpath(fieldLevelLocators.valueElement)).getText(), `field ${field} value ${val} not included`).includes(val.trim())
        }
        expect(await element(by.xpath(fieldLevelLocators.changeLinkElement)).isDisplayed(), `case field ${field} change link not displayed`).to.be.true
    }

    async validateSummaryFieldNotDisplayed(field) {

        let fieldLevelLocators = this.getRowElementLocators(field)
        await reportLogger.AddMessage(`${JSON.stringify(fieldLevelLocators, null, 2)}`);
        expect(await element(by.xpath(fieldLevelLocators.nameElement)).isDisplayed(), `field ${field} is displayed`).to.be.false

    }

}

module.exports = CheckYourAnswersPage

