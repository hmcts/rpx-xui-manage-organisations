import { expect, test } from '@playwright/test';

import e2eConfig from '../../../playwright.e2e.config';
import { WAVE_LIKE_A11Y_TAG } from '../../E2E/utils/accessibility/waveLikeAccessibility';

const { includesWaveLikeA11y } = (e2eConfig as {
  __test__: {
    includesWaveLikeA11y: (env: NodeJS.ProcessEnv) => boolean;
  };
}).__test__;

test.describe('WAVE-like accessibility tag contract', { tag: '@svc-internal' }, () => {
  test('uses the PR-actionable WAVE-like accessibility tag', () => {
    expect(WAVE_LIKE_A11Y_TAG).toBe('@wave-a11y');
  });

  test('keeps WAVE-like accessibility off by default', () => {
    expect(includesWaveLikeA11y({})).toBe(false);
  });

  test('allows parameterized WAVE-like accessibility runs by tag or switch', () => {
    expect(includesWaveLikeA11y({ PLAYWRIGHT_TAGS: '@wave-a11y' })).toBe(true);
    expect(includesWaveLikeA11y({ PLAYWRIGHT_INCLUDE_WAVE_A11Y: 'true' })).toBe(true);
  });
});
