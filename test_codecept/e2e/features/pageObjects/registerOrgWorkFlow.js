const { timeStamp } = require("console");

class RegsiterOrgWorkFlow{
    constructor(){

        this.continueBtn = $('');
        this.previoudBtn = $('');
        this.cancelLink = $('');
        this.backLink = $('');

        this.pages = {
            "Before you start": new BeforeYouStartPage(),
            "": new OrganisationTypePage(),
            "": new RegulatoryOrganisationTypePage(),
            "": new CompanyHouseDetailsComponent(),
            "": new DocumentExchangeReferencePage(),
            "": new DocumentExchangeReferenceDetailsPage(),
            "": new OfficeAddressPage(),
            "": new OrganisationServicesPage(),
            "": new PaymentByAccountPage(),
            "": new PaymentByAccountDetailsPage(),
            "": new RegisteredAddressPage(),
            "": new RegisteredAddressPage(),
            "": new RegisteredRegulatorPage(),
            "": new RegisteredWithRegulatorPage(),
            "": new ContactDetailsPage(),
            "": new RegistrationSubmittedPage(),
            "": new CheckYourAnswersPage()
        }
    }

    async clickContinueBtn() {
        this.continueBtn.click();
    }

    async clickPreviousBtn() {
        this.previoudBtn.click()
    }

    async clickCancelLink() {
        this.cancelLink.click()
    }

    async clickBackLink() {
        this.backLink.click()
    }

    getWorkflowPageObject(page){
        let pageObject = this.pages[page];
        if (pageObject === null || pageObject === undefined){
            throw new Error(`test error: Page object ${page} is not found in workflow. `)
        }

        return pageObject;
    }

    async isPageDisplayed(page){
        const pageObject = this.getWorkflowPageObject(page);
        return await pageObject.container.isDisplayed();
    }

    async validatePage(page){
        const pageObject = this.getWorkflowPageObject(page);
        await pageObject.validatePage();
    }
}


class BeforeYouStartPage{
    constructor(){
        this.checkbox = $('');

        this.fieldMapping = {

        }
    }

    async inputValue(field, value){

    }


}


class OrganisationTypePage {
    constructor() {
        this.container = $('');

        this.fieldMapping = {

        }
    }

    async inputValue(field, value) {

    }

   
}

class RegulatoryOrganisationTypePage {
    constructor() {
        this.container = $('');
        this.fieldMapping = {

        }
    }

    async inputValue(field, value) {

    }

}

class CompanyHouseDetailsComponent{
    constructor() {
        this.container = $('');
        this.fieldMapping = {

        }
    }

    async inputValue(field, value) {

    }

   
}

class DocumentExchangeReferencePage{
    constructor() {
        this.container = $('');
        this.fieldMapping = {

        }
    }

    async inputValue(field, value) {

    }

   
}

class DocumentExchangeReferenceDetailsPage {
    constructor() {
        this.container = $('');
        this.fieldMapping = {

        }
    }

    async inputValue(field, value) {

    }

   
}

class OfficeAddressPage{
    constructor() {
        this.container = $('');
        this.fieldMapping = {

        }
    }

    async inputValue(field, value) {

    }

}

class OrganisationServicesPage{
    constructor() {
        this.container = $('');
        this.fieldMapping = {

        }
    }

    async inputValue(field, value) {

    }

  
}

class PaymentByAccountPage{
    constructor() {
        this.container = $('');
        this.fieldMapping = {

        }
    }

    async inputValue(field, value) {

    }

}

class PaymentByAccountDetailsPage{
    constructor() {
        this.container = $('');
        this.fieldMapping = {

        }
    }

    async inputValue(field, value) {

    }

   
}

class RegisteredAddressPage{
    constructor() {
        this.container = $('');
        this.fieldMapping = {

        }
    }

    async inputValue(field, value) {

    }

}

class RegisteredRegulatorPage{
    constructor() {
        this.container = $('');
        this.fieldMapping = {

        }
    }

    async inputValue(field, value) {

    }

  
}

class RegisteredWithRegulatorPage{
    constructor() {
        this.container = $('');
        this.fieldMapping = {

        }
    }

    async inputValue(field, value) {

    }

 
}

class ContactDetailsPage{
    constructor() {
        this.container = $('');
        this.fieldMapping = {

        }
    }

    async inputValue(field, value) {

    }

   
}

class RegistrationSubmittedPage{
    constructor() {
        this.container = $('');
    }

    async enterDetails(detailsObj) {

    }

  
}

class CheckYourAnswersPage{
    constructor() {
        this.container = $('');
        this.fieldMapping = {

        }
    }

    async inputValue(field, value) {

    }

   
}


module.exports = new RegsiterOrgWorkFlow()

