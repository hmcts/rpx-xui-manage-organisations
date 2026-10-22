/* global clearTimeout, process, require, module, setTimeout */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const odhinModule = require('odhin-reports-playwright');
const { createEmptyFeatureStat, deriveFeatureName, enhanceGeneratedReport, extractAxeEvidence } = require('./odhin-report-enhancer.cjs');

const OdhinReporter = odhinModule.default ?? odhinModule;
const terminalStatusesNoRetry = ['passed', 'flaky', 'skipped', 'interrupted'];

class OdhinAdaptiveReporter {
  constructor(options = {}) {
    // Keep traces and screenshots beside the published report; never serialize them into Odhín HTML.
    const reporterOptions = { ...options, embedAttachments: false };
    this.options = reporterOptions;
    this.outputFolder = reporterOptions.outputFolder;
    const configuredLightweight = reporterOptions.lightweight;
    const envLightweight = process.env.PW_ODHIN_LIGHTWEIGHT;
    this.lightweight =
      typeof configuredLightweight === 'boolean'
        ? configuredLightweight
        : envLightweight
          ? envLightweight.toLowerCase() === 'true'
          : !process.env.CI;

    const normalizeTestOutputMode = (raw) => {
      if (raw === true || raw === false) {
        return raw;
      }
      const normalized = String(raw ?? 'only-on-failure')
        .trim()
        .toLowerCase();
      if (normalized === 'true') {
        return true;
      }
      if (normalized === 'false') {
        return false;
      }
      return 'only-on-failure';
    };

    // Keep stdout/stderr only for failed tests in default mode.
    this.testOutputMode = normalizeTestOutputMode(reporterOptions.testOutput);
    this.profileEnabled =
      typeof reporterOptions.profile === 'boolean'
        ? reporterOptions.profile
        : process.env.PW_ODHIN_PROFILE
          ? process.env.PW_ODHIN_PROFILE.toLowerCase() === 'true'
          : true;
    const configuredRuntimeHookTimeoutMs = reporterOptions.runtimeHookTimeoutMs ?? process.env.PW_ODHIN_RUNTIME_HOOK_TIMEOUT_MS;
    this.runtimeHookTimeoutMs = normalizeRuntimeHookTimeoutMs(configuredRuntimeHookTimeoutMs, process.env.CI ? 0 : 15000);
    this.statusCounts = {
      passed: 0,
      failed: 0,
      skipped: 0,
      timedOut: 0,
      interrupted: 0,
      other: 0,
    };
    this.trimmedCounts = {
      output: 0,
      heavyArtifacts: 0,
    };
    this.runtimeHookStats = {
      queued: 0,
      completed: 0,
      timedOut: 0,
      failed: 0,
    };
    this.featureStats = new Map();
    this.testMetadata = [];
    this.axeEvidence = [];
    this.firstInnerCallbackError = null;
    this.finalizationStartedAt = 0;
    this.pendingInnerCallbacks = Promise.resolve();
    this.inner =
      typeof reporterOptions.createInnerReporter === 'function'
        ? reporterOptions.createInnerReporter(reporterOptions)
        : new OdhinReporter(reporterOptions);
  }

  async onBegin(config, suite) {
    if (typeof this.inner.onBegin === 'function') {
      await this.inner.onBegin(config, suite);
    }
  }

  async onTestEnd(test, result) {
    if (typeof this.inner.onTestEnd !== 'function') {
      return;
    }

    let nextResult = result;
    const passedOrSkipped = result?.status === 'passed' || result?.status === 'skipped';
    const shouldTrimHeavyArtifacts = this.lightweight && passedOrSkipped;

    const shouldDropTestOutput = this.testOutputMode === false || (this.testOutputMode === 'only-on-failure' && passedOrSkipped);

    if (shouldTrimHeavyArtifacts || shouldDropTestOutput) {
      nextResult = { ...result };

      if (shouldDropTestOutput) {
        nextResult.stdout = [];
        nextResult.stderr = [];
        this.trimmedCounts.output += 1;
      }

      if (shouldTrimHeavyArtifacts) {
        nextResult.steps = [];
        nextResult.attachments = [];
        this.trimmedCounts.heavyArtifacts += 1;
      }
    }

    this.testMetadata.push({
      target: `#${test.id}-${result.retry}`,
      feature: deriveFeatureName(test?.location?.file),
      tags: test?.tags ?? [],
      durationMs: result?.duration ?? 0,
      retry: result?.retry ?? 0,
    });
    this.recordStatus(result?.status);
    this.recordFeatureStat(test, result);
    this.axeEvidence.push(...extractAxeEvidence(test, result));
    this.enqueueInnerCallback('onTestEnd', () => this.inner.onTestEnd(test, addFailureSource(nextResult)), { test });
  }

