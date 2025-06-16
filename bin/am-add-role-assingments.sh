#!/usr/bin/env bash
set -eu

BASEDIR=$(dirname "$0")
S2S_TOKEN=$(${BASEDIR}/utils/s2s-token.sh "am_org_role_mapping_service")

export IDAM_API_BASE_URL=https://idam-api.aat.platform.hmcts.net

IDAM_TOKEN=$(${BASEDIR}/utils/idam-lease-user-token.sh $IDAM_DATA_STORE_SYSTEM_USER_USERNAME $IDAM_DATA_STORE_SYSTEM_USER_PASSWORD)

function send_curl_request() {
  local json_file=$1
  local user_type=$2

  if [[ ! -f "${json_file}" ]]; then
    echo "File not found: ${json_file}"
    return 1
  fi

  local payload=$(cat "${json_file}")
  local url="https://am-org-role-mapping-service-xui-mo-webapp-pr-${CHANGE_ID}.preview.platform.hmcts.net/am/testing-support/createOrgMapping?userType=${user_type}"

  curl --silent --show-error --fail "${url}" \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer ${IDAM_TOKEN}" \
  -H "ServiceAuthorization: ${S2S_TOKEN}" \
  -d "${payload}"
}

send_curl_request "${BASEDIR}/staff-idam-ids.json" "CASEWORKER"