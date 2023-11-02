

class PaymentByAccountDetailsPage {

    constructor() {
        this.container = $('app-payment-by-account-details')

        this.fieldMapping = {
            'PBA number': $("input#pba-number-0")
        }
    }

    async inputValue(field, value) {
        switch (field) {
            case 'PBA number':
                const pbaList = value.split(',')

                let pbaCounter = 0;
                for (const pba of pbaList){
                    if (pbaCounter !== 0){
                        const addAnotherBtn = element(by.xpath(`//button[contains(text(),'Add another PBA number')]`))
                        await addAnotherBtn.click()
                    }
                    const ele = $(`input#pba-number-${pbaCounter}`)
                    await ele.sendKeys(pba.trim())
                    pbaCounter++;
                }
                break;

            default:
                throw new Error(`${field} not configured in test pageObject`)
        }
    }


}

module.exports = PaymentByAccountDetailsPage