  async onEnd(result) {
    this.finalizationStartedAt = Date.now();
    if (this.profileEnabled) {
      process.stdout.write(
        `[odhin-profile] Starting Odhin finalization statusCounts=${JSON.stringify(this.statusCounts)} trimmed=${JSON.stringify(this.trimmedCounts)} runtimeHooks=${JSON.stringify(this.runtimeHookStats)} lightweight=${this.lightweight} testOutput=${this.testOutputMode}\n`
      );
    }
    await this.flushInnerCallbacks();
    if (typeof this.inner.onEnd === 'function') {
      await this.inner.onEnd(result);
    }
    try {
      enhanceGeneratedReport(this.outputFolder, this.featureStats, this.axeEvidence, this.testMetadata, {
        indexFilename: this.options.indexFilename,
        startedAtMs: this.finalizationStartedAt,
      });
    } catch (error) {
      process.stderr.write(`[odhin-profile] report enhancement failed: ${formatErrorMessage(error)}\n`);
      throw error;
    }
    if (this.profileEnabled) {
      const elapsedMs = Math.max(0, Date.now() - this.finalizationStartedAt);
      process.stdout.write(`[odhin-profile] Completed Odhin finalization in ${elapsedMs}ms.\n`);
    }
  }

  async onStdOut(chunk, test, result) {
    if (typeof this.inner.onStdOut === 'function') {
      this.enqueueInnerCallback('onStdOut', () => this.inner.onStdOut(chunk, test, result), { test });
    }
  }

  async onStdErr(chunk, test, result) {
    if (typeof this.inner.onStdErr === 'function') {
      this.enqueueInnerCallback('onStdErr', () => this.inner.onStdErr(chunk, test, result), { test });
    }
  }

  recordStatus(status) {
    switch (status) {
      case 'passed':
        this.statusCounts.passed += 1;
        break;
      case 'failed':
        this.statusCounts.failed += 1;
        break;
      case 'skipped':
        this.statusCounts.skipped += 1;
        break;
      case 'timedOut':
        this.statusCounts.timedOut += 1;
        break;
      case 'interrupted':
        this.statusCounts.interrupted += 1;
        break;
      default:
        this.statusCounts.other += 1;
    }
  }

  recordFeatureStat(test, result) {
    const finalStatus = normalizeFinalStatus(result?.status, result?.retry);
    if (!isFinalResult(finalStatus, result?.retry, test?.retries)) {
      return;
    }

    const featureName = deriveFeatureName(test?.location?.file);
    const current = this.featureStats.get(featureName) ?? createEmptyFeatureStat(featureName);
    current.totalTests += 1;
    current.durationMs += Number(result?.duration ?? 0);

    switch (finalStatus) {
      case 'passed':
        current.passed += 1;
        break;
      case 'failed':
        current.failed += 1;
        break;
      case 'timedOut':
        current.timedOut += 1;
        break;
      case 'skipped':
        current.skipped += 1;
        break;
      case 'interrupted':
        current.interrupted += 1;
        break;
      case 'flaky':
        current.flaky += 1;
        break;
      default:
        current.interrupted += 1;
        break;
    }

    this.featureStats.set(featureName, current);
  }

  enqueueInnerCallback(hookName, invoke, context = {}) {
    this.runtimeHookStats.queued += 1;
    const run = async () => {
      try {
        await withTimeout(Promise.resolve().then(invoke), this.runtimeHookTimeoutMs);
        this.runtimeHookStats.completed += 1;
      } catch (error) {
        this.firstInnerCallbackError ??= error;
        if (isTimeoutError(error)) {
          this.runtimeHookStats.timedOut += 1;
          process.stderr.write(
            `[odhin-profile] ${hookName} timed out after ${this.runtimeHookTimeoutMs}ms${formatHookContext(context)}\n`
          );
          return;
        }
        this.runtimeHookStats.failed += 1;
        process.stderr.write(`[odhin-profile] ${hookName} failed${formatHookContext(context)}: ${formatErrorMessage(error)}\n`);
      }
    };
    this.pendingInnerCallbacks = this.pendingInnerCallbacks.then(run, run);
    return this.pendingInnerCallbacks;
  }

  async flushInnerCallbacks() {
    await this.pendingInnerCallbacks;
    if (this.firstInnerCallbackError) {
      throw this.firstInnerCallbackError;
    }
  }
}

function addFailureSource(result) {
  if (!['failed', 'timedOut', 'interrupted'].includes(result?.status)) {
    return result;
  }
  let changed = false;
  const annotate = (error) => {
    const source = deriveFailureSource(`${error?.message ?? ''}\n${error?.stack ?? ''}`);
    if (!source || String(error?.message ?? '').startsWith('[Failure source:')) {
      return error;
    }
    changed = true;
    const label = `[Failure source: ${source}]`;
    return {
      ...error,
      message: `${label}\n${error?.message ?? ''}`,
      ...(error?.stack ? { stack: `${label}\n${error.stack}` } : {}),
    };
  };
  const nextError = result.error ? annotate(result.error) : result.error;
  const nextErrors = Array.isArray(result.errors) ? result.errors.map(annotate) : result.errors;
  if (!changed) {
    return result;
  }
  return {
    ...result,
    ...(result.error ? { error: nextError } : {}),
    ...(Array.isArray(result.errors) ? { errors: nextErrors } : {}),
  };
}

