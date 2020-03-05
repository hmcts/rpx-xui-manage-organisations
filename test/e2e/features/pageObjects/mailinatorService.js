

var EC = protractor.ExpectedConditions;

class MailinatorService{
    constructor(){
        this.currentInboxLabel = "#inbox_page_title .title_left:nth-of-type(3) .top_search";
        this.latestEmailRowCssSelector = ".x_panel .x_content tbody tr:nth-of-type(1) td:nth-of-type(3)"
        this.activationEmaillinkCSsSelector = ".content tr:nth-of-type(2) td:nth-of-type(2) a:nth-of-type(1)";

        this.latestLoginVerificationEmail = "//div[@class = 'table-responsive'][1]//tbody//tr[1]//*[contains(text(),'verification code')]";
        this.waitTime = 30000;
    }

    setLogger(loggerFunction){
        this.loggerService = loggerFunction;
    }

    logger(message,isScreenshot){
        if (isScreenshot){
            this.loggerService(message,true);

        }else{
            this.loggerService("[ Mailinator ] " + this.getCurrentTime() + " " + message);
        }
    }
    async init(){
        if (!this.mailinatorbrowser){
            this.mailinatorbrowser = await browser.forkNewDriverInstance().ready;
        }
        
        this.mailinatorbrowser.ignoreSynchronization = true;
        this.mailinatorElement = this.mailinatorbrowser.element;
        await this.mailinatorbrowser.waitForAngularEnabled(false);


        this.mailinatorbrowser.driver.executeScript('alert = function(){};');
        this.mailinatorbrowser.driver.executeScript('confirm = function(){};');
        this.emailFieldElement = this.mailinatorElement(by.css('#inbox_field'))

        this.acceptCookiesLink = this.mailinatorElement(by.css('.cc-btn.cc-dismiss'));

        await this.loadMailinatorService();

    }

    async destroy(){
        this.mailinatorbrowser.driver.quit();
    }

    async loadMailinatorService(){
        await this.mailinatorbrowser.get("https://www.mailinator.com/v3/index.jsp?zone=public&query=exuitest#/#inboxpane")

    }
    async checkAndReloadService(){
        let counter = 0;
        let isPageLoaded =  await this.emailFieldElement.isPresent();
        this.logger("Retrying opening mailinator service : " + counter);
        while (counter < 5 && !isPageLoaded){
            this.logger("Retrying opening mailinator service : " + counter);
            await this.loadMailinatorService();
            isPageLoaded = await this.emailFieldElement.isPresent();
            counter++;
        }
    }

    async gotToInbox(useremail){
        this.logger("Opening user inbox");
        let username = useremail.replace("@mailinator.com", "");
        await this.checkAndReloadService();
        await this.mailinatorbrowser.wait(EC.presenceOf(this.emailFieldElement), this.waitTime, "Error : " + this.emailFieldElement.locator().toString());
        await this.mailinatorbrowser.wait(EC.visibilityOf(this.emailFieldElement), this.waitTime, "Error : " + this.emailFieldElement.locator().toString());

        this.mailinatorbrowser.sleep(2000);
        await this.emailFieldElement.clear();
        await this.emailFieldElement.sendKeys(useremail);

        let emailId = await this.emailFieldElement.getAttribute("value");
        
        let counter = 5;
        this.logger('Input user email : ' + useremail); 
        while (!emailId.includes(username) && counter <= 0){
            this.mailinatorbrowser.sleep(2000);
            await this.emailFieldElement.clear();
            await this.emailFieldElement.sendKeys(useremail);
            emailId = await this.emailFieldElement.getAttribute("value");
            counter--;
        }
        await this.mailinatorElement(by.css('#go_inbox')).click();
        let inboxLabelElement = this.mailinatorElement(by.css(this.currentInboxLabel));
        let inboxName = await inboxLabelElement.getText(); 

        let timer = 15;
        setTimeout(() => { timer = false},5000);
        this.logger('Waiting for inbox to load : ' + useremail); 

        while (!inboxName.includes(username) && timer > 0){
            console.log(inboxName + "   In inbox " + username);
            browser.sleep(1000);
            timer = timer - 1;
            inboxName = await inboxLabelElement.getText(); 
        }
       
        if (!inboxName.includes(username)){
            this.logger("Error/Unable to open inbox " + useremail); 
            throw new Error("Error/Unable to open inbox " + useremail);
        }
        this.logger("Inbox opened successfully " + useremail); 
    }



