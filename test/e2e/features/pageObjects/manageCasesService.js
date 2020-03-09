
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

    setLogger(loggerObj){
        this.loggerObj = loggerObj;
    }

    logger(message,isScreenshot){
        if (isScreenshot){
            this.loggerObj(message,true);

        }else{
            this.loggerObj("[Manage Cases] " + this.getCurrentTime() + " " + message);
        }
    }

    async init() {
        if (this.BrowserStatus === "STARTED") {
            this.destroy();
        }

        console.log("MC ENV : " + this.baseUrl);
        this.mcBrowser = await browser.forkNewDriverInstance().ready;
        this.mcBrowser.ignoreSynchronization = true;
        this.mcElement = this.mcBrowser.element;
        await this.mcBrowser.waitForAngularEnabled(false);
        this.BrowserStatus = "STARTED"
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

    async destroy(){
        this.mcBrowser.driver.quit(); 
        this.BrowserStatus === "QUIT";
    }

    async waitForElement(element) {
        await this.mcBrowser.wait(EC.presenceOf(element), 60000, "Error : " + element.locator().toString());

    }

    async login(username,password) {

        try{
            this.logger("MC Login Step started");
            await this.mcBrowser.driver.manage()
                .deleteAllCookies();
            await this.mcBrowser.get(this.baseUrl);

            let counter =0;
            while (!(await this.emailAddressElement.isPresent()) && counter <=5){
                await this.mcBrowser.get(this.baseUrl);

                try{
                    await this.waitForElement(this.emailAddressElement);
                    break;
                }catch(error){
                    this.logger("MC Login page not loaded. Retry page load "+counter);
                    this.mcBrowser.takeScreenshot()
                        .then(stream => {
                            const decodedImage = new Buffer(stream.replace(/^data:image\/(png|gif|jpeg);base64,/, ''), 'base64');
                            this.logger(decodedImage, true);
                        });
                    counter+=1;
                }

            }
            await this.waitForElement(this.emailAddressElement);

            await this.emailAddressElement.sendKeys(username);
            await this.passwordElement.sendKeys(password);
            await this.signinBtn.click();
            this.logger("MC Login submitted for user : " + username)
        }
        catch(error){
            this.mcBrowser.takeScreenshot()
                .then(stream => {
                    const decodedImage = new Buffer(stream.replace(/^data:image\/(png|gif|jpeg);base64,/, ''), 'base64');
                    this.logger(decodedImage, true);
                });
            throw new Error(error);
        }
        

    }

    async validateLoginSuccess(){
        await this.waitForElement(this.hmctsHeader);
        this.logger("MC Login Success as expected");

    }

    async validateLoginFailure(){
        await this.mcBrowser.wait(async () => {
            await this.waitForElement(this.emailAddressElement);
            let loginEmailFieldValue = await this.emailAddressElement.getAttribute('value'); 
            return loginEmailFieldValue === ''; 
        }, this.waitTime);
        this.logger("MC Login Failed as expected");
    }

    getCurrentTime() {
        let nowDate = new Date();
        var time = nowDate.getHours() + ":" + nowDate.getMinutes() + ":" + nowDate.getSeconds();
        return time;
    }
}

const manageCasesService = new ManageCasesService();

module.exports = manageCasesService; 