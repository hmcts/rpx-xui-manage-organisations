
const browserWaits = require('../../../support/customWaits')

class IndividualRegisteredWithRegulatorDetailsPage {

    constructor() {
        this.container = $('app-individual-registered-with-regulator-details')



        this.fieldMapping = {
            'Select the type of regulator': $('select[name="regulatorType"]'),
            'Enter the name of the professional body or regulator': $('input[name="regulatorName"]'),
            'Enter your organisation\'s registration number': $('input[name="organisationRegistrationNumber"]')
        }
    }

    async inputValue(field, value) {
        switch (field) {
            case 'Select the type of regulator':
                await this.waitForREgulatorTypeOption(value.trim())
                await this.fieldMapping[field].select(value.trim())
                break;
            case "Enter the name of the professional body or regulator":
            case "Enter your organisation's registration number":
                await this.fieldMapping[field].sendKeys(value.trim())
                break;
            default:
                throw new Error(`${field} not configured in test pageObject`)
        }
    }


    async waitForREgulatorTypeOption(option) {
        const ele = element(by.xpath(`//select[@name='regulatorType']//option[contains(text(),'${option}')]`))
        await browserWaits.waitForElement(ele)
    }


}

module.exports = IndividualRegisteredWithRegulatorDetailsPage 
