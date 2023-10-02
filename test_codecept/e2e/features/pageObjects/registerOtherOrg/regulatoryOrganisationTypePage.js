

class RegulatoryOrganisationTypePage {

    constructor() {
        this.container = $('app-regulatory-organisation-type')

     

        this.fieldMapping = {
            'Select the type of regulatory organisation': $('select[name="regulatorType"]'),
            'Enter the name of the professional body or regulator': $('input[name="regulatorName"]'),
            'Enter your organisation\'s registration number': $('input[name="organisationRegistrationNumber"]')
        }
    }

    async inputValue(field, value) {
        switch (field) {
            case 'Select the type of regulatory organisation':
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



}

module.exports = RegulatoryOrganisationTypePage 
