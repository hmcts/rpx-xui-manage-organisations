
const registerOrgWorkflow = require('../pageObjects/registerOrgWorkFlow')

function getPageObject(page) {
    const pageObj = registerOrgWorkflow.pages[page];
    if (pageObj === null || pageObj === undefined) {
        throw Error(`page object for page not configured or miss spelled: ${page} ${Object.keys(registerOrgWorkflow.pages)}`)
    }
    return pageObj;
}

When('I click continue in register organisation workflow', async function () {
    await registerOrgWorkflow.continueBtn.click();
})

Then('I am on register organisation page {string}', async function (page) {
    expect(await getPageObject(page).isDisplayed(), `${page} not displayed`).to.be.true
})

Then('In register organisation page {string}, I validate fields displayed', async function (page, datatable) {
    const datatablehashes = datatable.parse().hashes();
    const pageObj = getPageObject(page);
    for (let row of datatablehashes) {
        expect(await pageObj.fieldMapping[row.name].isDisplayed(), `${row.name} not displayed`).to.be.true
        
    }

})

Then('In register organisation page {string}, I validate fields not displayed', async function (page, datatable) {
    const datatablehashes = datatable.parse().hashes();
    const pageObj = getPageObject(page);
    for (let row of datatablehashes) {
        expect(await pageObj.fieldMapping[row.name].isDisplayed(), `${row.name} is displayed`).to.be.false
    }
})


When('In register organisation page {string}, I input values', async function (page, datatable) {
    const datatablehashes = datatable.parse().hashes();
    const pageObj = getPageObject(page);

    for (const row of datatablehashes) {
        await pageObj.inputValue(row.field, row.value);

    }
})


