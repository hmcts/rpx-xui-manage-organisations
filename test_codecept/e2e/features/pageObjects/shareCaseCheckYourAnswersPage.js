

class ShareCaseCheckYourAnswersPage{
    constructor(){
        this.container = $('app-exui-case-share-confirm')
        this.header = $('app-exui-case-share-confirm h1')

        this.confirmButton = element(by.xpath(`//button[contains(text(),'Confirm')]`))

        this.submissionsConfirmationPageContainer = $('app-exui-case-share-complete');
        this.submissionConfirmMessage = $('app-exui-case-share-complete h1')
    }

    async clickConfirm(){
        await this.confirmButton.click()
    }

    getCaseToSharePageObject(caseId){
        return new CaseToShare(caseId)

    }
}


class CaseToShare {
    constructor(caseId) {
        this.caseId = caseId;
        this.caseContainer = element(by.xpath(`//xuilib-selected-case-confirm//div[contains(@id,'${this.caseId}')]`))
        this.caseHeader = element(by.xpath(`//xuilib-selected-case-confirm//h2[contains(text(),'${this.caseId}')]`))

    }

    async isCaseDisplayed() {
        return await this.caseContainer.isDisplayed();
    }



    async isUserDisplayed(userFullname) {
        const user = element(by.xpath(`//xuilib-selected-case-confirm//h2[contains(text(),'${this.caseId}')]/..//td[contains(text(),'${userFullname}')]`))
        return await user.isDisplayed();
    }

    isUserEmailDisplayed(userFullname, email) {
        const emailEle = element(by.xpath(`//xuilib-selected-case-confirm//h2[contains(text(),'${this.caseId}')]/..//td[contains(text(),'${userFullname}')]/../td[contains(text(),'${email}')]`))
        return emailEle.isDisplayed()
    }

    
    async isActionsDisplayed(userFullname, status) {
        const email = element(by.xpath(`//xuilib-selected-case-confirm//h2[contains(text(),'${this.caseId}')]/..//td[contains(text(),'${userFullname}')]/../td/span[contains(@class,'hmcts-badge')]`))
        const statusText = await email.getText()
        return statusText.toLowerCase().includes(status.toLowerCase())
    }
}

module.exports = new ShareCaseCheckYourAnswersPage()
