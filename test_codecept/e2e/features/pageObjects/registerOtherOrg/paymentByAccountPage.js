

class PaymentByAccountPage {

    constructor() {
        this.container = $('app-payment-by-account')

        this.radioYes = $('#pba-yes')
        this.radioNo = $('#pba-no')


        this.fieldMapping = {
            'Does your organisation have a payment by account number?': $("input[name='pba']")
        }
    }

    async inputValue(field, value) {
        switch (field) {
            case 'Does your organisation have a payment by account number?':
                if (value.toLowerCase().trim().includes('yes')) {
                    await this.radioYes.click()
                } else {
                    await this.radioNo.click()
                }
                break;

            default:
                throw new Error(`${field} not configured in test pageObject`)
        }
    }


}

module.exports = PaymentByAccountPage

