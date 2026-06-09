const { chromium, firefox, webkit } = require('@playwright/test');
const packageJson = require('@playwright/test/package.json');

const supportedBrowsers = {
  chromium,
  firefox,
  webkit
};

async function verifyBrowser(browserName) {
  const browserType = supportedBrowsers[browserName];
  if (!browserType) {
    throw new Error(`Unsupported Playwright browser "${browserName}". Expected one of: ${Object.keys(supportedBrowsers).join(', ')}`);
  }

  const browser = await browserType.launch();
  await browser.close();
  console.log(`[playwright-verify] ${browserName} launch check passed`);
}

async function main() {
  const browserNames = process.argv.slice(2);
  const browsersToVerify = browserNames.length > 0 ? browserNames : ['chromium'];

  console.log(`[playwright-verify] @playwright/test ${packageJson.version}`);
  console.log(`[playwright-verify] PLAYWRIGHT_BROWSERS_PATH=${process.env.PLAYWRIGHT_BROWSERS_PATH || '<default>'}`);

  for (const browserName of browsersToVerify) {
    await verifyBrowser(browserName);
  }
}

main().catch((error) => {
  console.error('[playwright-verify] Browser verification failed');
  console.error(error);
  process.exit(1);
});
