
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
        this.BrowserStatus = "STARTED";

        this.emailAddressElement = this.mcElement(by.css("input#username"));
        this.passwordElement = this.mcElement(by.css("[id='password']"));
        this.signinTitle = this.mcElement(by.xpath("//h1[@class='heading-large']"));
        //this.signinTitle = element(by.css("h1"));
        this.signinBtn = this.mcElement(by.css("input.button"));

        this.erroSummaryBannner = this.mcElement(by.css("h2.error-summary-heading"));
        this.hmctsHeader = this.mcElement(by.css('.hmcts-header__link')); 

        await this.mcBrowser.get(this.baseUrl)
        // await this.retryForPageLoad(this.emailAddressElement, async () => {
        //     await this.mcBrowser.get(this.baseUrl);
        // }); 
    }

    async destroy(){
        if (this.BrowserStatus !== "QUIT"){
            this.mcBrowser.driver.quit();
            this.BrowserStatus = "QUIT";
        }
    }

    async waitForElement(element,waitTime) {
        await this.mcBrowser.wait(EC.presenceOf(element), waitTime ? waitTime :  10000, "Error : " + element.locator().toString());

    }

    async retryForPageLoad(element, callback) {
        let retryCounter = 0;

        while (retryCounter < 3) {
            try {
                await this.waitForElement(element);
                retryCounter += 3;
            }
            catch (err) {
                retryCounter += 1;
                if (callback) {
                    callback(retryCounter + "");
                }
                console.log(element.locator().toString() + " .    Retry attempt for page load : " + retryCounter);

                await browser.refresh();

            }
        }
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
                    await this.attachScreenshot();
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
            await this.attachScreenshot();
            throw new Error(error);
        }
        

    }

    async attachScreenshot(){
        let stream = await this.mcBrowser.takeScreenshot();
        const decodedImage = new Buffer(stream.replace(/^data:image\/(png|gif|jpeg);base64,/, ''), 'base64');
        this.logger(decodedImage, true)
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