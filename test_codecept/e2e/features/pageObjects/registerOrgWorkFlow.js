const { timeStamp } = require("console");

class RegsiterOrgWorkFlow{
    constructor(){

        this.continueBtn = $('');
        this.previoudBtn = $('');
        this.cancelLink = $('');
        this.backLink = $('');

        this.beforeYouStartPage = new BeforeYouStartPage()
        this.organisationTypePage = new OrganisationTypePage()
        this.regulatoryOrganisationTypePage = new RegulatoryOrganisationTypePage()
        this.companyHouseDetailsComponent = new CompanyHouseDetailsComponent()
        this.documentExchangeReferencePage = new DocumentExchangeReferencePage()
        this.documentExchangeReferenceDetailsPage = new DocumentExchangeReferenceDetailsPage()
        this.officeAddressPage = new OfficeAddressPage()
        this.organisationServicesPage = new OrganisationServicesPage();
        this.paymentByAccountPage = new PaymentByAccountPage();
        this.paymentByAccountDetailsPage = new PaymentByAccountDetailsPage()

        this.registeredAddressPage = new RegisteredAddressPage();
        this.registeredRegulatorPage = new RegisteredRegulatorPage();
        this.registeredWithRegulatorPage = new RegisteredWithRegulatorPage()
        this.contactDetailsPage = new ContactDetailsPage()
        this.registrationSubmittedPage = new RegistrationSubmittedPage();
        this.checkYourAnswersPage = new CheckYourAnswersPage();
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
        let pageObject = null;

        switch(page){
            case 'Before you start':
                pageObject = this.beforeYouStartPage;
                break;
            
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
    }

    async enterDetails(detailsObj){
        await this.checkbox.click()
    }

    async validatePage(){
        
    }



}


class OrganisationTypePage {
    constructor() {
        this.container = $('');
    }

    async enterDetails(detailsObj) {

    }
   
}

class RegulatoryOrganisationTypePage {
    constructor() {
        this.container = $('');
    }

    async enterDetails(detailsObj) {

    }

   
}

class CompanyHouseDetailsComponent{
    constructor() {
        this.container = $('');
    }

    async enterDetails(detailsObj) {

    }

   
}

class DocumentExchangeReferencePage{
    constructor() {
        this.container = $('');
    }

    async enterDetails(detailsObj) {

    }

   
}

class DocumentExchangeReferenceDetailsPage {
    constructor() {
        this.container = $('');
    }

    async enterDetails(detailsObj) {

    }

   
}

class OfficeAddressPage{
    constructor() {
        this.container = $('');
    }

    async enterDetails(detailsObj) {

    }

}

class OrganisationServicesPage{
    constructor() {
        this.container = $('');
    }

    async enterDetails(detailsObj) {

    }

  
}

class PaymentByAccountPage{
    constructor() {
        this.container = $('');
    }

    async enterDetails(detailsObj) {

    }

  
}

class PaymentByAccountDetailsPage{
    constructor() {
        this.container = $('');
    }

    async enterDetails(detailsObj) {

    }

   
}

class RegisteredAddressPage{
    constructor() {
        this.container = $('');
    }

    async enterDetails(detailsObj) {

    }

  
}

class RegisteredRegulatorPage{
    constructor() {
        this.container = $('');
    }

    async enterDetails(detailsObj) {

    }

  
}

class RegisteredWithRegulatorPage{
    constructor() {
        this.container = $('');
    }

    async enterDetails(detailsObj) {

    }

 
}

class ContactDetailsPage{
    constructor() {
        this.container = $('');
    }

    async enterDetails(detailsObj) {

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
    }

    async enterDetails(detailsObj) {

    }

   
}


module.exports = new RegsiterOrgWorkFlow()

