

class RegisteredAddressPage {

    constructor() {
        this.container = $('app-registered-address')

        this.addressLookupInput = $('#addressLookup #postcodeInput');
        this.findAddressBtn = element(by.xpath(`//button[contains(text(),'Find address')]`))

        this.addressListSelect = $('#selectAddress #addressList')
        this.cantEnterAddressLink = element(by.xpath(`//a[contains(text(),"I can't enter a UK postcode")]`))

        this.fieldMapping = {
            'Provide address details': $('#addressLookup'),
            'I can\'t enter a UK postcode': this.cantEnterAddressLink
        }
    }

    async inputValue(field, value) {
        switch (field) {
            case 'Provide address details':
                const addressInput = value.split(',')
                await this.selectAddress(addressInput[0].trim(), addressInput[1].trim())
                break;
            case "I can't enter a UK postcode":
                await this.cantEnterAddressLink.click()
                break;
            default:
                throw new Error(`${field} not configured in test pageObject`)
        }
    }

    async selectAddress(postcode, firstLineOdADdr){
        await this.addressLookupInput.sendKeys(postcode)
        await this.findAddressBtn.click();

        await this.addressListSelect.select(firstLineOdADdr);
    }


}

module.exports = RegisteredAddressPage 
