import { expect, test, type Page, type TestInfo } from '@playwright/test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import e2eConfig from '../../../playwright.e2e.config';
import { attachWaveLikeAccessibilityEvidence, WAVE_LIKE_A11Y_TAG } from '../../E2E/utils/accessibility/waveLikeAccessibility';

const { includesWaveLikeA11y } = (
  e2eConfig as {
    __test__: {
      includesWaveLikeA11y: (env: NodeJS.ProcessEnv) => boolean;
    };
  }
).__test__;

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

  test('captures compact WAVE-like evidence when no issues are found', async () => {
    const previousEvidenceDir = process.env.PW_A11Y_EVIDENCE_DIR;
    const evidenceDir = fs.mkdtempSync(path.join(os.tmpdir(), 'manage-org-wave-evidence-'));
    const attachments: string[] = [];

    try {
      process.env.PW_A11Y_EVIDENCE_DIR = evidenceDir;
      await attachWaveLikeAccessibilityEvidence(
        {
          screenshot: async () => Buffer.from('screenshot'),
          url: () => 'https://manage-org.example.test/no-issues'
        } as unknown as Page,
        {
          attach: async (name: string) => {
            attachments.push(name);
          },
          title: 'no issue state'
        } as unknown as TestInfo,
        []
      );

      expect(attachments).toEqual([
        'wave-accessibility-issues.json',
        'wave-accessibility-issues.html',
        'wave-accessibility-issues-highlighted-screenshot.png'
      ]);
      expect(fs.readdirSync(evidenceDir)).toContain('manifest-entry-no-issue-state-wave-accessibility-issues.json');
      expect(fs.readFileSync(path.join(evidenceDir, 'no-issue-state-wave-accessibility-issues.html'), 'utf8')).toContain(
        'NO WAVE-LIKE ACCESSIBILITY ISSUES FOUND'
      );
    } finally {
      if (previousEvidenceDir === undefined) {
        delete process.env.PW_A11Y_EVIDENCE_DIR;
      } else {
        process.env.PW_A11Y_EVIDENCE_DIR = previousEvidenceDir;
      }
      fs.rmSync(evidenceDir, { recursive: true, force: true });
    }
  });

  test('includes developer code-location hints in WAVE-like evidence', async () => {
    const previousEvidenceDir = process.env.PW_A11Y_EVIDENCE_DIR;
    const evidenceDir = fs.mkdtempSync(path.join(os.tmpdir(), 'manage-org-wave-evidence-'));
    const attachments: Record<string, string> = {};

    try {
      process.env.PW_A11Y_EVIDENCE_DIR = evidenceDir;
      await attachWaveLikeAccessibilityEvidence(
        {
          evaluate: async () => undefined,
          screenshot: async () => Buffer.from('screenshot'),
          url: () => 'https://manage-org.example.test/issue'
        } as unknown as Page,
        {
          attach: async (name: string, attachment: { body?: string | Buffer }) => {
            attachments[name] = attachment.body?.toString() ?? '';
          },
          title: 'issue state'
        } as unknown as TestInfo,
        [
          {
            rule: 'accessible-name',
            message: 'Interactive controls and links should expose an accessible name.',
            selector: '#continue',
            html: '<button id="continue" class="govuk-button"></button>',
            codeLocation: {
              tag: 'button',
              id: 'continue',
              classes: 'govuk-button',
              nearestHeading: 'h1: Register organisation'
            }
          }
        ]
      );

      const html = attachments['wave-accessibility-issues.html'];
      const json = fs.readFileSync(path.join(evidenceDir, 'issue-state-wave-accessibility-issues.json'), 'utf8');
      expect(html).toContain('Developer advice');
      expect(html).toContain('What to fix');
      expect(html).toContain('Fix path');
      expect(html).toContain('search selector #continue');
      expect(html).toContain('class: govuk-button');
      expect(html).toContain('Fix the template first: add visible text, a govukLabel/label');
      expect(json).toContain('"classes": "govuk-button"');
      expect(json).toContain('"advice": "Fix the template first: add visible text, a govukLabel/label');
    } finally {
      if (previousEvidenceDir === undefined) {
        delete process.env.PW_A11Y_EVIDENCE_DIR;
      } else {
        process.env.PW_A11Y_EVIDENCE_DIR = previousEvidenceDir;
      }
      fs.rmSync(evidenceDir, { recursive: true, force: true });
    }
  });
});
