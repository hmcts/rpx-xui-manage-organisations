

const shareACasePage = require('../pageObjects/shareCasePage')
const cyaPage = require('../pageObjects/shareCaseCheckYourAnswersPage')
Then('I see share case page', async function(){
    expect(await shareACasePage.container.isDisplayed()).to.be.true
})

Then('In share case page, I see email address input field', async function () {
    expect(await shareACasePage.emailAddressInput.isDisplayed()).to.be.true
})

When('In share case page, I input email address {string}', async function(email){
    await shareACasePage.emailAddressInput.sendKeys(email)
})

When('In share case page, I select user {string} from results', async function (email) {
    await shareACasePage.selectUserToAdd(email)
})

When('In share case page, I click Add user button', async function () {
    await shareACasePage.addEmailAddressButton.click()
})

Then('In share case page, I see case with id {string} listed', async function(caseId){
    const caseObj = shareACasePage.getCaseToSharePageObject(caseId)
    expect(await caseObj.isCaseDisplayed()).to.be.true
})

Then('In share case page, I validate users for case id {string}', async function (caseId, datatable) {
    const datatablehashes = datatable.parse().hashes();

        const button = await element(by.xpath(`//*[@id="govuk-accordion__section-${caseId}"]/div[1]/div[3]/div/button/span[3]/span/span[2]`));
        if (await button.isDisplayed()) {
            const buttonText = await button.getText();
            if (buttonText.trim().toLowerCase() === 'show') {
                await button.click();
            }
        }

    const caseObj = shareACasePage.getCaseToSharePageObject(caseId)
    for (const row of datatablehashes){
        const name = row.Name;
        const action = row.Action
        const status = row.Status
        expect(await caseObj.isUserDisplayed(name), `For case ${this.caseId}, user ${name} not displayed`).to.be.true
        expect(await caseObj.isActionDisplayed(name, action), `For case ${this.caseId}, action ${action} not displayed`).to.be.true
        expect(await caseObj.isStatusDisplayed(name, status), `For case ${this.caseId}, status ${status} not displayed`).to.be.true
    }
})

Then('In share case page, I validate user {string} not displayed for case id {string}', async function (user, caseId) {
    const caseObj = shareACasePage.getCaseToSharePageObject(caseId)
    expect(await caseObj.isUserDisplayed(user)).to.be.false
})

When('In share case page, I click cancel for user {string} in case {string}', async function (user, caseId) {
    const caseObj = shareACasePage.getCaseToSharePageObject(caseId)
    await caseObj.clickActionLink(user, 'Cancel')
})


When('In share case page, I click continue', async function (user, caseId) {
    await shareACasePage.continueButton.click()
})

Then('I see Share case check and confirm your selection page', async function(){
    expect(await cyaPage.container.isDisplayed()).to.be.true
})

Then('I see Share case check and confirm your selection page with header {string}', async function (headerText) {
    expect(await cyaPage.header.getText()).to.includes(headerText)
})

Then('In share case CYA page, case {string} displays users', async function (caseId, datatable) {
    const caseObj = cyaPage.getCaseToSharePageObject(caseId)

    const datatablehashes = datatable.parse().hashes();

    for (const row of datatablehashes) {
        const name = row.Name;
        const email = row.Email;
        const actions = row.Actions
        expect(await caseObj.isUserDisplayed(name), `For case ${this.caseId}, user ${name} not displayed`).to.be.true
        expect(await caseObj.isActionsDisplayed(name, actions), `For case ${this.caseId}, action ${actions} not displayed`).to.be.true
        expect(await caseObj.isUserEmailDisplayed(name, email), `For case ${this.caseId}, status ${email} not displayed`).to.be.true
    }

})


When('In Share case CYA page, I click Confirm button', async function (headerText) {
    await cyaPage.confirmButton.click()
})

Then('In share case workflow, I see share case confirmation', async function(){
    expect(await cyaPage.submissionsConfirmationPageContainer.isDisplayed()).to.be.true
})

Then('In share case workflow, I see cinfirmation message {string}', async function (message) {
    expect(await cyaPage.submissionConfirmMessage.getText()).to.includes(message)
})




// When('In share a case page, I click case type tab {string}', async function (caseTypeTab) {
//     await unassignedAssignedCasesPage.getCaseTypeTabElement(caseTypeTab).click();
// });