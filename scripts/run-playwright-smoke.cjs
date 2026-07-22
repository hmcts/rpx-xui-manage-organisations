#!/usr/bin/env node

const { spawnSync } = require('node:child_process');
const path = require('node:path');

const splitTagInput = (raw) =>
  Array.from(
    new Set(
      String(raw ?? '')
        .split(/[\s,]+/)
        .map((tag) => tag.trim())
        .filter((tag) => tag && tag !== '@none')
        .map((tag) => (tag.startsWith('@') ? tag : `@${tag}`))
    )
  );

const resolveBooleanFlag = (raw) => ['1', 'true', 'yes', 'on'].includes(String(raw ?? '').trim().toLowerCase());

const hasCliOption = (args, name) => args.some((arg) => arg === name || arg.startsWith(`${name}=`));

const buildSmokePlaywrightArgs = (env = process.env, extraArgs = process.argv.slice(2)) => {
  const args = ['test', '--project=smoke', ...extraArgs.filter((arg) => arg !== '--')];
  const smokeGloballyExcluded =
    !resolveBooleanFlag(env.PLAYWRIGHT_IGNORE_GLOBAL_EXCLUDES) &&
    splitTagInput(env.PLAYWRIGHT_GLOBAL_EXCLUDED_TAGS).includes('@e2e-smoke');

  if (smokeGloballyExcluded) {
    if (!hasCliOption(args, '--pass-with-no-tests')) {
      args.push('--pass-with-no-tests');
    }
    if (!hasCliOption(args, '--reporter')) {
      args.push('--reporter=list');
    }
  }

  return args;
};

const run = () => {
  const playwrightCli = path.join(path.dirname(require.resolve('playwright/package.json')), 'cli.js');
  const result = spawnSync(process.execPath, [playwrightCli, ...buildSmokePlaywrightArgs()], { stdio: 'inherit' });
  if (result.error) {
    throw result.error;
  }
  process.exit(result.status ?? 1);
};

if (require.main === module) {
  run();
}

module.exports = { buildSmokePlaywrightArgs, splitTagInput };
