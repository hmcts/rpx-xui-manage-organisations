var BrowserWaits = require('../../support/customWaits')
const { isConstructorDeclaration } = require('typescript')

class UnassignedCasesPage{
    constructor(){
        this.headerTitle = $("h1.govuk-heading-xl");
    }

    async waitForPageToLoad(){
        await BrowserWaits.waitForElement(this.headerTitle,undefined,"Unassigned Cses Page header not displayed" );
        await BrowserWaits.waitForCondition(async () => {
            return (await this.headerTitle.getText()).includes("Unassigned cases");
        });
    }

    async amOnPage(){
        await this.waitForPageToLoad();
        return true;
    }

}

module.exports = new UnassignedCasesPage();