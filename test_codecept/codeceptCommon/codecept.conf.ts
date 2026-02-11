
const report = require("cucumber-html-reporter");
// const { merge } = require('mochawesome-merge')
// const marge = require('mochawesome-report-generator')
const fs = require('fs')
const path = require('path')
const global = require('./globals')

var spawn = require('child_process').spawn;
const statsReporter = require('./statsReporter');
const { setDefaultResultOrder } = require('dns');
setDefaultResultOrder('ipv4first');

const externalServers = process.env.EXTERNAL_SERVERS === 'true';

let appWithMockBackend = null;
const testType = process.env.TEST_TYPE

const debugMode = process.env.DEBUG && process.env.DEBUG.includes('true')

const parallel = process.env.PARALLEL ? process.env.PARALLEL === "true" : false
const head = process.env.HEAD
console.log(`testType : ${testType}`)
console.log(`parallel : ${parallel}`)
console.log(`headless : ${!head}`)


const TEST_URL = process.env.TEST_URL || '';
const pipelineBranch = externalServers //   running against localhost
  ? 'local' //   value won’t be used later
  : (TEST_URL.includes('pr-') || TEST_URL.includes('manage-org.aat.platform.hmcts.net')
    ? 'preview'
    : 'master');
let features = ''
if (testType === 'e2e' || testType === 'smoke') {
  features = `../e2e/features/app/**/*.feature`
} else if (testType === 'ngIntegration' && (pipelineBranch === 'preview' || pipelineBranch === 'local')) {
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
      url: externalServers ? (process.env.WEB_BASE_URL || 'http://localhost:3000')
        : TEST_URL,
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
  // Check for failed tests by reading all generated cucumber json reports
  const jsonFiles = fs.existsSync(functional_output_dir)
    ? fs.readdirSync(functional_output_dir).filter(f => /^cucumber_output.*\.json$/.test(f))
    : [];

  if (!jsonFiles.length) {
    console.error(`No cucumber json files found in '${functional_output_dir}', failing build.`);
    process.exit(1);
  }

  let failedScenarios = 0;
  let totalScenarios = 0;

  for (const file of jsonFiles) {
    const reportPath = path.join(functional_output_dir, file);
    try {
      const reportData = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
      for (const feature of reportData) {
        for (const scenario of feature.elements || []) {
          totalScenarios++;
          const steps = scenario.steps || [];
          if (steps.some((step: any) => step.result?.status === 'failed')) {
            failedScenarios++;
          }
        }
      }
    } catch (err) {
      console.error(`Error checking test results in '${reportPath}':`, err);
      process.exit(1);
    }
  }

  console.log(`Cucumber results: ${totalScenarios} scenario(s), ${failedScenarios} failed across ${jsonFiles.length} file(s).`);
  process.exit(failedScenarios > 0 ? 1 : 0);
}

async function setup() {

  if (!externalServers && !debugMode && (testType === 'ngIntegration' || testType === 'a11y')) {
    const backendMockApp = require('../backendMock/app');
    const applicationServer = require('../localServer').default;
    await backendMockApp.startServer(debugMode);
    await applicationServer.start()
  }

}

async function teardown() {
  if (!externalServers && !debugMode && (testType === 'ngIntegration' || testType === 'a11y')) {
    const backendMockApp = require('../backendMock/app');
    const applicationServer = require('../localServer').default;
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
