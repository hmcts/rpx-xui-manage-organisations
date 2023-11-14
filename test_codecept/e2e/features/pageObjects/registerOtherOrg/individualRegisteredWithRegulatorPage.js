

class IndividualRegisteredWithRegulatorPage {

    constructor() {
        this.container = $('app-individual-registered-with-regulator')

        this.radioYes = $('#registered-with-regulator-yes')
        this.radioNo = $('#registered-with-regulator-no')


        this.fieldMapping = {
            'Are you (as an individual) registered with a regulator?': $("input[name='registeredWithRegulator']")
        }
    }

    async inputValue(field, value) {
        switch (field) {
            case 'Are you (as an individual) registered with a regulator?':
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

module.exports = IndividualRegisteredWithRegulatorPage

