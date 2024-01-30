

class DocumentExchangeReferenceDetailsPage {

    constructor() {
        this.container = $('app-document-exchange-reference-details')

    

        this.fieldMapping = {
            'DX number': $("#dx-number"),
            'DX exchange': $('#dx-exchange')
        }
    }

    async inputValue(field, value) {
        switch (field) {
            case 'DX number':
            case 'DX exchange':
                await this.fieldMapping[field].sendKeys(value)
                break;

            default:
                throw new Error(`${field} not configured in test pageObject`)
        }
    }


}

module.exports = DocumentExchangeReferenceDetailsPage

