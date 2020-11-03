
module.exports = function (config) {
    config.set({
        // fileLogLevel: 'trace',
        // logLevel: 'trace',
        files: ["config/*.*", "api/**/*.ts", 
        "!api/accounts/*.ts", 
        "!api/inviteUser/*.ts", 
        "!api/organisation/*.ts",
        "!api/suspendUser/*.ts",
        "!api/userList/*.ts",
            
    ],
        mutate: ["api/**/*.ts", "!api/**/*.spec.ts", "!api/test/**/*.ts"],
        mutator: 'typescript',
        // transpilers: [
        //     'typescript'
        // ],
        testFramework: "mocha",
        testRunner: "mocha",
        reporters: ["clear-text", "progress", "html"],
        tsconfigFile: 'api/tsconfig.json',
        mochaOptions: {
            // opts:'api/test/mocha.opts',
            files: ["api/{,!(test|accounts)/**/}*.spec.ts", "!(api/{accounts|inviteUser|organisation|suspendUser|userList|configuration|configurationUI}/index.spec.ts)"],
            timeout: 5000
        },
        htmlReporter: {
            baseDir: 'reports/tests/mutation/node/'
        }
    });
}