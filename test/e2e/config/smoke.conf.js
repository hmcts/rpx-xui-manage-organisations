const chai = require('chai');
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised);

var { localConfig, jenkinsConfig, cucumberOpts } = require('./common.conf');
const minimist = require('minimist');

var screenShotUtils = require("protractor-screenshot-utils").ProtractorScreenShotUtils;

const argv = minimist(process.argv.slice(2));
const cap = (argv.local) ? localConfig : jenkinsConfig;

const config = {
  framework: 'custom',
  frameworkPath: require.resolve('protractor-cucumber-framework'),
  baseUrl: process.env.TEST_URL || 'http://localhost:3000/',
  specs: ['../features/**/*.feature'],
  params: {
    serverUrls: process.env.TEST_URL || 'http://localhost:3000/',
    targetEnv: argv.env || 'local'
  },

  directConnect: true,
  getPageTimeout: 120000,
  allScriptsTimeout: 500000,
  multiCapabilities: cap,

  onPrepare() {
    browser.waitForAngularEnabled(false);
    global.expect = chai.expect;
    global.assert = chai.assert;
    global.should = chai.should;
    global.screenShotUtils = new screenShotUtils({
      browserInstance: browser
    });
  },

  cucumberOpts: {
    strict: true,
    format: ['node_modules/cucumber-pretty', 'json:reports_json/results.json'],
    tags: ['@smoke'],
    require: cucumberOpts
  },

  plugins: [
    {
      package: 'protractor-multiple-cucumber-html-reporter-plugin',
      options: {
        automaticallyGenerateReport: true,
        removeExistingJsonReportFile: true,
        reportName: 'XUI Smoke Tests',
        jsonDir: 'reports/tests/smoke',
        reportPath: 'reports/tests/smoke'
      }
    }
  ]
};


exports.config = config;
