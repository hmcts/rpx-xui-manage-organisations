require('dotenv-extended').load({ path: '.env.defaults' });
module.exports = function (config) {
    config.set({
        // fileLogLevel: 'trace',
        // logLevel: 'trace',
        mutate: ["**/*.ts", "!**/*.spec.ts", "!test/**/*.ts"],
        mutator: 'typescript',
        // transpilers: [
        //     'typescript'
        // ],
        testFramework: "mocha",
        testRunner: "mocha",
        reporters: ["clear-text", "progress", "html"],
        tsconfigFile: './tsconfig.json',
        mochaOptions: {
            opts:'test/mocha.opts',
            spec: ["**/*.spec.ts", "!services/serviceAuth.spec.ts", "!accounts/*.spec.ts"],
            // timeout: 5000
        },
        htmlReporter: {
            baseDir: 'reports/tests/mutation/node/'
        }
    });
}