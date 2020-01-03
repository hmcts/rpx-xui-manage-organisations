

var EC = protractor.ExpectedConditions;

class MailinatorService{

    constructor(){
        this.currentInboxLabel = "#inbox_page_title .title_left:nth-of-type(3) .top_search";
        this.latestEmailRowCssSelector = ".x_panel .x_content tbody tr:nth-of-type(1)"

        this.activationEmaillinkCSsSelector = ".content tr:nth-of-type(2) td:nth-of-type(2) a:nth-of-type(1)";
    }

    async init(){
        this.mailinatorbrowser = await  browser.forkNewDriverInstance().ready; 
        this.mailinatorbrowser.ignoreSynchronization = true;
        this.mailinatorElement = this.mailinatorbrowser.element;
        await this.mailinatorbrowser.waitForAngularEnabled(false);
        await this.mailinatorbrowser.get("https://www.mailinator.com/v3/index.jsp?zone=public&query=exuitest#/#inboxpane");
    }


    async gotToInbox(useremail){
        await this.mailinatorElement(by.css('#inbox_field')).clear();
        await this.mailinatorElement(by.css('#inbox_field')).sendKeys(useremail);
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
        console.log("In inbox "+useremail);
    }

    async openRegistrationEmailForUser(useremail){
        await this.gotToInbox(useremail);
        let timer = 5;
        let latestEmailElement = this.mailinatorElement(by.css(this.latestEmailRowCssSelector));
        let isEmailPresent = await latestEmailElement.isPresent();
        while (!isEmailPresent  && timer > 0){
            browser.sleep(1000);
            isEmailPresent = await this.mailinatorElement(by.css(this.latestEmailRowCssSelector)).isPresent();
            timer = timer - 1; 

            console.log("email not received : "+timer);
       } 
        if (!isEmailPresent){
            throw new Error("No email received :"+useremail);
       }
        await latestEmailElement.element(by.css("td:nth-of-type(4) a")).click();
    }

    async completeUserRegistrationFromEmail(){
        await this.mailinatorbrowser.switchTo().frame(this.mailinatorElement(by.css("#msg_body")).getWebElement());
        let activationLinkEle = this.mailinatorElement(by.css(this.activationEmaillinkCSsSelector));
        await this.mailinatorbrowser.wait(EC.presenceOf(activationLinkEle), this.waitTime, "Error : " + activationLinkEle.locator().toString());
        await activationLinkEle.click();


    }



}

module.exports =  MailinatorService;


