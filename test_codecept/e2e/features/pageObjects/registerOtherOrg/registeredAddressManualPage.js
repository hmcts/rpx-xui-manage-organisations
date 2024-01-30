

class RegisteredAddressManualPage {

    constructor() {
        this.container = element(by.xpath(`//app-registered-address//h1[contains(text(),'Is this a UK address?')]`))

        this.ukAddressradioInput = $(`input[name='ukAddress']`)

        this.fieldMapping = {
            "Is this a UK address?": $('xuilib-write-address-field'),
            "Enter address details": $('xuilib-write-address-inputs')
        }
    }

    async inputValue(field, value) {
        switch (field) {
            case "Is this a UK address?":
                const ele = element(by.xpath(`//xuilib-write-address-field//label[contains(text(),'${value.trim()}')]/../input`))
                await ele.click();
                break;
            case "Building and Street":
            case "Address line 2":
            case "Address line 3":
            case "Town or City":
            case "County/ State/ Province":
            case "Country":
            case "County":
            case "Postcode":
                await this.enterAddressInput(field, value)
                break;
            default:
                throw new Error(`${field} not configured in test pageObject`)
        }
    }

    async enterAddressInput(field, value){
        const ele = element(by.xpath(`//xuilib-write-address-inputs//label[contains(text(),'${field}')]/../input`))
        await ele.sendKeys(value)
    }


}

module.exports = RegisteredAddressManualPage 

