const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const minimist = require('minimist');
const { localConfig, jenkinsConfig, cucumberOpts } = require('./common.conf');
chai.use(chaiAsPromised);

const argv = minimist(process.argv.slice(2));

const cap = (argv.local) ? localConfig : jenkinsConfig;

const config = {
  framework: 'custom',
  specs: ['../features/**/*.feature'],
  baseUrl: process.env.TEST_URL || 'https://xui-mo-webapp-aat.service.core-compute-aat.internal/',
  params: {
    serverUrls: process.env.TEST_URL || 'https://xui-mo-webapp-aat.service.core-compute-aat.internal/',
    targetEnv: argv.env || 'local',
    username: process.env.TEST_USER1_EMAIL,
    password: process.env.TEST_USER1_PASSWORD,
    username_rw: process.env.TEST_USER2_EMAIL,
    password_rw: process.env.TEST_USER2_PASSWORD,
    townleyUser: process.env.TEST_TOWNLEY_EMAIL,
    townleyPassword: process.env.TEST_TOWNLEY_PASSWORD
  },
  directConnect: true,
  // seleniumAddress: 'http://localhost:4444/wd/hub',
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
    format: ['json:reports/tests/functional/results.json'],
    tags: ['@all or @smoke or @fullFunctional or @end2end', 'not @Flaky'],
    //  tags: ['@edit'],
    require: cucumberOpts
  },

};

exports.config = config;
