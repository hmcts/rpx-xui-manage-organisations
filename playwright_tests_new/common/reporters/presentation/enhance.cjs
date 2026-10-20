const fs = require('node:fs');
const path = require('node:path');
const escape = (value) =>
  String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);

function applyPresentation(root, metadata = []) {
  root.querySelectorAll('#manage-org-report-theme, #manage-org-report-ui').forEach((node) => node.remove());
  const table = root.querySelector('#test-list-table');
  if (table && metadata.length) {
    table.querySelectorAll('[data-report-metadata]').forEach((node) => node.remove());
    const byTarget = new Map(metadata.map((test) => [test.target, test]));
    table.querySelectorAll('thead tr, tfoot tr').forEach((row) => {
      row.insertAdjacentHTML(
        'beforeend',
        '<th data-report-metadata>Feature</th><th data-report-metadata>Tags</th><th data-report-metadata>Attempt</th>'
      );
    });
    table.querySelectorAll('tbody tr').forEach((row) => {
      const test = byTarget.get(row.getAttribute('data-bs-target'));
      row.setAttribute('data-duration-ms', String(test?.durationMs ?? 0));
      row.insertAdjacentHTML(
        'beforeend',
        `<td data-report-metadata>${escape(test?.feature ?? 'Uncategorised')}</td><td data-report-metadata>${escape((test?.tags ?? []).join(', '))}</td><td data-report-metadata>${escape((test?.retry ?? 0) + 1)}</td>`
      );
    });
  }
  root.querySelector('meta[name="viewport"]')?.setAttribute('content', 'width=device-width, initial-scale=1');
  root
    .querySelector('head')
    ?.insertAdjacentHTML(
      'beforeend',
      `<style id="manage-org-report-theme">${fs.readFileSync(path.join(__dirname, 'report.css'), 'utf8')}</style>`
    );
  root
    .querySelector('body')
    ?.insertAdjacentHTML(
      'beforeend',
      `<script id="manage-org-report-ui">${fs.readFileSync(path.join(__dirname, 'report.js'), 'utf8')}</script>`
    );
}
module.exports = { applyPresentation };
