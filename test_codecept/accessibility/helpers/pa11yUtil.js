const pa11y = require('pa11y');
const { conf } = require('../config/config');

const jwt = require('jsonwebtoken');
const puppeteer = require('puppeteer');

const idamLogin = require('../../ngIntegration/util/idamLogin')

// const MockApp = require('../../nodeMock/app');

const fs = require('fs');

let testBrowser = null;
let page = null;

class A11yViolationError extends Error {
  constructor(issueCount) {
    super("a11y issues reported: " + issueCount);
    this.name = 'A11yViolationError';
  }
}

let sessionCookies = [];

function resolveXuiBaseUrl() {
  return conf.baseUrl.replace(/\/+$/, '');
}

function getA11yCredentials() {
  const { username, password } = conf.params;
  if (!username || !password) {
    throw new Error('A11y login credentials are not configured');
  }
  return { username, password };
}

async function initBrowser() {
  const { username, password } = getA11yCredentials();
  const xuiBaseUrl = resolveXuiBaseUrl();
  idamLogin.withCredentials(username, password)
  idamLogin.conf.xuiBaseUrl = xuiBaseUrl;
  await idamLogin.do()
  testBrowser = await puppeteer.launch({
    ignoreHTTPSErrors: false,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu'
    ],
  });
  page = await testBrowser.newPage();
  await page.goto(`${xuiBaseUrl}/get-help`);
  const cookies = idamLogin.xuiCallbackResponse.details?.setCookies;
  if (!Array.isArray(cookies) || cookies.length === 0) {
    throw new Error('A11y login did not return session cookies');
  }
  sessionCookies = cookies;
  for (let cookie of cookies) {
    await page.setCookie({ name: cookie.name, value: cookie.value })
  }
  await page.reload({ waitUntil: 'domcontentloaded', timeout: 60000 });

  await page.goto(`${xuiBaseUrl}/`, { waitUntil: 'domcontentloaded', timeout: 60000 });

}

async function pa11ytest(test, actions, startUrl, roles) {
  if (!startUrl) {
    startUrl = resolveXuiBaseUrl();
  }
  test.screenshots = [];
  test.steps = actions;
  return pa11ytestRunner(test, actions, startUrl, roles);
}

async function pa11ytestRunner(test, actions, startUrl, roles) {
  console.log("pally test with actions : " + test.test.title);
  console.log(actions);

  let screenshotPath = process.env.PWD + "/" + conf.reportPath + 'assets/';
  if (!fs.existsSync(screenshotPath)) {
    fs.mkdirSync(screenshotPath, { recursive: true });
  }
  screenshotName = Date.now() + '.png';
  screenshotPath = screenshotPath + Date.now() + '.png';
  screenshotReportRef = 'assets/' + screenshotName;

  const startTime = Date.now();

  let token = jwt.sign({
    data: 'foobar'
  }, 'secret', { expiresIn: 60 * 60 });

  let result;


  // await setScenarioCookie(test);
  try {
    // await initBrowser();
    result = await pa11y(startUrl, {
      browser: testBrowser,
      page: page,
      timeout: 60000,
      screenCapture: screenshotPath,
      log: {
        debug: console.log,
        error: console.error,
        info: console.info
      },
      actions: actions
    })
  } catch (err) {
    await page.screenshot({ path: screenshotPath });
    const elapsedTime = Date.now() - startTime;
    result = {
      documentTitle: "test name " + test.test.title,
      steps: actions,
      pageUrl: "",
      issues: [{
        code: "test execution error",
        message: "" + err.message,
        selector: ""
      }]
    };
    result.executionTime = elapsedTime;
    test.screenshots.push(screenshotReportRef);
    result.screenshot = screenshotReportRef;
    test.a11yResult = result;
    console.log("Test Execution time : " + elapsedTime);
    console.log(err);
    await page.close();
    await testBrowser.close();
    throw err;

  }

  await page.close();
  await testBrowser.close();
  const elapsedTime = Date.now() - startTime;
  result.executionTime = elapsedTime;

  test.screenshots.push(screenshotReportRef);
  result.screenshot = screenshotReportRef;
  test.a11yResult = result;
  console.log("Test Execution time : " + elapsedTime);
  if (conf.failTestOna11yIssues) {
    if (result.issues.length > 0) {
      throw new A11yViolationError(result.issues.length);
    }
  }
  result.steps = actions

  return result;

}

function getAuthCookie() {
  return sessionCookies.find(cookie => cookie.name === '__auth__').value
}


module.exports = { pa11ytest, initBrowser, getAuthCookie }
