const browserWaits = require('../../support/customWaits')

class ShareCasesPage{
    constructor(){
        this.container = element(by.xpath(`//xuilib-share-case//h1//span[contains(text(),'Share a case')]`))

        this.emailAddressInput = element(by.xpath(`//label[contains(text(),'Enter email address')]/..//xuilib-user-select//input`))
        this.addEmailAddressButton = element(by.xpath(`//label[contains(text(),'Enter email address')]/..//button[contains(text(),'Add')]`))

        this.continueButton = element(by.xpath(`//button[contains(text(),'Continue')]`))
        this.cabcelButton = element(by.xpath(`//button[contains(text(),'Cancel')]`))

    }

    async selectUserToAdd(user){
        const ele = element(by.xpath(`//mat-option//span[contains(text(),'${user}')]`))
        await browserWaits.waitForElement(ele);
        await ele.click();
    }

    getCaseToSharePageObject(caseId){
        return new CaseToShare(caseId)
    }
}

class CaseToShare{
    constructor(caseId){
        this.caseId = caseId;
        this.caseContainer = element(by.xpath(`//xuilib-selected-case//div[contains(@id,'${this.caseId}')]`))
        this.caseHeader = element(by.xpath(`//xuilib-selected-case//div[contains(@id,'${this.caseId}')]//h3`))
        this.deselectCaseButton = element(by.xpath(`//xuilib-selected-case//div[contains(@id,'${this.caseId}')]//button[contains(text(),'Deselect case')]`))

        this.accordianSectionContent = element(by.xpath(`//xuilib-selected-case//div[contains(@id,'${this.caseId}')]//div[contains(@class,'govuk-accordion__section-content')]`))
        this.accordianSectionButton = element(by.xpath(`//xuilib-selected-case//div[contains(@id,'${this.caseId}')]//button[contains(@class,'govuk-accordion__section-button')]/span[contains(@class,'govuk-accordion__icon')]`))


    }

    async isCaseDisplayed(){
        return await this.caseContainer.isDisplayed();
    }


 
    async isUserDisplayed(userFullname){
        const isContentDisplayed = await this.accordianSectionContent.isDisplayed();
        if (!isContentDisplayed) {
            await this.accordianSectionButton.click();
        }
        const user = element(by.xpath(`//xuilib-selected-case//div[contains(@id,'${this.caseId}')]//td[contains(@id,'user-full-name')][contains(text(),'${userFullname}')]`))
        return await user.isDisplayed();
    }

    getActionLinkElement(userFullname, action){
        const ele = element(by.xpath(`//xuilib-selected-case//div[contains(@id,'${this.caseId}')]//td[contains(@id,'user-full-name')][contains(text(),'${userFullname}')]/..//a[contains(text(),'${action}')]`))
        return ele
    }

    async isActionDisplayed(userFullname, action){
        const ele = this.getActionLinkElement(userFullname, action);
        return await ele.isDisplayed();
    }

    async clickActionLink(userFullname, action){
        const ele = this.getActionLinkElement(userFullname, action);
        await ele.click();
    }

    async isStatusDisplayed(userFullname, status){
        const ele = element(by.xpath(`//xuilib-selected-case//div[contains(@id,'${this.caseId}')]//td[contains(@id,'user-full-name')][contains(text(),'${userFullname}')]/..//span[contains(@class,'hmcts-badge')]`))
        const statusText = await ele.getText()
        return statusText.toLowerCase().includes(status.toLowerCase(0))
    }
}


module.exports = new ShareCasesPage();