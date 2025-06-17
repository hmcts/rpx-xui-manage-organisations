#!/usr/bin/env bash
set -eu

BASEDIR=$(dirname "$0")
S2S_TOKEN=$(${BASEDIR}/s2s-token.sh "xui_webapp")

export IDAM_API_BASE_URL=https://idam-api.aat.platform.hmcts.net

IDAM_TOKEN=$(${BASEDIR}/idam-lease-user-token.sh $GA_USERNAME $GA_PASSWORD)

function send_curl_request() {
  local json_file=$1
  local user_type=$2

  if [[ ! -f "${json_file}" ]]; then
    echo "[ERROR] File not found: ${json_file}"
    return 1
  fi

  local payload=$(cat "${json_file}")
  local url="https://am-org-role-mapping-service-xui-mo-webapp-pr-${CHANGE_ID}.preview.platform.hmcts.net/am/testing-support/createOrgMapping?userType=${user_type}"

  # Log the payload and URL
  echo "[DEBUG] Sending request to URL: ${url}"
  echo "[DEBUG] Payload: ${payload}"

  # Make the curl request and capture the response and status code
  HTTP_RESPONSE=$(curl --silent --show-error --write-out "HTTPSTATUS:%{http_code}" -X POST "${url}" \
    -H 'accept: application/vnd.uk.gov.hmcts.am-org-role-mapping-service.map-assignments+json;charset=UTF-8;version=1.0' \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer ${IDAM_TOKEN}" \
    -H "ServiceAuthorization: ${S2S_TOKEN}" \
    -d "${payload}")

  # Extract the body and status code
  HTTP_BODY=$(echo "${HTTP_RESPONSE}" | sed -e 's/HTTPSTATUS:.*//g')
  HTTP_STATUS=$(echo "${HTTP_RESPONSE}" | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')

  # Log the response body and status code
  echo "[DEBUG] Response Body: ${HTTP_BODY}"
  echo "[DEBUG] HTTP Status Code: ${HTTP_STATUS}"

  # Handle errors
  if [ "${HTTP_STATUS}" -ge 300 ]; then
    echo "[ERROR] Request failed with status code ${HTTP_STATUS}"
    echo "[ERROR] Response Body: ${HTTP_BODY}"
    return 1
  fi
}

send_curl_request "${BASEDIR}/role-assignments.json" "CASEWORKER"