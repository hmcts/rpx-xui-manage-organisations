#!/usr/bin/env node
/* eslint-disable no-console */

const fs = require('node:fs');
const path = require('node:path');

const reportPath = process.env.CODECEPT_A11Y_REPORT || path.join(
  'functional-output',
  'tests',
  'codecept-a11y',
  'report_output.json'
);

function readReport() {
  if (!fs.existsSync(reportPath)) {
    throw new Error(`Codecept a11y report was not generated: ${reportPath}`);
  }

  try {
    return JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  } catch (error) {
    throw new Error(`Codecept a11y report is not valid JSON: ${error.message}`);
  }
}

function readIntegerCount(report, fieldName) {
  const rawValue = report[fieldName];
  if (rawValue === undefined || rawValue === null || rawValue === '' || typeof rawValue === 'boolean') {
    throw new Error(`Codecept a11y report has invalid ${fieldName} count`);
  }

  const value = Number(rawValue);
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`Codecept a11y report has invalid ${fieldName} count`);
  }
  return value;
}

function assertTestsMatchSummary(report, passed, failed) {
  if (!Array.isArray(report.tests)) {
    throw new Error('Codecept a11y report did not contain a tests array');
  }

  if (report.tests.length === 0) {
    throw new Error('Codecept a11y report did not contain any executed tests');
  }

  const statusCounts = report.tests.reduce((counts, test) => {
    if (test.status !== 'passed' && test.status !== 'failed') {
      throw new Error(`Codecept a11y report contains unsupported test status: ${test.status}`);
    }
    return {
      ...counts,
      [test.status]: counts[test.status] + 1
    };
  }, { passed: 0, failed: 0 });

  if (statusCounts.passed !== passed || statusCounts.failed !== failed) {
    throw new Error(
      `Codecept a11y report summary does not match tests array: ` +
      `${passed} passed/${failed} failed in summary, ` +
      `${statusCounts.passed} passed/${statusCounts.failed} failed in tests`
    );
  }
}

function ensureA11yReportIsPassing(report) {
  const passed = readIntegerCount(report, 'passed');
  const failed = readIntegerCount(report, 'failed');
  const total = passed + failed;

  if (total === 0) {
    throw new Error('Codecept a11y report did not contain any executed tests');
  }

  assertTestsMatchSummary(report, passed, failed);

  if (failed > 0) {
    throw new Error(`Codecept a11y reported ${failed} failing test(s) out of ${total}`);
  }

  console.log(`Codecept a11y report passed: ${passed}/${total} test(s)`);
}

try {
  ensureA11yReportIsPassing(readReport());
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
