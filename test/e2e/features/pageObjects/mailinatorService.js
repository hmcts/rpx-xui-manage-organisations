

var EC = protractor.ExpectedConditions;

class MailinatorService{
    constructor(){
        this.currentInboxLabel = "#inbox_page_title .title_left:nth-of-type(3) .top_search";
        this.latestEmailRowCssSelector = ".x_panel .x_content tbody tr:nth-of-type(1) td:nth-of-type(3)"
        this.activationEmaillinkCSsSelector = ".content tr:nth-of-type(2) td:nth-of-type(2) a:nth-of-type(1)";

        this.latestLoginVerificationEmail = "//div[@class = 'table-responsive'][1]//tbody//tr[1]//*[contains(text(),'verification code')]";

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


        await this.mailinatorbrowser.get("https://www.mailinator.com/v3/index.jsp?zone=public&query=exuitest#/#inboxpane")

    }

    async gotToInbox(useremail){
        let emailFieldElement = this.mailinatorElement(by.css('#inbox_field'));
        await this.mailinatorbrowser.wait(EC.presenceOf(emailFieldElement), this.waitTime, "Error : " + emailFieldElement.locator().toString());
        await this.mailinatorbrowser.wait(EC.visibilityOf(emailFieldElement), this.waitTime, "Error : " + emailFieldElement.locator().toString());


        this.mailinatorbrowser.sleep(2000);
        await emailFieldElement.clear();
        let emailId = await emailFieldElement.getText(); 
        while (emailId.includes('exuitest')){
            this.mailinatorbrowser.sleep(2000);
            await emailFieldElement.clear()
        }
    
        await emailFieldElement.sendKeys(useremail);
        await this.mailinatorElement(by.css('#go_inbox')).click();
        let inboxLabelElement = this.mailinatorElement(by.css(this.currentInboxLabel));
        let inboxName = await inboxLabelElement.getText(); 
        let username = useremail.replace("@mailinator.com","");

        let timer = 5;
        setTimeout(() => { timer = false},5000);
        while (!inboxName.includes(username) && timer > 0){
            console.log(inboxName + "   In inbox " + username);
            browser.sleep(1000);
            timer = timer - 1;
            inboxName = await inboxLabelElement.getText(); 
        }
       
        if (!inboxName.includes(username)){
            throw new Error("Error/Unable to open inbox " + useremail);
        }

        console.log("In inbox "+useremail);
    }



    async openEmailForUser(useremail,emailElement){
        await this.gotToInbox(useremail);
        let timer = 15;
        let latestEmailElement = emailElement;
        let isEmailPresent = await latestEmailElement.isPresent();

        while (!isEmailPresent  && timer > 0){

            await browser.sleep(1000);
            isEmailPresent = await latestEmailElement.isPresent();
            timer = timer - 1; 

            console.log("email not received : "+timer);
       } 
        if (!isEmailPresent){
            throw new Error("No email received :" + useremail + emailElement);
       }
        let latestEmailEle = this.mailinatorElement(by.css(this.latestEmailRowCssSelector));
        await latestEmailEle.click();
 

    }

    async completeUserRegistrationFromEmail(){
    
        await this.mailinatorbrowser.switchTo().frame(this.mailinatorElement(by.css("#msg_body")).getWebElement());
        let activationLinkEle = this.mailinatorElement(by.css(this.activationEmaillinkCSsSelector));
        await this.mailinatorbrowser.wait(EC.presenceOf(activationLinkEle), this.waitTime, "Error : " + activationLinkEle.locator().toString());

        let mainWinHandle = await this.mailinatorbrowser.driver.getWindowHandle();
        await activationLinkEle.click();
        let winHandles = await this.mailinatorbrowser.driver.getAllWindowHandles();
        await this.mailinatorbrowser.switchTo().window(winHandles[1]);

        await this.mailinatorElement(by.css("#password1")).sendKeys("Monday01");
        await this.mailinatorElement(by.css("#password2")).sendKeys("Monday01");
        await this.mailinatorElement(by.css("#activate")).click();

        let accountCreatedMessageElement = this.mailinatorElement(by.xpath("//h1[contains(text(), 'Account created')]"));
        await this.mailinatorbrowser.wait(EC.presenceOf(accountCreatedMessageElement), this.waitTime, "Error : " + accountCreatedMessageElement.locator().toString());
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



}

const mailinatorService = new MailinatorService(); 
mailinatorService.init().then(() => {
    console.log("*************************************************************************");
    console.log("***************  Browser  Mailinator Service Started ********************");
    console.log("*************************************************************************");

});
module.exports = mailinatorService;


