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

node - "${OUT_FILE}" <<'NODE'
const fs = require('fs');

const outFile = process.argv[2];
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
