import { expect, test } from '@playwright/test';

import { isAccessibilityStrictMode, resolveAccessibilityEngines } from '../../E2E/utils/accessibility/accessibilityAudit';

const defaultEngines = ['axe', 'wave-like', 'screen-reader'] as const;
const originalEnvironment = {
  A11Y_ENGINES: process.env.A11Y_ENGINES,
  PLAYWRIGHT_A11Y_ENGINES: process.env.PLAYWRIGHT_A11Y_ENGINES,
  A11Y_STRICT: process.env.A11Y_STRICT
};

test.describe('accessibility audit configuration', { tag: '@svc-internal' }, () => {
  test.afterEach(() => {
    for (const [name, value] of Object.entries(originalEnvironment)) {
      if (value === undefined) {
        delete process.env[name];
      } else {
        process.env[name] = value;
      }
    }
  });

  test('uses the configured defaults when no engine override is present', () => {
    expect(resolveAccessibilityEngines([...defaultEngines])).toEqual([...defaultEngines]);
  });

  test('resolves supported aliases, removes duplicates and ignores unsupported defaults', () => {
    process.env.A11Y_ENGINES = 'ax, wave, waveLike, sr, nvda, jaws, screenReader';

    expect(resolveAccessibilityEngines(['axe', 'screen-reader'])).toEqual(['axe', 'screen-reader']);
  });

  test('supports all and the legacy environment variable', () => {
    process.env.PLAYWRIGHT_A11Y_ENGINES = 'all';

    expect(resolveAccessibilityEngines([...defaultEngines])).toEqual([...defaultEngines]);
  });

  test('rejects unknown engines with the unsupported values', () => {
    process.env.A11Y_ENGINES = 'axe, lighthouse, unknown';

    expect(() => resolveAccessibilityEngines([...defaultEngines])).toThrow(
      'Unsupported accessibility engine(s): lighthouse, unknown'
    );
  });

  test('rejects an engine that the current test does not enable', () => {
    process.env.A11Y_ENGINES = 'wave-like';

    expect(() => resolveAccessibilityEngines(['axe', 'screen-reader'])).toThrow(
      'No requested accessibility engine is enabled for this test'
    );
  });

  test('recognises enabled strict-mode values and defaults to non-strict', () => {
    expect(isAccessibilityStrictMode()).toBe(false);

    for (const value of ['1', 'true', 'YES', 'on']) {
      process.env.A11Y_STRICT = value;
      expect(isAccessibilityStrictMode()).toBe(true);
    }

    process.env.A11Y_STRICT = 'false';
    expect(isAccessibilityStrictMode()).toBe(false);
  });
});
