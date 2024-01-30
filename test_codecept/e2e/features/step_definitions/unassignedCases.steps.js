
const Header = require('../pageObjects/headerPage');
const unassignedAssignedCasesPage = require('../pageObjects/unassignedAssignedCasePage');
const reportLogger = require('../../../codeceptCommon/reportLogger');
const header = new Header();

When('I click on Unassigned cases tab', async function(){
    await header.clickUnassignedCases();
});


Then('I should be on display Unassigned cases page', async function () {
    await unassignedAssignedCasesPage.waitForPageToLoad('Unassigned Cases');
});

Then('In unassigned cases page, filter button {string} is displayed', async function (filterShowHideButton) {
  expect(await unassignedAssignedCasesPage.isFilterButtonDisplayed(filterShowHideButton)).to.be.true;
});

Then('In unassigned cases page, filter button {string} is not displayed', async function (filterShowHideButton) {
    expect(await unassignedAssignedCasesPage.isFilterButtonDisplayed(filterShowHideButton)).to.be.false;
});

When('In unassigned cases page, I click filter button {string}', async function(filterButton){
    await unassignedAssignedCasesPage.clickFilterButton(filterButton);
});

When('In unassigned cases page, I click apply filter button', async function () {
    await unassignedAssignedCasesPage.clickApplyFilterButton();
});

When('In unassigned cases page, I click reset filter button', async function () {
    await unassignedAssignedCasesPage.clickResetFilterButton();
});

Then('In unassigned cases page, I see error summary displayed', async function(){
    expect(await unassignedAssignedCasesPage.isErrorSummaryDisplayed()).to.be.true;
});

Then('In unassigned cases page, I see error message {string}', async function(errorMessage){
    expect(await unassignedAssignedCasesPage.getErrorSummary()).to.includes(errorMessage);
});

Then('In unassigned cases page, I case type tab {string} displayed', async function (caseTypeTab) {
    expect(await unassignedAssignedCasesPage.getCaseTypeTabElement(caseTypeTab).isDisplayed()).to.be.true;
});

When('In unassigned cases page, I click case type tab {string}', async function (caseTypeTab) {
    await unassignedAssignedCasesPage.getCaseTypeTabElement(caseTypeTab).click();
});

Then('In unassigned cases page, I see case type cases container {string}', async function (caseTypeTab) {
    expect(await unassignedAssignedCasesPage.isCaseTypeTabContainerDisplayed(caseTypeTab)).to.be.true;
});

Then('In unassigned cases page, I see case list displays value', async function (datatable) {

    const datatablehashes = datatable.parse().hashes();

    for (let row of datatablehashes) {
        reportLogger.AddMessage(`Validating fields display: ${row.field} => ${row.value}`);

        await unassignedAssignedCasesPage.validateCaseListColumnDisplaysValue(row.field, row.value);
    }
});

Then('In unassigned cases page, I select case with id {string}', async function (caseid) {
    await unassignedAssignedCasesPage.selectCase(caseid);
});

Then('In unassigned cases page, I see share case button disabled', async function (caseid) {
    expect(await unassignedAssignedCasesPage.isShareCaseButttonEnabled()).to.be.false;
});

Then('In unassigned cases page, I see share case button enabled', async function (caseid) {
    expect(await unassignedAssignedCasesPage.isShareCaseButttonEnabled()).to.be.true;
});


When('In unassigned cases page, I select case with id {string}', async function (caseid) {
    await unassignedAssignedCasesPage.selectCase(caseid);
});

When('In unassigned cases page, I click share case button', async function (caseid) {
    await unassignedAssignedCasesPage.clickShareCaseButton(caseid);
});



