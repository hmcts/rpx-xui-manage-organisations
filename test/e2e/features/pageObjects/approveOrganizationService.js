
const loginLogout = require('./loginLogoutObjects');

var EC = protractor.ExpectedConditions;

class ApproveOrganisationService{

    constructor() {
        this.baseUrl = "";
        this.useremail = "";
        this.password = "";
        if (process.env.TEST_URL.includes("aat") || process.env.TEST_URL.includes("preview")){
            this.baseUrl = "https://xui-ao-webapp-aat.service.core-compute-aat.internal/";
            this.useremail = "vmuniganti@mailnesia.com";
            this.password = "Monday01";
        } else if (process.env.TEST_URL.includes("demo")){
            this.baseUrl = "https://xui-ao-webapp-demo.service.core-compute-demo.internal/";
            this.useremail = "sourav.bhattacharya@hmcts.net";
            this.password = "ReferenceData2019";
       } 

    }

    async init() {

        if(this.BrowserStatus === "STARTED"){
            this.destroy();
        }

        console.log("AO ENV : " + this.baseUrl);
        this.aoBrowser = await browser.forkNewDriverInstance().ready;
        this.aoBrowser.ignoreSynchronization = true;
        this.aoElement = this.aoBrowser.element;
        await this.aoBrowser.waitForAngularEnabled(false);
        this.BrowserStatus === "STARTED";


        this.checkNowLink = this.aoElement(by.xpath("//a[contains(text(),'Check now')]"));
        this.pendingOrgPageHeader = this.aoElement(by.xpath("//h1[contains(text(),'Organisations pending activation')]"));
        this.activateOrganisationBtn = this.aoElement(by.css(".govuk-button[type = 'submit']"));

        this.activateApproveOrgPageHeader = this.aoElement(by.xpath("//h1[contains(text(),'Check selected organisation details before')]"));
        this.approveOrganisationBtn = this.aoElement(by.css(".govuk-button"));

        this.approveOrgConfirmationPageHeader = this.aoElement(by.xpath("//h1[contains(text(),'Organisation approved successfully')]"));
        this.backToOrganisationsLink = this.aoElement(by.xpath("//a[contains(text(),'Back to organisations')]")); 


        this.emailAddressElement = this.aoElement(by.css("input#username"));
        this.passwordElement = this.aoElement(by.css("[id='password']"));
        this.signinTitle = this.aoElement(by.xpath("//h1[@class='heading-large']"));
        //this.signinTitle = element(by.css("h1"));
        this.signinBtn = this.aoElement(by.css("input.button"));
""
        this.organisationDetailsHeader = this.aoElement(by.xpath('//h1[contains(@class,"govuk-heading-xl") and contains(text(),"Organisation details")]'));

        await this.aoBrowser.get(this.baseUrl)
        await this.waitForElement(this.emailAddressElement);

        

    }

    async destroy(){
        this.aoBrowser.driver.quit();
        this.BrowserStatus = "QUIT"; 
    }

    async waitForElement(element){
        await this.aoBrowser.wait(EC.presenceOf(element), 60000, "Error : " + element.locator().toString());

    }

    async approveOrg(orgName){
        await this.emailAddressElement.sendKeys(this.useremail);
        await this.passwordElement.sendKeys(this.password);
        await this.signinBtn.click();
        // this.waitForElement(this.checkNowLink);
        // await this.checkNowLink.click();
        await this.waitForElement(this.pendingOrgPageHeader);
        await this.waitForElement(this.activateOrganisationBtn);

        let viewLink = this.aoElement(by.xpath("//*[contains(@class,'govuk-table')]//td[contains(text(),'" + orgName+"')]/..//a"));

        await viewLink.click();

        await this.waitForElement(this.organisationDetailsHeader);
        await this.approveOrganisationBtn.click();

        // await this.activateOrganisationBtn.click();

        await this.waitForElement(this.activateApproveOrgPageHeader);
        await this.approveOrganisationBtn.click();
        
        await this.waitForElement(this.approveOrgConfirmationPageHeader);

        await this.backToOrganisationsLink.click();
        await this.waitForElement(this.checkNowLink);
    }

}

const approveOrganisationService = new ApproveOrganisationService();

module.exports = approveOrganisationService; 