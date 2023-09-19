const ViewOrganisationPage = require('../pageObjects/viewOrganisationPage.js');
const browserWaits = require('../../support/customWaits.js');
const { config } = require('../../config/common.conf.js');

const registrationWorkFlow = require('../pageObjects/registerOrgWorkFlow.js')

Then('In registration workflow, I validate page {string} is displayed {string}', async function (page, isDisplayed) {
    if (isDisplayed.toLowerCase() === "true" || isDisplayed.toLowerCase() === "yes"){
        expect(await registrationWorkFlow.isPageDisplayed(page)).to.be.true

    }else{
        expect(await registrationWorkFlow.isPageDisplayed(page)).to.be.false
    }
});



Then('In registration workflow, I validate page {string}', async function (page) {
    await registrationWorkFlow.validatePage(page);
});

