

class OrganisationTypePage {

    constructor() {
        this.container = $('app-organisation-type')

        this.fieldMapping = {
            "Select the type of organisation": element(by.xpath(`//h1[contains(text(),'Select the type of organisation')]`))
        }
    }

    async inputValue(field, value) {
        switch (field) {
            case "Select the type of organisation":
                const ele = element(by.xpath(`//label[contains(text(),'${value}')]/../input`))
                await ele.click();
                break;
            default:
                throw new Error(`${field} not configured in test pageObject`)
        }
    }


}

module.exports = OrganisationTypePage 
