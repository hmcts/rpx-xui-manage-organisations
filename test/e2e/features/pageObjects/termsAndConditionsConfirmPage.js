var BrowserWaits = require('../../support/customWaits')


class TermsAndConditionsConfirmPage{

    constructor(){
        this.accepttermsAndConditionsContainer = element(by.id('mo-tc'));
        this.confirmBtn = element(by.xpath("//div[@id = 'mo-tc']//button[contains(text(),'Confirm')]"));
    }

    async amOnPage(){
        return await this.accepttermsAndConditionsContainer.isPresent();
    }

    async acceptTremsAndConditions(){
        await BrowserWaits.waitForElement(this.confirmBtn);
        await this.confirmBtn.click();
    }

}

module.exports =  termsAndConditionsConfirmPage = new TermsAndConditionsConfirmPage();