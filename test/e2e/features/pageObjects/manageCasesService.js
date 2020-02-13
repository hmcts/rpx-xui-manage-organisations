
const loginLogout = require('./loginLogoutObjects');

var EC = protractor.ExpectedConditions;

class ManageCasesService {

    constructor() {
        this.baseUrl = "";
        this.useremail = "";
        this.password = "";
        this.waitTime = 30000;
        if (process.env.TEST_URL.includes("aat") || process.env.TEST_URL.includes("preview")) {
            this.baseUrl = "https://xui-webapp-aat.service.core-compute-aat.internal/";
        } else if (process.env.TEST_URL.includes("demo")) {
            this.baseUrl = "https://xui-webapp-demo.service.core-compute-demo.internal/";
        }

    }

    setWorld(worldObj){
        this.world = worldObj;
    }

    async init() {
        console.log("MC ENV : " + this.baseUrl);
        this.mcBrowser = await browser.forkNewDriverInstance().ready;
        this.mcBrowser.ignoreSynchronization = true;
        this.mcElement = this.mcBrowser.element;
        await this.mcBrowser.waitForAngularEnabled(false);

        this.emailAddressElement = this.mcElement(by.css("input#username"));
        this.passwordElement = this.mcElement(by.css("[id='password']"));
        this.signinTitle = this.mcElement(by.xpath("//h1[@class='heading-large']"));
        //this.signinTitle = element(by.css("h1"));
        this.signinBtn = this.mcElement(by.css("input.button"));

        this.erroSummaryBannner = this.mcElement(by.css("h2.error-summary-heading"));
        this.hmctsHeader = this.mcElement(by.css('.hmcts-header__link')); 

        await this.mcBrowser.get(this.baseUrl)
        await this.waitForElement(this.emailAddressElement);



    }

    async waitForElement(element) {
        await this.mcBrowser.wait(EC.presenceOf(element), 60000, "Error : " + element.locator().toString());

    }

    async login(username,password) {

        this.world.attach("MC Login Step started");
        await this.mcBrowser.driver.manage()
            .deleteAllCookies();
        await this.mcBrowser.get(this.baseUrl)
        await this.waitForElement(this.emailAddressElement);

        await this.emailAddressElement.sendKeys(username);
        await this.passwordElement.sendKeys(password);
        await this.signinBtn.click();
        this.world.attach("MC Login submitted for user : " + username);

    }

    async validateLoginSuccess(){
        await this.waitForElement(this.hmctsHeader);
        this.world.attach("MC Login Success as expected");

    }

    async validateLoginFailure(){
        await this.mcBrowser.wait(async () => {
            await this.waitForElement(this.emailAddressElement);
            let loginEmailFieldValue = await this.emailAddressElement.getAttribute('value'); 
            return loginEmailFieldValue === ''; 
        }, this.waitTime);
        this.world.attach("MC Login Failed as expected");
    }
}

const manageCasesService = new ManageCasesService();
manageCasesService.init().then(() => {
    console.log("*************************************************************************");
    console.log("***************  Browser  Manage Cases Service Started ********************");
    console.log("*************************************************************************");

});
module.exports = manageCasesService; 