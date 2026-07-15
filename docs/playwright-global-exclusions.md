# Playwright Global Exclusions

Manage Organisations uses one temporary, Key Vault-backed exclusion list for Playwright API, E2E, integration and nightly cross-browser runs.

Use it only when a tagged failing area blocks shared CI and cannot be fixed immediately. Every exclusion still needs an owner and a removal plan.

## Runtime Contract

- Key Vault secret: `xui-manage-org-playwright-global-excluded-tags`
- Local-population tag: `e2e=MANAGE_ORG_PLAYWRIGHT_GLOBAL_EXCLUDED_TAGS`
- Runtime variable: `PLAYWRIGHT_GLOBAL_EXCLUDED_TAGS`
- No-op value: `@none`
- Verification bypass: `PLAYWRIGHT_IGNORE_GLOBAL_EXCLUDES=true`

Values can be separated by spaces or commas when supplied locally. Store the Key Vault value with spaces.

Each suite applies only its own tags:

| Suite                 | Global tags applied                                                                                           |
| --------------------- | ------------------------------------------------------------------------------------------------------------- |
| API                   | `@svc-*`                                                                                                      |
| E2E and cross-browser | E2E functional tags declared in `playwright_tests_new/E2E/tag-filter.json`, excluding `@e2e`                    |
| Integration           | `@integration-*`                                                                                              |

Every global value is validated against the combined API, E2E and integration catalogs before suite filtering. Unknown values fail config loading; known tags belonging to another suite are ignored by that config. Whole-suite tags such as `@e2e` and `@integration` are rejected as global exclusions because they would leave a supported Playwright command with no tests. The smoke-only `@e2e-smoke` tag is supported because `yarn test:smoke` uses Playwright's no-tests pass flag when that global exclusion is active.

Suite-specific exclusions remain replacement-style:

- `API_PW_EXCLUDED_TAGS_OVERRIDE`
- `E2E_PW_EXCLUDED_TAGS_OVERRIDE`
- `INTEGRATION_PW_EXCLUDED_TAGS_OVERRIDE`
- legacy E2E alias `PLAYWRIGHT_EXCLUDE_TAGS`

The global exclusions are deduplicated and added after those defaults or overrides. `@none` clears only the layer in which it appears. The legacy E2E include alias `PLAYWRIGHT_TAGS` is also preserved.

## Key Vault Commands

Set the target vault. The examples use `rpx-aat`.

```bash
VAULT_NAME=rpx-aat
SECRET_NAME=xui-manage-org-playwright-global-excluded-tags
```

View the current value before every update:

```bash
az keyvault secret show \
  --vault-name "$VAULT_NAME" \
  --name "$SECRET_NAME" \
  --query value \
  --output tsv
```

View the complete current metadata before every update:

```bash
az keyvault secret show \
  --vault-name "$VAULT_NAME" \
  --name "$SECRET_NAME" \
  --query tags \
  --output json
```

The add and remove values below are complete examples. Replace each value with the complete current exclusion list, preserving all current exclusions except the tag being deliberately added or removed.

Add `@registration` to an existing `@svc-user-admin` exclusion:

```bash
az keyvault secret set \
  --vault-name "$VAULT_NAME" \
  --name "$SECRET_NAME" \
  --value '@svc-user-admin @registration' \
  --tags e2e=MANAGE_ORG_PLAYWRIGHT_GLOBAL_EXCLUDED_TAGS file-encoding=utf-8 purpose=playwright-global-exclusions jira=EXUI-4971
```

Remove `@registration` while keeping `@svc-user-admin` by setting the remaining value explicitly:

```bash
az keyvault secret set \
  --vault-name "$VAULT_NAME" \
  --name "$SECRET_NAME" \
  --value '@svc-user-admin' \
  --tags e2e=MANAGE_ORG_PLAYWRIGHT_GLOBAL_EXCLUDED_TAGS file-encoding=utf-8 purpose=playwright-global-exclusions jira=EXUI-4971
```

Remove all global exclusions:

```bash
az keyvault secret set \
  --vault-name "$VAULT_NAME" \
  --name "$SECRET_NAME" \
  --value '@none' \
  --tags e2e=MANAGE_ORG_PLAYWRIGHT_GLOBAL_EXCLUDED_TAGS file-encoding=utf-8 purpose=playwright-global-exclusions jira=EXUI-4971
```

Always view the current value and metadata first. Preserve every exclusion that should remain and pass the complete live metadata set to `--tags`. Store values with spaces, not commas. `az keyvault secret set --tags` replaces the complete tag set. The `jira=EXUI-4971` tag shown above is optional; preserve the current Jira metadata when present. The MO-specific `e2e` tag distinguishes this secret's metadata, and the local script reads the exact MO secret name before writing the shared runtime variable. It does not accept a Manage Case or Approve Organisation value found through an ambiguous tag.

## Verification Runs

To prove a fix while its tag remains in Key Vault, set the Jenkins parameter `PLAYWRIGHT_IGNORE_GLOBAL_EXCLUDES=true`. This bypasses only the global layer; suite defaults and suite override parameters still apply.

Local examples:

```bash
PLAYWRIGHT_GLOBAL_EXCLUDED_TAGS='@svc-user-admin @registration' yarn test:api:pw -- --list
PLAYWRIGHT_GLOBAL_EXCLUDED_TAGS='@svc-user-admin @registration' yarn test:playwrightE2E -- --list
PLAYWRIGHT_GLOBAL_EXCLUDED_TAGS='@integration-user-admin' yarn test:playwright:integration -- --list
PLAYWRIGHT_GLOBAL_EXCLUDED_TAGS='@registration' yarn test:crossbrowser:raw -- --list
PLAYWRIGHT_GLOBAL_EXCLUDED_TAGS='@e2e-smoke' yarn test:smoke -- --list
PLAYWRIGHT_GLOBAL_EXCLUDED_TAGS='@registration' PLAYWRIGHT_IGNORE_GLOBAL_EXCLUDES=true yarn test:playwrightE2E -- --list
```

Set `PLAYWRIGHT_LOG_TAG_FILTERS=true` to print each suite's resolved include, exclude, applied-global and ignored-global tags.
