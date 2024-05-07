
const browserWaits = require('../../../support/customWaits')
class ContactDetailsPage {

    constructor() {
        this.container = $('app-contact-details')

        this.fieldMapping = {
            'First name': $("#first-name"),
            'Last name': $('#last-name'),
            "Enter your work email address": $('#work-email-address')
        }
    }

    async inputValue(field, value) {
        switch (field) {
            case 'First name':
            case 'Last name':
            case 'Enter your work email address':
                await browserWaits.waitForElement(this.fieldMapping[field])
                await this.fieldMapping[field].sendKeys(value)
                break;

            default:
                throw new Error(`${field} not configured in test pageObject`)
        }
    }


}

module.exports = ContactDetailsPage

