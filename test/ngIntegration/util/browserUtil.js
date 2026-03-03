const { browser } = require('protractor');
const jwt = require('jsonwebtoken');
const { date } = require('faker');

class BrowserUtil{
  async gotoHomePage(){
    await browser.get('http://localhost:4200/');
  }

  setAuthCookie(){
    const token = jwt.sign({
      data: 'foobar'
    }, 'secret', { expiresIn: 60 * 60 });

    const cookie ={
      name: '__auth__',
      value: token,
      domain: 'localhost:4200',
      path: '/',
      httpOnly: false,
      secure: false,
      session: true
    };
    browser.manage().addCookie(cookie);
  }

  async browserInitWithAuth(){
    await this.gotoHomePage();
    this.setAuthCookie();
    await this.gotoHomePage();
  }

  async waitForLD(){
    const startTime = new Date();
    let elapsedTime = 0;
    let ldDone = false;
    while (!ldDone && elapsedTime < 10) {
      const perf = await browser.executeScript('return window.performance.getEntriesByType(\'resource\')');
      perf.forEach((perfitem) => {
        if (perfitem.name.includes('app.launchdarkly.com/sdk/evalx')) {
          ldDone = true;
        }
      });
      elapsedTime = (new Date() - startTime)/1000;
    }
  }
}

module.exports = new BrowserUtil();