function deriveFailureSource(errorText) {
  const text = String(errorText ?? '').toLowerCase();
  if (/(?:\/login|\/enter-email)(?:[\s/?#]|$)/.test(text) || /idam[^\s/]*\/(?:login|enter-email)/.test(text)) {
    return 'IDAM authentication';
  }
  if (/\/api\/pba\/(?:adddeletepba|addpba|deletepba)(?:[\s/?#]|$)|\/organisation\/update-pba-numbers(?:[\s/?#]|$)/.test(text)) {
    return 'PBA management';
  }
  if (/\/api\/organisation(?:\/v1)?(?:[\s/?#]|$)|\/register-org-new\//.test(text)) {
    return 'Organisation flow';
  }
  if (/\/api\/(?:alluserlist|alluserlistwithoutroles|userlist|user-details|inviteuser)(?:[\s/?#]|$)|\/api\/ogd-flow\/invite(?:[\s/?#]|$)|\/api\/user\/[^\s/?#]+\/suspend(?:[\s/?#]|$)|\/users\/(?:invite-user|user\/)(?:[\s/?#]|$)/.test(text)) {
    return 'User administration';
  }
  return null;
}

const normalizeRuntimeHookTimeoutMs = (raw, fallbackMs) => {
  const parsed = Number.parseInt(String(raw ?? ''), 10);
  if (Number.isFinite(parsed) && parsed >= 0) {
    return parsed;
  }
  return fallbackMs;
};

const normalizeFinalStatus = (status, retry) => {
  if (status === 'passed' && Number(retry ?? 0) > 0) {
    return 'flaky';
  }
  return status;
};

const isFinalResult = (status, retry, retries) =>
  terminalStatusesNoRetry.includes(status) || Number(retry ?? 0) === Number(retries ?? 0);

const withTimeout = async (promise, timeoutMs) => {
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
    return promise;
  }
  let timer;
  try {
    return await Promise.race([
      promise,
      new Promise((_, reject) => {
        timer = setTimeout(
          () => reject(Object.assign(new Error(`Timed out after ${timeoutMs}ms`), { code: 'ODHIN_TIMEOUT' })),
          timeoutMs
        );
        timer.unref?.();
      }),
    ]);
  } finally {
    if (timer) {
      clearTimeout(timer);
    }
  }
};

const isTimeoutError = (error) => error?.code === 'ODHIN_TIMEOUT';

const formatErrorMessage = (error) => {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
};

const formatHookContext = ({ test } = {}) => {
  const title =
    typeof test?.titlePath === 'function' ? test.titlePath().join(' > ') : typeof test?.title === 'string' ? test.title : '';
  return title ? ` test="${title}"` : '';
};

const exportedReporter = OdhinAdaptiveReporter;
exportedReporter.__test__ = {
  isFinalResult,
  normalizeFinalStatus,
  normalizeTestOutputMode(raw) {
    if (raw === true || raw === false) {
      return raw;
    }
    const normalized = String(raw ?? 'only-on-failure')
      .trim()
      .toLowerCase();
    if (normalized === 'true') {
      return true;
    }
    if (normalized === 'false') {
      return false;
    }
    return 'only-on-failure';
  },
  trimResult(result, { lightweight, testOutputMode }) {
    const reporter = {
      lightweight,
      testOutputMode,
      trimmedCounts: { output: 0, heavyArtifacts: 0 },
    };
    let nextResult = result;
    const passedOrSkipped = result?.status === 'passed' || result?.status === 'skipped';
    const shouldTrimHeavyArtifacts = reporter.lightweight && passedOrSkipped;
    const shouldDropTestOutput =
      reporter.testOutputMode === false || (reporter.testOutputMode === 'only-on-failure' && passedOrSkipped);

    if (shouldTrimHeavyArtifacts || shouldDropTestOutput) {
      nextResult = { ...result };

      if (shouldDropTestOutput) {
        nextResult.stdout = [];
        nextResult.stderr = [];
        reporter.trimmedCounts.output += 1;
      }

      if (shouldTrimHeavyArtifacts) {
        nextResult.steps = [];
        nextResult.attachments = [];
        reporter.trimmedCounts.heavyArtifacts += 1;
      }
    }

    return { nextResult, trimmedCounts: reporter.trimmedCounts };
  },
  normalizeRuntimeHookTimeoutMs,
  withTimeout,
};
module.exports = exportedReporter;
