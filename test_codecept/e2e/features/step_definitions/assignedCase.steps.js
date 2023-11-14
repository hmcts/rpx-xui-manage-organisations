
const Header = require('../pageObjects/headerPage');
const unassignedAssignedCasesPage = require('../pageObjects/unassignedAssignedCasePage');
const reportLogger = require('../../../codeceptCommon/reportLogger');
const header = new Header();

When('I click on Assigned cases tab', async function () {
    await header.clickAssignedCases();
});


Then('I should be on display assigned cases page', async function () {
    await unassignedAssignedCasesPage.waitForPageToLoad('Assigned Cases');
});


Then('In assigned cases page, filter button {string} is displayed', async function (filterShowHideButton) {
    expect(await unassignedAssignedCasesPage.isFilterButtonDisplayed(filterShowHideButton)).to.be.true;
});

Then('In assigned cases page, filter button {string} is not displayed', async function (filterShowHideButton) {
    expect(await unassignedAssignedCasesPage.isFilterButtonDisplayed(filterShowHideButton)).to.be.false;
});

When('In assigned cases page, I click filter button {string}', async function (filterButton) {
    await unassignedAssignedCasesPage.clickFilterButton(filterButton);
});



Then('In assigned cases page, I case type tab {string} displayed', async function (caseTypeTab) {
    expect(await unassignedAssignedCasesPage.getCaseTypeTabElement(caseTypeTab).isDisplayed()).to.be.true;
});

When('In assigned cases page, I click case type tab {string}', async function (caseTypeTab) {
    await unassignedAssignedCasesPage.getCaseTypeTabElement(caseTypeTab).click();
});

Then('In assigned cases page, I see case type cases container {string}', async function (caseTypeTab) {
    expect(await unassignedAssignedCasesPage.isCaseTypeTabContainerDisplayed(caseTypeTab)).to.be.true;
});

Then('In assigned cases page, I see case list displays value', async function (datatable) {

    const datatablehashes = datatable.parse().hashes();

    for (let row of datatablehashes) {
        reportLogger.AddMessage(`Validating fields display: ${row.field} => ${row.value}`);

        await unassignedAssignedCasesPage.validateCaseListColumnDisplaysValue(row.field, row.value);
    }
});

Then('In assigned cases page, I see Manage case sharing button disabled', async function (caseid) {
    expect(await unassignedAssignedCasesPage.isManageCaseSharingutttonEnabled()).to.be.false;
});

Then('In assigned cases page, I see Manage case sharing button enabled', async function (caseid) {
    expect(await unassignedAssignedCasesPage.isManageCaseSharingutttonEnabled()).to.be.true;
});

When('In assigned cases page, I click Manage case sharing button', async function (caseid) {
    await unassignedAssignedCasesPage.manageCaseSharingButton.click();
});

When('In assigned cases page, I select case with id {string}', async function (caseid) {
    await unassignedAssignedCasesPage.selectCase(caseid);
});


