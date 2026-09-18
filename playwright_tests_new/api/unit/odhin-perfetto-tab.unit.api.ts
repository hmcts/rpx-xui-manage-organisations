import { expect, test } from '@playwright/test';
import { createRequire } from 'node:module';

const enhancer = createRequire(__filename)('../../common/reporters/odhin-report-enhancer.cjs');
const OdhinAdaptiveReporter = createRequire(__filename)('../../common/reporters/odhin-adaptive.reporter.cjs');

const baseHtml = '<html><body><div class="tab"><button class="main-tablinks">Tests</button></div></body></html>';

test('adds a Perfetto Results tab with the Jenkins artifact link', () => {
  const html = enhancer.__test__.enhanceDashboardHtml(
    baseHtml,
    [],
    ['perfetto.json'],
    'https://build.hmcts.net/job/example/1/artifact/functional-output/tests/playwright-integration/test-results'
  );

  expect(html).toContain('Perfetto Results');
  expect(html).toContain(
    'https://build.hmcts.net/job/example/1/artifact/functional-output/tests/playwright-integration/test-results/perfetto.json'
  );
});

test('always keeps Odhín attachments external', () => {
  let receivedOptions: Record<string, unknown> | undefined;
  new OdhinAdaptiveReporter({
    embedAttachments: true,
    createInnerReporter: (options: Record<string, unknown>) => {
      receivedOptions = options;
      return {};
    },
  });

  expect(receivedOptions?.embedAttachments).toBe(false);
});
