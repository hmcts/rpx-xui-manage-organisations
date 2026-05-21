#!/usr/bin/env node

const [mode = 'fail', command = 'legacy Codecept runner'] = process.argv.slice(2);

const replacements = [
  'yarn test:api:pw',
  'yarn test:playwright:integration',
  'yarn test:a11y:playwright',
  'PLAYWRIGHT_TAGS=@e2e yarn test:playwrightE2E'
];

const bridgeCommands = new Set(['test:functional', 'test:fullfunctional']);
const isBridge = mode === 'bridge' || bridgeCommands.has(command);

console.log(`Legacy Manage Org functional runner "${command}" is retired.`);
console.log('Authoritative Manage Org functional gates now run through Playwright:');
for (const replacement of replacements) {
  console.log(`- ${replacement}`);
}

if (isBridge) {
  console.log('This shared Jenkins hook is intentionally a no-op bridge to avoid duplicate Playwright execution.');
  process.exit(0);
}

console.error(`"${command}" must not be used for new validation. Use the Playwright replacement above.`);
process.exit(1);
