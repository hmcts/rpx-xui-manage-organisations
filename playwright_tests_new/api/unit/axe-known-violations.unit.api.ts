import { expect, test } from '@playwright/test';

import { findUnexpectedAxeViolations, summarizeAxeViolations } from '../../E2E/utils/accessibility/axeKnownViolations';

test.describe('Axe known-violation classification', { tag: '@svc-internal' }, () => {
  test('summarises violations by node count and keeps deterministic rule order', () => {
    expect(
      summarizeAxeViolations([
        { id: 'color-contrast', description: 'Contrast is insufficient', nodes: [{}, {}] },
        { id: 'button-name', description: 'Buttons must have discernible text' }
      ])
    ).toEqual([
      { id: 'button-name', description: 'Buttons must have discernible text', nodeCount: 0 },
      { id: 'color-contrast', description: 'Contrast is insufficient', nodeCount: 2 }
    ]);
  });

  test('returns only unknown violations and known violations above their baseline', () => {
    const actual = summarizeAxeViolations([
      { id: 'button-name', description: 'Buttons must have discernible text', nodes: [{}] },
      { id: 'color-contrast', description: 'Contrast is insufficient', nodes: [{}, {}] },
      { id: 'landmark', description: 'Content should be within landmarks', nodes: [{}] }
    ]);

    expect(
      findUnexpectedAxeViolations(actual, [
        { id: 'button-name', description: 'Buttons must have discernible text', maxNodes: 1 },
        { id: 'color-contrast', description: 'Contrast is insufficient', maxNodes: 1 }
      ])
    ).toEqual([
      { id: 'color-contrast', description: 'Contrast is insufficient', nodeCount: 2 },
      { id: 'landmark', description: 'Content should be within landmarks', nodeCount: 1 }
    ]);
  });
});
