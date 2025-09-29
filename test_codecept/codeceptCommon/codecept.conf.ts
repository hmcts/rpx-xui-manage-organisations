
const report = require("cucumber-html-reporter");
// const { merge } = require('mochawesome-merge')
// const marge = require('mochawesome-report-generator')
const fs = require('fs')
const path = require('path')

const global = require('./globals')
import applicationServer from '../localServer'

var spawn = require('child_process').spawn;
const backendMockApp = require('../backendMock/app');
const statsReporter = require('./statsReporter');
const { setDefaultResultOrder } = require('dns');
setDefaultResultOrder('ipv4first');

let appWithMockBackend = null;
const testType = process.env.TEST_TYPE

const debugMode = process.env.DEBUG && process.env.DEBUG.includes('true')

const parallel = process.env.PARALLEL ? process.env.PARALLEL === "true" : false
const head = process.env.HEAD
console.log(`testType : ${testType}`)
console.log(`parallel : ${parallel}`)
console.log(`headless : ${!head}`)

const TEST_URL = process.env.TEST_URL ? process.env.TEST_URL : 'http://localhost:3000';
let pipelineBranch = (TEST_URL.includes('pr-') || TEST_URL.includes('localhost')) ? "preview" : "master";
let features = ''
if (testType === 'e2e' || testType === 'smoke') {
  features = `../e2e/features/app/**/*.feature`
} else if (testType === 'ngIntegration' && pipelineBranch === 'preview') {
  features = `../ngIntegration/tests/features/**/*.feature`

} else if (testType === 'ngIntegration' && pipelineBranch === 'master') {
  features = `../ngIntegration/tests/features/**/notests.feature`

} else {
  throw new Error(`Unrecognized test type ${testType}`);
}



const functional_output_dir = path.resolve(`${__dirname}/../../functional-output/tests/codecept-${testType}`)


const tags = process.env.DEBUG ? 'functional_debug' : 'fullFunctional'

const grepTags = `(?=.*@${testType === 'smoke' ? 'smoke' : tags})^(?!.*@ignore)^(?!.*@${pipelineBranch === 'preview' ? 'AAT_only' : 'preview_only'})`
console.log(grepTags)

exports.config = {
  timeout: 600,
  "gherkin": {
    "features": features,
    "steps": "../**/*.steps.js"
  },
  grep: grepTags,
  output: functional_output_dir,
  // disableScreenshots: false,
  // fullPageScreenshots: true,
  // uniqueScreenshotNames: true,
  helpers: {
    CustomHelper: {
      require: "./customHelper.js"
    },
    "Mochawesome": {
      "uniqueScreenshotNames": "true"
    },
    Playwright: {
      url: TEST_URL,
      restart: false,
      show: head ? true : false,
      waitForNavigation: "domcontentloaded",
      waitForAction: 500,
      browser: 'chromium'
    }
  },
  plugins: {
    screenshotOnFail: {
      enabled: true,
      fullPageScreenshots: true
    },
    retryFailedStep: {
      enabled: true
    },
    pauseOnFail: {},
    cucumberJsonReporter: {
      require: 'codeceptjs-cucumber-json-reporter',
      enabled: true,               // if false, pass --plugins cucumberJsonReporter
      attachScreenshots: true,     // true by default
      attachComments: true,        // true by default
      outputDir: functional_output_dir,     // cucumber_output.json by default
      fileNamePrefix: 'cucumber_output_',
      uniqueFileNames: true,      // if true outputFile is ignored in favor of unique file names in the format of `cucumber_output_<UUID>.json`.  Useful for parallel test execution
      includeExampleValues: false, // if true incorporate actual values from Examples table along with variable placeholder when writing steps to the report
      timeMultiplier: 1000000,     // Used when calculating duration of individual BDD steps.  Defaults to nanoseconds
    }

  },
  include: {
  },
  retry: {
    Feature: 3

  },
  bootstrap: async () => {
    if (!parallel) {
      await setup()
    }

  },
  teardown: async () => {
    if (!parallel) {
      await teardown()
    }

  },
  bootstrapAll: async () => {
    if (parallel) {
      await setup()
    }

  },
  teardownAll: async () => {
    await generateCucumberReport();
    exitWithStatus();
  }
}


async function exitWithStatus() {
  // Check for failed tests by reading the generated report
  let status = 'PASS';
  try {
    const files = fs.readdirSync(functional_output_dir);
    const reportFile = files.find(f => f.startsWith('cucumber_output') && f.endsWith('.json'));
    const reportPath = reportFile ? path.join(functional_output_dir, reportFile) : '';
    if (fs.existsSync(reportPath)) {
      const reportData = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
      let failed = 0;
      for (const feature of reportData) {
        for (const scenario of feature.elements) {
          if (scenario.steps.some((step: any) => step.result.status === 'failed')) {
            failed++;
          }
        }
      }
      status = failed > 0 ? 'FAIL' : 'PASS';
    }
  } catch (err) {
    console.error('Error checking test results:', err);
    status = 'FAIL';
  }
  process.exit(status === 'PASS' ? 0 : 1);
}

async function setup() {

  if (!debugMode && (testType === 'ngIntegration' || testType === 'a11y')) {
    await backendMockApp.startServer(debugMode);
    await applicationServer.start()
  }

}

async function teardown() {
  if (!debugMode && (testType === 'ngIntegration' || testType === 'a11y')) {
    await backendMockApp.stopServer();
    await applicationServer.stop()
  }
  statsReporter.run();
  await generateCucumberReport();
  await exitWithStatus();
}

async function generateCucumberReport() {
  const jsonDir = functional_output_dir;
  const reportFile = path.join(jsonDir, 'cucumber_report.html');
  await waitForStableJson(jsonDir, 800, 30000);
  const hasJson = fs.existsSync(jsonDir) &&
    fs.readdirSync(jsonDir).some(f => /^cucumber_output.*\.json$/.test(f));
  if (!hasJson) {
    console.warn(`⚠️  No JSON files found in '${jsonDir}'. No HTML report will be created.`);
    return { skipped: true };
  }
  report.generate({
    theme: 'bootstrap',
    jsonDir,
    output: reportFile,
    reportSuiteAsScenarios: true,
    launchReport: false,
    ignoreBadJsonFile: true,
  });
}

async function waitForStableJson(dir: string, quietMs = 800, timeoutMs = 30000) {
  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
  const path = require('path'); const fs = require('fs');
  let lastSig = ''; let stableSince = Date.now();
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    const files = fs.readdirSync(dir).filter((f: string) => /^cucumber_output_.*\.json$/.test(f));
    files.sort();
    const sig = files.map(f => `${f}:${fs.statSync(path.join(dir, f)).size}`).join('|');

    if (sig === lastSig) {
      if (Date.now() - stableSince >= quietMs) return; // stable long enough
    } else {
      lastSig = sig; stableSince = Date.now();
    }
    await sleep(200);
  }
}
