#!/usr/bin/env node

const replacements = [
  'yarn test:api:pw',
  'yarn test:playwright:integration',
  'yarn test:a11y:playwright',
  'PLAYWRIGHT_TAGS=@e2e yarn test:playwrightE2E'
];

const bridgeCommands = new Set(['test:functional', 'test:fullfunctional']);

const resolveRetiredRunnerOutcome = (mode = 'fail', command = 'legacy Codecept runner') => {
  const isBridge = mode === 'bridge' && bridgeCommands.has(command);
  const isFailMode = mode === 'fail';

  if (isBridge) {
    return {
      bridge: true,
      exitCode: 0,
      reason: 'This shared Jenkins hook is intentionally a no-op bridge to avoid duplicate Playwright execution.'
    };
  }

  return {
    bridge: false,
    exitCode: 1,
    reason: isFailMode
      ? `"${command}" must not be used for new validation. Use the Playwright replacement above.`
      : `"${command}" is not an allowed retired-runner bridge command.`
  };
};

const run = (argv = process.argv.slice(2), logger = console) => {
  const [mode = 'fail', command = 'legacy Codecept runner'] = argv;
  const outcome = resolveRetiredRunnerOutcome(mode, command);

  logger.log(`Legacy Manage Org functional runner "${command}" is retired.`);
  logger.log('Authoritative Manage Org functional gates now run through Playwright:');
  for (const replacement of replacements) {
    logger.log(`- ${replacement}`);
  }

  if (outcome.bridge) {
    logger.log(outcome.reason);
  } else {
    logger.error(outcome.reason);
  }

  return outcome.exitCode;
};

if (require.main === module) {
  process.exit(run());
}

module.exports = {
  bridgeCommands,
  replacements,
  resolveRetiredRunnerOutcome,
  run
};
