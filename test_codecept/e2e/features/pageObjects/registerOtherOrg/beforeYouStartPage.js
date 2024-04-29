

class BeforeYouStartPage{

    constructor(){
        this.container = $('app-before-you-start')

        this.fieldMapping = {
            "Before you start": element(by.xpath(`//h3[contains(text(),'Before you start')]`)),
            "I've checked whether my organisation already has an account": $(`#confirmed-organisation-account`)
        }
    }

    async inputValue(field, value){
        switch(field){
            case "I've checked whether my organisation already has an account":
                await this.fieldMapping[field].click();
                break;
            default:
                throw new Error(`${field} not configured in test pageObject`)
        }
    }



}

module.exports = BeforeYouStartPage 
