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

  return JSON.parse(fs.readFileSync(reportPath, 'utf8'));
}

function ensureA11yReportIsPassing(report) {
  const passed = Number(report.passed || 0);
  const failed = Number(report.failed || 0);
  const total = passed + failed;

  if (total === 0) {
    throw new Error('Codecept a11y report did not contain any executed tests');
  }

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
