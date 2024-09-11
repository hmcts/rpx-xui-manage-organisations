
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
    chromeOptions: { args: ['--headless', '--no-sandbox', '--disable-dev-shm-usage', '--disable-setuid-sandbox', '--no-zygote ', '--disable-notifications'] },
    proxy: {
      proxyType: 'manual',
      httpProxy: 'proxyout.reform.hmcts.net:8080',
      sslProxy: 'proxyout.reform.hmcts.net:8080',
      noProxy: 'localhost:3000'
    }
  }
];

const config = {
  config: {
    baseUrl: process.env.TEST_URL || 'http://localhost:3000/',
    username: process.env.TEST_USER1_EMAIL,
    password: process.env.TEST_USER1_PASSWORD,
    username_rw: process.env.TEST_USER2_EMAIL,
    password_rw: process.env.TEST_USER2_PASSWORD,
    townleyUser: process.env.TEST_TOWNLEY_EMAIL,
    townleyPassword: process.env.TEST_TOWNLEY_PASSWORD
  },
  twoFactorAuthEnabled: false,
  termsAndConditionsEnabled: true
};

const cucumberOpts = [
  '../support/timeout.js',
  '../support/world.js',
  '../support/*.js',
  '../features/step_definitions/*.steps.js'
];

module.exports = { localConfig, jenkinsConfig, config, cucumberOpts };
