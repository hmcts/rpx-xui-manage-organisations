/**
 * @type {import('@stryker-mutator/api/core').StrykerOptions}
 */
module.exports = {
  mutator: 'typescript',
  transpilers: ["typescript"],
  // files: ["!api/accounts/*.ts"],
  packageManager: "yarn",
  reporters: ["html", "clear-text", "progress"],
  testRunner: "mocha",
  coverageAnalysis: "off",
  tsconfigFile: 'api/tsconfig.json', // Location of your tsconfig.json file
  mutator: 'typescript', // Specify that you want to mutate typescript code
  mochaOptions:{
    opts: "./api/test/mocha.opts",
    spec: ["./api/**/*.ts"],
    extension: ["ts","tsx"  ],
    // config: "true"
  },
  maxConcurrentTestRunners: 2

};







