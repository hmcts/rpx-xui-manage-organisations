
const workflow = require('../pageObjects/registerOtherOrg/workflow')

const reportLogger = require('../../../codeceptCommon/reportLogger')
const browserWaits = require('../../support/customWaits')

function getPageObject(page) {
    const pageObj = workflow.pages[page];
    if (pageObj === null || pageObj === undefined) {
        throw Error(`page object for page not configured or miss spelled: ${page} ${Object.keys(workflow.pages)}`)
    }
    return pageObj;
}

Given('I navigate to register other org start page', async function(){
    await browser.get(`${process.env.TEST_URL}/register-org-new`)
    const ele = workflow.pages["Apply for an organisation to manage civil, family and tribunal cases"].container
    await browserWaits.waitForElement(ele)

})

When('I click start button in before you start page', async function(){
    await workflow.startBtn.click();
})

When('I click continue in register other org workflow', async function () {
    await workflow.continueBtn.click();
})

Then('I am on register other org page {string}', async function (page) {
    const pageObj = getPageObject(page);
    await browserWaits.waitForElement(pageObj.container)
    expect(await pageObj.container.isDisplayed(), `${page} not displayed`).to.be.true
})

Then('In register other org page {string}, I validate fields displayed', async function (page, datatable) {
    const datatablehashes = datatable.parse().hashes();
    const pageObj = getPageObject(page);

    reportLogger.AddMessage(`Validating fields display:`)
    for (let row of datatablehashes) {
        if (!Object.keys(pageObj.fieldMapping).includes(row.field)){
            throw new Error(`${row.field} not configured for page ${page}`)
        }
        expect(await pageObj.fieldMapping[row.field].isDisplayed(), `${row.field} not displayed`).to.be.true
        reportLogger.AddMessage(`${row.name} is displayed`)
    }

})

Then('In register other org page {string}, I validate fields not displayed', async function (page, datatable) {
    const datatablehashes = datatable.parse().hashes();
    const pageObj = getPageObject(page);
    for (let row of datatablehashes) {
        expect(await pageObj.fieldMapping[row.field].isDisplayed(), `${row.field} is displayed`).to.be.false
        reportLogger.AddMessage(`${row.field} is not displayed`)
    }
})


When('In register other org page {string}, I input values', async function (page, datatable) {
    const datatablehashes = datatable.parse().hashes();
    const pageObj = getPageObject(page);

    for (const row of datatablehashes) {
        await pageObj.inputValue(row.field, row.value);
        reportLogger.AddMessage(`Done: ${row.field} input ${row.value}`)
    }
})


When('In register other org work flow, I click submit request', async function (page, datatable) {
    await workflow.clickSubmitRequest()
})



Then('In register other org workflow, I validate check yoor answers displayed', async function (datatable) {
    const datatableHash = datatable.parse().hashes();
    for (let row of datatableHash) {
        reportLogger.AddMessage(`Validating ${row.section} => ${row.field}=${row.value}`)
        await workflow.pages["Check your answers before sending your request"].validateSummaryFieldWithValueDisplayed(row.section, row.field, row.value)
    }
})

When('In register other org work flow, I click back link', async function () {
    await workflow.backLink.click();
})


When('In register other org check your answers page, I click change link for field {string}', async function (field) {
    await workflow.pages['Check your answers before sending your request'].clickChangeLinkForField(field)
})




