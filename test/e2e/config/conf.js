const chai            = require('chai');
const chaiAsPromised  = require('chai-as-promised');
const minimist        = require('minimist');
var screenShotUtils = require("protractor-screenshot-utils").ProtractorScreenShotUtils;

chai.use(chaiAsPromised);

const argv = minimist(process.argv.slice(2));

const jenkinsConfig = [

  {
    browserName: 'chrome',
    acceptInsecureCerts: true,
    nogui: true,
    unexpectedAlertBehaviour: 'accept',
    chromeOptions: { args: ['--headless', '--no-sandbox', '--disable-dev-shm-usage', '--disable-setuid-sandbox', '--no-zygote ', '--disableChecks', '--disable-notifications'] }
  }
];

const localConfig = [
  {
    browserName: 'chrome',
    acceptInsecureCerts: true,
    unexpectedAlertBehaviour: 'accept',
    chromeOptions: { args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-setuid-sandbox', '--no-zygote ', '--disable-notifications'] },
    proxy: {
      proxyType: 'manual',
      httpProxy: 'proxyout.reform.hmcts.net:8080',
      sslProxy: 'proxyout.reform.hmcts.net:8080',
      noProxy: 'localhost:3000'
    }
  }
];

const cap = (argv.local) ? localConfig : jenkinsConfig;

const config = {
  framework: 'custom',
  frameworkPath: require.resolve('protractor-cucumber-framework'),
  specs: ['../features/**/*.feature'],
  baseUrl: process.env.TEST_URL || 'http://localhost:3000/',
  params: {
    serverUrls: process.env.TEST_URL || 'http://localhost:3000/',
    targetEnv: argv.env || 'local',
    username: process.env.TEST_EMAIL || 'lukesuperuserxui@mailnesia.com' ,
    password: process.env.TEST_PASSWORD || 'Monday01',
    // username: 'peterxuisuperuser@mailnesia.com',
    // password: 'Monday01'
  },
  directConnect: true,
  // seleniumAddress: 'http://localhost:4444/wd/hub',
  getPageTimeout: 120000,
  allScriptsTimeout: 500000,
  multiCapabilities: cap,

  onPrepare() {
    browser.waitForAngularEnabled(false);
    browser.driver.manage().deleteAllCookies();
    global.expect = chai.expect;
    global.assert = chai.assert;
    global.should = chai.should;
    global.screenShotUtils = new screenShotUtils({
      browserInstance: browser
    });
  },

  cucumberOpts: {
    strict: true,
    // format: ['node_modules/cucumber-pretty'],
    format: ['node_modules/cucumber-pretty', 'json:reports_json/results.json'],
    tags: ['@all'],
    require: [
      '../support/timeout.js',
      '../support/world.js',
      '../support/*.js',
      '../features/step_definitions/*.steps.js'
    ]
  },

  plugins: [
    {
      package: 'protractor-multiple-cucumber-html-reporter-plugin',
      options: {
        automaticallyGenerateReport: true,
        removeExistingJsonReportFile: true,
        reportName: 'XUI Manage Organisation Functional Tests',
        // openReportInBrowser: true,
        jsonDir: 'reports/tests/functional',
        reportPath: 'reports/tests/functional'
      }
    }
  ]


};


exports.config = config;
