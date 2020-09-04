var BrowserWaits = require('../../support/customWaits')
var {config} = require('../../config/common.conf');



class TermsAndConditionsConfirmPage{

    constructor(){
        this.accepttermsAndConditionsContainer = element(by.id('mo-tc'));
        this.confirmBtn = element(by.xpath("//*[@id = 'mo-tc']//button[contains(text(),'Confirm')]"));

        this.isFeatureEnabled = undefined;
    }

    async amOnPage(){
        try{
            await BrowserWaits.waitForElement(this.accepttermsAndConditionsContainer);
        }catch(err){
            console.log("T & C accept page not displayed after default wait time.");
        }
        return await this.accepttermsAndConditionsContainer.isPresent();
    }

    async acceptTremsAndConditions(){
        await BrowserWaits.waitForElement(this.confirmBtn);
        await this.confirmBtn.click();
    }

    async isFeatureToggleEnabled(world){
        if (this.isFeatureEnabled !== undefined){
            return this.isFeatureEnabled;
        }

        let mainWinHandle = await browser.driver.getWindowHandle()
        await browser.executeScript('window.open()');
        let winHandles = await browser.driver.getAllWindowHandles();
        await  browser.switchTo().window(winHandles[1]);
        let configPath = "external/configuration?configurationKey=feature.termsAndConditionsEnabled";
        let url = config.config.baseUrl.endsWith("/") ? config.config.baseUrl + configPath : config.config.baseUrl +"/" +configPath  
        await browser.get(url);
       
        let bodyElement = element(by.css('body pre'));
        await BrowserWaits.waitForElement(bodyElement);
        let feattureToggleStatus = await bodyElement.getText();
        let browserCurrentUtl = await browser.getCurrentUrl();
        if (world) {
            world.attach(feattureToggleStatus + " is reposne  from T&C feature status api " + browserCurrentUtl);
        }
        await browser.driver.close();
        await browser.switchTo().window(mainWinHandle);
        this.isFeatureEnabled = feattureToggleStatus.includes('true');
        return this.isFeatureEnabled ;
    }

}

module.exports =  termsAndConditionsConfirmPage = new TermsAndConditionsConfirmPage();
