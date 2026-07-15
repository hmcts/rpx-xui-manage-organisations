# Playwright Global Exclusions

Manage Organisations uses one temporary, Key Vault-backed exclusion list for Playwright API, E2E, integration and nightly cross-browser runs.

Use it only when a tagged failing area blocks shared CI and cannot be fixed immediately. Every exclusion still needs an owner and a removal plan.

## Runtime Contract

- Key Vault secret: `xui-manage-org-playwright-global-excluded-tags`
- Runtime variable: `PLAYWRIGHT_GLOBAL_EXCLUDED_TAGS`
- No-op value: `@none`
- Verification bypass: `PLAYWRIGHT_IGNORE_GLOBAL_EXCLUDES=true`

Values can be separated by spaces or commas when supplied locally. Store the Key Vault value with spaces.

Each suite applies only its own tags:

| Suite | Global tags applied |
| --- | --- |
| API | `@svc-*` |
| E2E and cross-browser | `@e2e`, `@e2e-*`, and the E2E domain tags declared in `playwright_tests_new/E2E/tag-filter.json` |
| Integration | `@integration`, `@integration-*` |

An unknown tag in the current suite's namespace fails config loading. Tags belonging to another suite are ignored by that config.

Suite-specific exclusions remain replacement-style:

- `API_PW_EXCLUDED_TAGS_OVERRIDE`
- `E2E_PW_EXCLUDED_TAGS_OVERRIDE`
- `INTEGRATION_PW_EXCLUDED_TAGS_OVERRIDE`
- legacy E2E alias `PLAYWRIGHT_EXCLUDE_TAGS`

The global exclusions are deduplicated and added after those defaults or overrides. `@none` clears only the layer in which it appears. The legacy E2E include alias `PLAYWRIGHT_TAGS` is also preserved.

## Key Vault Commands

Set the target vault and the tag to change. The examples use `rpx-aat` and `@registration`.

```bash
VAULT_NAME=rpx-aat
SECRET_NAME=xui-manage-org-playwright-global-excluded-tags
TAG=@registration
```

View the current value before every update:

```bash
az keyvault secret show \
  --vault-name "$VAULT_NAME" \
  --name "$SECRET_NAME" \
  --query value \
  --output tsv
```

Add one tag while preserving all current exclusions, removing `@none`, and storing a space-separated deduplicated value:

```bash
CURRENT_VALUE="$(az keyvault secret show --vault-name "$VAULT_NAME" --name "$SECRET_NAME" --query value --output tsv)"
UPDATED_VALUE="$(
  printf '%s\n' "$CURRENT_VALUE $TAG" |
    tr ',' ' ' |
    awk '{ for (i = 1; i <= NF; i++) if ($i != "@none" && !seen[$i]++) values = values (values ? " " : "") $i } END { print values ? values : "@none" }'
)"
az keyvault secret set \
  --vault-name "$VAULT_NAME" \
  --name "$SECRET_NAME" \
  --value "$UPDATED_VALUE" \
  --tags e2e=PLAYWRIGHT_GLOBAL_EXCLUDED_TAGS purpose=playwright-global-exclusions
```

Remove one specific tag while preserving every other exclusion:

```bash
CURRENT_VALUE="$(az keyvault secret show --vault-name "$VAULT_NAME" --name "$SECRET_NAME" --query value --output tsv)"
UPDATED_VALUE="$(
  printf '%s\n' "$CURRENT_VALUE" |
    tr ',' ' ' |
    awk -v remove="$TAG" '{ for (i = 1; i <= NF; i++) if ($i != "@none" && $i != remove && !seen[$i]++) values = values (values ? " " : "") $i } END { print values ? values : "@none" }'
)"
az keyvault secret set \
  --vault-name "$VAULT_NAME" \
  --name "$SECRET_NAME" \
  --value "$UPDATED_VALUE" \
  --tags e2e=PLAYWRIGHT_GLOBAL_EXCLUDED_TAGS purpose=playwright-global-exclusions
```

Remove all global exclusions:

```bash
az keyvault secret set \
  --vault-name "$VAULT_NAME" \
  --name "$SECRET_NAME" \
  --value '@none' \
  --tags e2e=PLAYWRIGHT_GLOBAL_EXCLUDED_TAGS purpose=playwright-global-exclusions
```

The `e2e=PLAYWRIGHT_GLOBAL_EXCLUDED_TAGS` tag is used by local Key Vault environment population. Extra metadata such as a Jira key is optional.

## Verification Runs

To prove a fix while its tag remains in Key Vault, set the Jenkins parameter `PLAYWRIGHT_IGNORE_GLOBAL_EXCLUDES=true`. This bypasses only the global layer; suite defaults and suite override parameters still apply.

Local examples:

```bash
PLAYWRIGHT_GLOBAL_EXCLUDED_TAGS='@svc-user-admin @registration' yarn test:api:pw -- --list
PLAYWRIGHT_GLOBAL_EXCLUDED_TAGS='@svc-user-admin @registration' yarn test:playwrightE2E -- --list
PLAYWRIGHT_GLOBAL_EXCLUDED_TAGS='@integration-user-admin' yarn test:playwright:integration -- --list
PLAYWRIGHT_GLOBAL_EXCLUDED_TAGS='@registration' yarn test:crossbrowser:raw -- --list
PLAYWRIGHT_GLOBAL_EXCLUDED_TAGS='@registration' PLAYWRIGHT_IGNORE_GLOBAL_EXCLUDES=true yarn test:playwrightE2E -- --list
```

Set `PLAYWRIGHT_LOG_TAG_FILTERS=true` to print each suite's resolved include, exclude, applied-global and ignored-global tags.
