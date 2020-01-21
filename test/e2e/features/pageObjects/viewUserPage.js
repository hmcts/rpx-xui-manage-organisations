'use strict';

const { AMAZING_DELAY, SHORT_DELAY, MID_DELAY, LONG_DELAY } = require('../../support/constants');
var BrowserWaits = require('../../support/customWaits')

class ViewUserPage {

  constructor() {
    this.header = 'h1';
    this.inviteUser = element(by.xpath("//*[contains(@class,'govuk-button') and contains(text(),'Invite user')]"));

    this.header = element(by.xpath("//h1[text() = 'Users']"));
    this.spinner = element(by.css(".spinner-wrapper"));

    this.userstable = element(by.css('table'));
    this.userRows = element.all(by.css('.govuk-table tbody tr'));
    this.userRowsHeader = element.all(by.css('.govuk-table thead tr th'));


  }

  async getPageHeader() {
    return await $(this.header).getText();
  }

  async amOnPage() {
    // browser.sleep(LONG_DELAY);
    await BrowserWaits.waitForElement(this.header);
    // let header = await this.getPageHeader();
    return true;
    // browser.sleep(LONG_DELAY);
  }

  async validateUserWithEmailListed(useremail){
    await BrowserWaits.waitForElement(this.userstable); 
    let users = await this.userstable.getText();
    assert(users.includes(useremail), "User with email is not listed : " + useremail);
  }

  async validateUsersTableDisplaysAllDetails(){
    await BrowserWaits.waitForElement(this.userstable);
    await BrowserWaits.waitForCondition(async () => { return await this.userRows.length > 0 });
  
    let usersCount = (await this.userRows).length;
    console.log(" rows length " + usersCount);
    for (let userRow = 0; userRow < usersCount ;userRow++){
      console.log(userRow + " : " + await this.userRows.get(userRow).getText());
      let userRowEle =  this.userRows.get(userRow);
      let userDetailElemets = userRowEle.all(by.css("td"));
      console.log(userRow+ " : "+ (await userRowEle).getText());
      for(let rowDetails = 0; rowDetails< (await userDetailElemets).length; rowDetails++){
        let detailText = await userDetailElemets.get(rowDetails).getText();
        let detailHeaderLabel = (await this.userRowsHeader.get(rowDetails).getText()) ; 
        console.log(userRow + " => " + detailHeaderLabel+ " is " + detailText);
        assert(detailText !== "", detailHeaderLabel  + " is displayed empty for user row : " + (await userRowEle.getText()));
      } 
    }
  }

  async clickInviteUser() {
    await BrowserWaits.waitForElementNotVisible(this.spinner);
    await BrowserWaits.waitForElement(this.userstable);

    await BrowserWaits.waitForElementClickable(this.inviteUser);


    await this.inviteUser.click();
    // browser.sleep(AMAZING_DELAY);
  }
}
module.exports = ViewUserPage;

