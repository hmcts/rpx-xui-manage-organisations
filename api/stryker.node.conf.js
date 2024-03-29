// require('dotenv-extended').load({ path: 'api/.env.defaults' });
// eslint-disable-next-line no-undef
module.exports = function (config) {
  config.set({
    // fileLogLevel: 'trace',
    // logLevel: 'trace',
    mutate: ['api/**/*.ts', '!api/**/*.spec.ts', '!api/test/**/*.ts'],
    mutator: 'typescript',
    // transpilers: [
    //   'typescript'
    // ],
    testFramework: 'mocha',
    testRunner: 'mocha',
    reporters: ['clear-text', 'progress', 'html'],
    tsconfigFile: 'tsconfig.json',
    mochaOptions: {
      // opts:'api/test/mocha.opts',
      files: ['api/{,!(test|accounts)/**/}*.spec.ts', '!(api/accounts/index.spec.ts)'],
      timeout: 5000
    },
    htmlReporter: {
      baseDir: 'reports/tests/mutation/node/'
    }
  });
};
