

class CompanyHouseDetailsPage {

    constructor() {
        this.container = $('app-company-house-details')

        this.fieldMapping = {
            'Enter the name of the organisation': $('#company-name'),
            'Enter the 8-digit Companies House Number': $('#company-house-number')
        }
    }

    async inputValue(field, value) {
        switch (field) {
            case 'Enter the name of the organisation':
                await this.fieldMapping[field].sendKeys(value)
                break;
            case 'Enter the 8-digit Companies House Number':
                await this.fieldMapping[field].sendKeys(value)
                break;
            default:
                throw new Error(`${field} not configured in test pageObject`)
        }
    }



}

module.exports = CompanyHouseDetailsPage 
