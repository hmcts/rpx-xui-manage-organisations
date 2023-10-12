

const BeforeYouStartPage = require('./beforeYouStartPage')
const OrganisationTypePage = require('./organisationTypePage')
const CompanyHouseDetailsPage = require('./companyHouseDetailsPage')
const RegisteredAddressPage = require('./registeredAddressPage')
const RegisteredAddressManualPage = require('./registeredAddressManualPage')
const DocumentExchangeReferencePage = require('./documentExchangeReferencePage')
const DocumentExchangeReferenceDetailsPage = require('./documentExchangeReferenceDetailsPage')
const RegulatoryOrganisationTypePage = require('./regulatoryOrganisationTypePage')
const OrganisationServicesAccessPage = require('./organisationServicesAccessPage')
const PaymentByAccountPage = require('./paymentByAccountPage')
const PaymentByAccountDetailsPage = require('./paymentByAccountDetailsPage')
const ContactDetailsPage = require('./contactDetailsPage')
const IndividualRegisteredWithRegulatorPage = require('./individualRegisteredWithRegulatorPage')
const IndividualRegisteredWithRegulatorDetailsPage = require('./individualRegisteredWithRegulatorDetailsPage')
const CheckYourAnswersPage = require('./checkYourAnswersPage')

class RegisterOtherOrgWorkflow{
    constructor(){
        this.startBtn = element(by.xpath(`//button[contains(@class,'govuk-buton--primary')][contains(text(),'Start')]`));
        this.continueBtn = element(by.xpath(`//div[contains(@class,'govuk-button-group')]//button[contains(text(),'Continue')]`));
        this.backLink = $('a.govuk-back-link')

        this.errorSummaryContainer = $('#errorSummary')

        this.pages = {
            "Apply for an organisation to manage civil, family and tribunal cases": new BeforeYouStartPage(),
            "What type of organisation are you registering?": new OrganisationTypePage(),
            "What is your company name and Companies House number?": new CompanyHouseDetailsPage(),
            "What is the registered address of your organisation?": new RegisteredAddressPage(),
            "Is this a UK address?": new RegisteredAddressManualPage(),
            "Do you have a document exchange reference for your main office?": new DocumentExchangeReferencePage(),
            "What's the DX reference for this office?": new DocumentExchangeReferenceDetailsPage(),
            "Who is your organisation registered with?": new RegulatoryOrganisationTypePage(),
            "Which services will your organisation need to access?": new OrganisationServicesAccessPage(),
            "Does your organisation have a payment by account number?" : new PaymentByAccountPage(),
            "What PBA numbers does your organisation use?": new PaymentByAccountDetailsPage(),
            "Provide your contact details" : new ContactDetailsPage(),
            "Are you (as an individual) registered with a regulator?": new IndividualRegisteredWithRegulatorPage(),
            "What regulator are you (as an individual) registered with?": new IndividualRegisteredWithRegulatorDetailsPage(),
            "Check your answers before you register" : new CheckYourAnswersPage()

        }
    }

    async validateErrorSummaryMessageDisplayed(message){
        const ele = element(by.xpath(`//div[contains(@class,'govuk-error-summary__body')]//a[contains(text(),'${message}')]`))
        expect(await ele.isDisplayed(), `Error message not displayed: ${message}`).to.be.true
    }


}

module.exports = new RegisterOtherOrgWorkflow();

