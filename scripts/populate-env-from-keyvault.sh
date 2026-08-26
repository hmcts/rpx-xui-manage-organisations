#!/usr/bin/env bash
set -euo pipefail

ENVIRONMENT="${1:-aat}"
OUT_FILE="${2:-.env}"
TEMPLATE_FILE="${3:-.env.example}"

case "${ENVIRONMENT}" in
  aat|AAT)
    VAULT="rpx-aat"
    ;;
  demo|DEMO)
    VAULT="rpx-demo"
    ;;
  *)
    echo "Usage: $0 [aat|demo] [output_file] [template_file]"
    exit 1
    ;;
esac

if ! command -v az >/dev/null 2>&1; then
  echo "Azure CLI is required. Install it and run 'az login' first."
  exit 1
fi

if [ ! -f "${TEMPLATE_FILE}" ]; then
  echo "Template file not found: ${TEMPLATE_FILE}"
  exit 1
fi

echo "Populating ${OUT_FILE} using ${VAULT} and template ${TEMPLATE_FILE}"
node ./node_modules/@hmcts/playwright-common/dist/scripts/get-secrets.js "${VAULT}" "${TEMPLATE_FILE}" "${OUT_FILE}"

read_secret() {
  local secret_name="$1"
  az keyvault secret show --vault-name "${VAULT}" --name "${secret_name}" --query value -o tsv 2>/dev/null || true
}

ORG_ASSIGNMENT_UI_USER="$(read_secret xui-dynamic-org-user-assignment-ui-user)"
ORG_ASSIGNMENT_USERNAME="$(read_secret xui-dynamic-org-user-assignment-username)"
ORG_ASSIGNMENT_EXPECTED_EMAIL="$(read_secret xui-dynamic-org-user-assignment-expected-email)"
ORG_ASSIGNMENT_PASSWORD="$(read_secret xui-dynamic-org-user-assignment-password)"
TEST_USER1_EMAIL_VALUE="$(read_secret test-user1-email)"
TEST_USER1_PASSWORD_VALUE="$(read_secret test-user1-password)"
TEST_ROO_USERNAME="$(read_secret test-roo-username)"
TEST_ROO_PASSWORD_VALUE="$(read_secret test-roo-password)"
PLAYWRIGHT_GLOBAL_EXCLUDED_TAGS_VALUE="$(read_secret xui-manage-org-playwright-global-excluded-tags)"

ORG_ASSIGNMENT_UI_USER="${ORG_ASSIGNMENT_UI_USER}" \
ORG_ASSIGNMENT_USERNAME="${ORG_ASSIGNMENT_USERNAME}" \
ORG_ASSIGNMENT_EXPECTED_EMAIL="${ORG_ASSIGNMENT_EXPECTED_EMAIL}" \
ORG_ASSIGNMENT_PASSWORD="${ORG_ASSIGNMENT_PASSWORD}" \
TEST_USER1_EMAIL_VALUE="${TEST_USER1_EMAIL_VALUE}" \
TEST_USER1_PASSWORD_VALUE="${TEST_USER1_PASSWORD_VALUE}" \
TEST_ROO_USERNAME="${TEST_ROO_USERNAME}" \
TEST_ROO_PASSWORD_VALUE="${TEST_ROO_PASSWORD_VALUE}" \
PLAYWRIGHT_GLOBAL_EXCLUDED_TAGS_VALUE="${PLAYWRIGHT_GLOBAL_EXCLUDED_TAGS_VALUE}" \
node - "${OUT_FILE}" "${ENVIRONMENT}" <<'NODE'
const fs = require('fs');

const outFile = process.argv[2];
const environment = (process.argv[3] || 'aat').toLowerCase();
const content = fs.readFileSync(outFile, 'utf-8');
const lines = content.split(/\r?\n/);

const env = {};
for (const line of lines) {
  if (!line || line.startsWith('#') || !line.includes('=')) continue;
  const index = line.indexOf('=');
  env[line.slice(0, index)] = line.slice(index + 1);
}

