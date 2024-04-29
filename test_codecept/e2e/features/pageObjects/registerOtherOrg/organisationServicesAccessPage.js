

class OrganisationServicesAccessPage {

    constructor() {
        this.container = $('app-organisation-services-access')

        this.fieldMapping = {
            "Which services will your organisation need to access?": element(by.xpath(`//div[contains(text(),'Select services to access')]`))
        }
    }

    async inputValue(field, value) {
        switch (field) {
            case "Which services will your organisation need to access?":
                const services = value.split(',')
                for (const service of services){
                    const ele = element(by.xpath(`//label[contains(text(),'${service.trim()}')]/../input[@name='services']`))
                    await ele.click();
                }
                
                break;
            default:
                throw new Error(`${field} not configured in test pageObject`)
        }
    }


}

module.exports = OrganisationServicesAccessPage 
