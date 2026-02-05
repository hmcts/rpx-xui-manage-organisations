# Package Review Notes - rpx-xui-manage-organisations

Date: 2026-02-05

Summary:
- Reviewed package usage with `@hmcts/ccd-case-ui-toolkit` dependencies in mind.
- Kept Angular libraries that are required by the toolkit.

Changes:
- Moved test-only packages to `devDependencies`:
  - `@pact-foundation/pact`
  - `@pact-foundation/pact-node`
  - `@playwright/test`
  - `@types/faker`
  - `@types/global-agent`
  - `axios-mock-adapter`
  - `base-64`
  - `faker`
  - `git-rev-sync`
  - `node-fetch`
  - `puppeteer`
  - `why-is-node-running`
- Removed unused dependency:
  - `form-data`

Notes:
- `rpx-xui-translation` is retained because it is required by `@hmcts/ccd-case-ui-toolkit`.
- Angular packages in `dependencies` are retained to satisfy toolkit and Angular Material requirements.
- Restored toolkit transitive dependencies after build errors:
  - `exceljs`
  - `file-saver`
  - `moment-timezone`
  - `ngx-chips`
  - `ngx-pagination`
- `yarn.lock` was not updated in this pass.