function firstNonEmpty(...values) {
  for (const value of values) {
    if (typeof value === 'string' && value.trim() !== '') {
      return value.trim();
    }
  }
  return '';
}

function setValue(key, value) {
  if (!value) return;
  env[key] = value;
}

setValue('CLIENT_ID', firstNonEmpty(env.CLIENT_ID, env.IDAM_CLIENT));
setValue('IDAM_CLIENT', firstNonEmpty(env.IDAM_CLIENT, env.CLIENT_ID));
setValue('IDAM_API_SERVICE', firstNonEmpty(env.IDAM_API_SERVICE, env.SERVICES_IDAM_API_URL));
setValue('IDAM_WEB_SERVICE', firstNonEmpty(env.IDAM_WEB_SERVICE, env.SERVICES_IDAM_WEB_URL));
setValue('S2S_SERVICE', firstNonEmpty(env.S2S_SERVICE, env.S2S_URL));
setValue('XUI_DYNAMIC_ORG_USER_ASSIGNMENT_UI_USER', firstNonEmpty(
  env.XUI_DYNAMIC_ORG_USER_ASSIGNMENT_UI_USER,
  process.env.ORG_ASSIGNMENT_UI_USER,
  process.env.ORG_ASSIGNMENT_USERNAME,
  process.env.ORG_ASSIGNMENT_EXPECTED_EMAIL
));
setValue('XUI_DYNAMIC_ORG_USER_ASSIGNMENT_PASSWORD', firstNonEmpty(
  env.XUI_DYNAMIC_ORG_USER_ASSIGNMENT_PASSWORD,
  process.env.ORG_ASSIGNMENT_PASSWORD
));
setValue('TEST_USER1_EMAIL', firstNonEmpty(
  env.TEST_USER1_EMAIL,
  process.env.TEST_USER1_EMAIL_VALUE,
  env.XUI_DYNAMIC_ORG_USER_ASSIGNMENT_UI_USER,
  process.env.ORG_ASSIGNMENT_UI_USER,
  process.env.ORG_ASSIGNMENT_USERNAME,
  process.env.ORG_ASSIGNMENT_EXPECTED_EMAIL
));
setValue('TEST_USER1_PASSWORD', firstNonEmpty(
  env.TEST_USER1_PASSWORD,
  process.env.TEST_USER1_PASSWORD_VALUE,
  env.XUI_DYNAMIC_ORG_USER_ASSIGNMENT_PASSWORD,
  process.env.ORG_ASSIGNMENT_PASSWORD
));
setValue('TEST_ROO_EMAIL', firstNonEmpty(
  env.TEST_ROO_EMAIL,
  process.env.TEST_ROO_USERNAME
));
setValue('TEST_ROO_PASSWORD', firstNonEmpty(
  env.TEST_ROO_PASSWORD,
  process.env.TEST_ROO_PASSWORD_VALUE
));
env.PLAYWRIGHT_GLOBAL_EXCLUDED_TAGS = firstNonEmpty(
  process.env.PLAYWRIGHT_GLOBAL_EXCLUDED_TAGS_VALUE,
  '@none'
);

const manageOrgUrl = environment === 'demo'
  ? 'https://manage-org.demo.platform.hmcts.net/'
  : 'https://manage-org.aat.platform.hmcts.net/';
setValue('TEST_URL', firstNonEmpty(
  env.TEST_URL && env.TEST_URL.includes('manage-org') ? env.TEST_URL : '',
  manageOrgUrl
));

const updatedLines = lines.map((line) => {
  if (!line || line.startsWith('#') || !line.includes('=')) {
    return line;
  }
  const index = line.indexOf('=');
  const key = line.slice(0, index);
  if (Object.prototype.hasOwnProperty.call(env, key)) {
    return `${key}=${env[key]}`;
  }
  return line;
});

fs.writeFileSync(outFile, updatedLines.join('\n'), 'utf-8');
NODE

echo "Done. Generated ${OUT_FILE}"
