import { strict as assert } from 'assert';
import { mkdtemp, readFile, readdir, rm } from 'fs/promises';
import { tmpdir } from 'os';
import * as path from 'path';
import { createRequire } from 'module';
import * as sinon from 'sinon';
import type { Page, TestInfo } from '@playwright/test';
import { auditAccessibilityPage, type AccessibilityEngine } from '../../E2E/utils/accessibility/accessibilityAudit';
import * as axe from '../../E2E/utils/accessibility/axeEvidence';
import * as wave from '../../E2E/utils/accessibility/waveLikeAccessibility';
import * as reader from '../../E2E/utils/accessibility/screenReaderLikeAccessibility';
import * as publisher from '../../E2E/utils/accessibility/accessibilityEvidencePublisher';

const enhancer = createRequire(__filename)('../../common/reporters/odhin-report-enhancer.cjs');

describe('accessibility audit engine failures', () => {
  const engines: AccessibilityEngine[] = ['axe', 'wave-like', 'screen-reader'];
  const secret = 'PRIVATE_TOKEN https://private.invalid/case <private-dom> private-stack';
  const options = { defaultEngines: engines, feature: 'test', pageState: 'audit', strict: false };
  let directory: string;
  let environment: NodeJS.ProcessEnv;
  let attachments: Record<string, string>;
  let page: Page;
  let info: TestInfo;

  beforeEach(async () => {
    environment = { ...process.env };
    delete process.env.A11Y_ENGINES;
    delete process.env.PLAYWRIGHT_A11Y_ENGINES;
    directory = path.join(await mkdtemp(path.join(tmpdir(), 'a11y-engine-errors-')), 'accessibility-evidence');
    process.env.PW_A11Y_EVIDENCE_DIR = directory;
    attachments = {};
    page = { url: () => 'about:blank', evaluate: sinon.stub().rejects(new Error(secret)) } as unknown as Page;
    info = {
      title: 'engine failure',
      attach: async (name: string, attachment: { body: string }) => {
        attachments[name] = attachment.body;
      }
    } as unknown as TestInfo;
    sinon.stub(axe, 'runAxeAudit').resolves({ violations: [] } as never);
    sinon.stub(axe, 'attachAccessibilityEvidence').resolves();
    sinon.stub(wave, 'collectWaveLikeAccessibilityViolations').resolves([]);
    sinon.stub(wave, 'attachWaveLikeAccessibilityEvidence').resolves();
    sinon.stub(reader, 'collectScreenReaderLikeAccessibilityViolations').resolves({ violations: [] } as never);
    sinon.stub(reader, 'attachScreenReaderLikeAccessibilityEvidence').resolves();
  });

  afterEach(async () => {
    sinon.restore();
    for (const name of ['A11Y_ENGINES', 'PLAYWRIGHT_A11Y_ENGINES', 'PW_A11Y_EVIDENCE_DIR']) {
      if (environment[name] === undefined) {
        delete process.env[name];
      } else {
        process.env[name] = environment[name];
      }
    }
    await rm(path.dirname(directory), { recursive: true, force: true });
  });

  for (const [index, engine] of engines.entries()) {
    for (const strict of [false, true]) {
      it(`publishes sanitized ${engine} rejection and continues independent engines (strict=${strict})`, async () => {
        const collectors = [axe.runAxeAudit, wave.collectWaveLikeAccessibilityViolations, reader.collectScreenReaderLikeAccessibilityViolations];
        const thrown = [new Error(secret), secret, { message: secret, stack: secret }][index];
        (collectors[index] as sinon.SinonStub).callsFake(async () => {
          throw thrown;
        });
        const operation = auditAccessibilityPage(page, info, { ...options, strict });
        if (strict) {
          await assert.rejects(operation, (error: Error) => {
            assert.match(error.message, /Accessibility issue\(s\)/);
            assert.ok(!error.message.includes(secret));
            assert.ok(attachments['test-audit-page-summary.html']);
            return true;
          });
        } else {
          await operation;
        }
        collectors.forEach((collector) => sinon.assert.calledOnce(collector as sinon.SinonStub));
        sinon.assert.callOrder(...collectors as sinon.SinonStub[]);
        const outcomes = JSON.parse(attachments['accessibility-audit-summary.json']).outcomes;
        assert.deepEqual(outcomes[index], {
          engine, status: 'error', issueCount: 0, unexpectedIssueCount: 0,
          rules: [], message: `${engine} accessibility audit or evidence collection failed.`
        });
        assert.equal(outcomes.filter((outcome: { status: string }) => outcome.status === 'passed').length, 2);
        const manifest = JSON.parse(await readFile(path.join(directory, 'manifest.json'), 'utf8'));
        assert.equal(manifest[0].status, 'error');
        assert.equal(manifest[0].violationCount, 0);
        const records = enhancer.__test__.readAccessibilityEvidence(path.dirname(directory));
        assert.equal(records.length, 1);
        assert.equal(records[0].unavailable, true);
        const summary = JSON.parse(await readFile(path.join(directory, manifest[0].jsonFileName), 'utf8'));
        assert.deepEqual(summary.outcomes, outcomes);
        assert.equal(summary.snapshot.title, 'Page snapshot unavailable');
        assert.match(await readFile(path.join(directory, manifest[0].htmlFileName), 'utf8'), /error/);
        const contents = await Promise.all((await readdir(directory)).map((file) => readFile(path.join(directory, file), 'utf8')));
        assert.ok(!JSON.stringify([attachments, contents]).includes(secret));
      });
    }
  }

  it('captures an engine evidence rejection and still runs the following engine', async () => {
    (wave.attachWaveLikeAccessibilityEvidence as sinon.SinonStub).rejects(new Error(secret));
    await auditAccessibilityPage(page, info, options);
    const outcomes = JSON.parse(attachments['accessibility-audit-summary.json']).outcomes;
    assert.equal(outcomes[1].status, 'error');
    assert.equal(outcomes[2].status, 'passed');
  });

  it('keeps a clean strict audit passing', async () => {
    await auditAccessibilityPage(page, info, { ...options, strict: true });
    const manifest = JSON.parse(await readFile(path.join(directory, 'manifest.json'), 'utf8'));
    assert.equal(manifest[0].status, 'passed');
  });

  for (const known of [false, true]) {
    it(`preserves strict violation handling (known=${known})`, async () => {
      (axe.runAxeAudit as sinon.SinonStub).resolves({
        violations: [{ id: 'test-rule', description: 'test description', nodes: [{}] }]
      });
      const operation = auditAccessibilityPage(page, info, {
        ...options, strict: true,
        axeKnownViolations: known ? [{ id: 'test-rule', description: 'test description', maxNodes: 1 }] : []
      });
      if (known) {
        await operation;
      } else {
        await assert.rejects(operation, /Accessibility issue\(s\)/);
      }
      const manifest = JSON.parse(await readFile(path.join(directory, 'manifest.json'), 'utf8'));
      assert.equal(manifest[0].status, known ? 'passed' : 'issues-found');
      assert.equal(manifest[0].violationCount, known ? 0 : 1);
    });
  }

  it('publishes all engine errors when the page snapshot is unavailable', async () => {
    for (const collector of [axe.runAxeAudit, wave.collectWaveLikeAccessibilityViolations, reader.collectScreenReaderLikeAccessibilityViolations]) {
      (collector as sinon.SinonStub).rejects(new Error(secret));
    }
    await assert.rejects(auditAccessibilityPage(page, info, { ...options, strict: true }), /Accessibility issue\(s\)/);
    const outcomes = JSON.parse(attachments['accessibility-audit-summary.json']).outcomes;
    assert.deepEqual(outcomes.map((outcome: { status: string }) => outcome.status), ['error', 'error', 'error']);
    const manifest = JSON.parse(await readFile(path.join(directory, 'manifest.json'), 'utf8'));
    assert.equal(manifest[0].status, 'error');
  });

  it('retains a sanitized available snapshot', async () => {
    (page.evaluate as sinon.SinonStub).resolves({
      title: secret, url: secret, headings: [{ level: 1, text: secret }],
      landmarks: [], keyboardOrder: [], liveRegions: [], axTree: []
    });
    await auditAccessibilityPage(page, info, options);
    const summary = JSON.parse(attachments['test-audit-page-summary.json']);
    assert.equal(summary.snapshot.title, '[redacted title]');
    assert.ok(!JSON.stringify(summary).includes(secret));
  });

  for (const strict of [false, true]) {
    it(`propagates final attachment failure (strict=${strict})`, async () => {
      sinon.stub(info, 'attach').callsFake(async (name: string) => {
        if (name === 'test-audit-page-summary.html') {
          throw new Error('attachment failed');
        }
      });
      await assert.rejects(auditAccessibilityPage(page, info, { ...options, strict }), /attachment failed/);
    });

    it(`propagates final publication failure (strict=${strict})`, async () => {
      sinon.stub(publisher, 'publishAccessibilityEvidence').rejects(new Error('publication failed'));
      await assert.rejects(auditAccessibilityPage(page, info, { ...options, strict }), /publication failed/);
    });
  }
});
