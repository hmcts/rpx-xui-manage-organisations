const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const { localConfig, jenkinsConfig, cucumberOpts } = require('./common.conf');
const minimist = require('minimist');

const screenShotUtils = require('protractor-screenshot-utils').ProtractorScreenShotUtils;

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
    format: ['node_modules/@cucumber/pretty-formatter', 'json:reports_json/results.json'],
    tags: ['@all or @fullFunctional', 'not @Flaky'],
    // tags: ['@all or @smoke or @fullFunctional or @end2end'],
    require: cucumberOpts
  },

  plugins: [
    {
      package: 'protractor-multiple-cucumber-html-reporter-plugin',
      options: {
        automaticallyGenerateReport: true,
        removeExistingJsonReportFile: true,
        reportName: 'XUI Functional Tests',
        jsonDir: 'functional-output/tests/functional',
        reportPath: 'functional-output/tests/functional'
      }
    }
  ]
};

exports.config = config;