    async openEmailForUser(useremail,emailElement){
        await this.gotToInbox(useremail);
        this.logger("Waiting for email " + useremail); 

        let timer = 15;
        let latestEmailElement = emailElement;
        let isEmailPresent = await latestEmailElement.isPresent();

        this.logger(" Email received status check started  " + isEmailPresent); 

        while (!isEmailPresent  && timer > 0){

            await browser.sleep(1000);
            isEmailPresent = await latestEmailElement.isPresent();

            this.logger(" Email received status  " + isEmailPresent); 
            timer = timer - 1; 
       } 
        if (!isEmailPresent){
            this.logger("No email received :" + useremail + emailElement); 
            throw new Error("No email received :" + useremail + emailElement);
       }
        let latestEmailEle = this.mailinatorElement(by.css(this.latestEmailRowCssSelector));
        this.logger("Email received " + useremail ); 

        await latestEmailEle.click();
        this.logger("Email opened successful" + useremail); 


    }

    async completeUserRegistrationFromEmail(){
        this.logger("Started User Registration "); 

        let isCookiesInfoLinkPresent = await this.acceptCookiesLink.isDisplayed();
        if (isCookiesInfoLinkPresent) {
            this.logger("cookies usage  banner found");
            await this.acceptCookiesLink.click();
            await this.mailinatorbrowser.sleep(2000);
        }
        await this.mailinatorbrowser.switchTo().frame(this.mailinatorElement(by.css("#msg_body")).getWebElement());
        let activationLinkEle = this.mailinatorElement(by.css(this.activationEmaillinkCSsSelector));
        await this.mailinatorbrowser.wait(EC.presenceOf(activationLinkEle), this.waitTime, "Error : " + activationLinkEle.locator().toString());
        await this.mailinatorbrowser.wait(EC.elementToBeClickable(activationLinkEle), this.waitTime, "Error : " + activationLinkEle.locator().toString());

        let mainWinHandle = await this.mailinatorbrowser.driver.getWindowHandle();
        this.logger("Clicking Regsiatrtion link in email"); 

        this.mailinatorbrowser.takeScreenshot()
            .then(stream => {
                const decodedImage = new Buffer(stream.replace(/^data:image\/(png|gif|jpeg);base64,/, ''), 'base64');
                this.logger(decodedImage, true);
            });
        await activationLinkEle.click();
        let winHandles = await this.mailinatorbrowser.driver.getAllWindowHandles();
        await this.mailinatorbrowser.switchTo().window(winHandles[1]);


        await this.mailinatorElement(by.css("#password1")).sendKeys("Monday01");
        await this.mailinatorElement(by.css("#password2")).sendKeys("Monday01");
        this.logger("Submitting passwords"); 
        await this.mailinatorElement(by.css("#activate")).click();

        let accountCreatedMessageElement = this.mailinatorElement(by.xpath("//h1[contains(text(), 'Account created')]"));
        await this.mailinatorbrowser.wait(EC.presenceOf(accountCreatedMessageElement), this.waitTime, "Error : " + accountCreatedMessageElement.locator().toString());
        this.logger("Registration completed successful."); 
        await this.mailinatorbrowser.driver.close();
        await this.mailinatorbrowser.switchTo().window(mainWinHandle);

    }

    async openRegistrationEmailForUser(email){
        await this.openEmailForUser(email, this.mailinatorElement(by.css(this.latestEmailRowCssSelector)));
    }

    async getLoginVerificationEmailCode(email) {
        await this.openEmailForUser(email, this.mailinatorElement(by.xpath(this.latestLoginVerificationEmail)));
        this.mailinatorbrowser.sleep(5000);
        let messageBody = this.mailinatorElement(by.css("#msg_body"));
        await this.mailinatorbrowser.wait(EC.presenceOf(messageBody), this.waitTime, "Error : " + messageBody.locator().toString());

        await this.mailinatorbrowser.switchTo().frame(messageBody.getWebElement());
        console.log(await this.mailinatorElement(by.css("body")).getText());
       let verificationCode = await this.mailinatorElement(by.css("tbody tr td p:nth-of-type(3)")).getText();
       
        // await this.mailinatorbrowser.switchTo().frame(this.mailinatorElement(by.css("#msg_body")).getWebElement());
        return verificationCode;

    }


    getCurrentTime(){
        let nowDate = new Date();
        var time = nowDate.getHours() + ":" + nowDate.getMinutes() + ":" + nowDate.getSeconds();
        return time;
    }

}

const mailinatorService = new MailinatorService(); 
// mailinatorService.init().then(() => {
//     console.log("*************************************************************************");
//     console.log("***************  Browser  Mailinator Service Started ********************");
//     console.log("*************************************************************************");

// });
module.exports = mailinatorService;


