#!/usr/bin/env bash

set -eu

dir=$(dirname ${0})

role=${1}
classification=${2:-PUBLIC}

userToken=$(${dir}/idam-user-token.sh ${DEFINITION_IMPORTER_USERNAME} ${DEFINITION_IMPORTER_PASSWORD})
serviceToken=$(${dir}/s2s-token.sh ccd_gw)

echo "Creating CCD role: ${role}"

curl --insecure --fail --show-error --silent --output /dev/null -X PUT \
  ${DEFINITION_STORE_URL_BASE:-http://localhost:4451}/api/user-role \
  -H "Authorization: Bearer ${userToken}" \
  -H "ServiceAuthorization: ${serviceToken}" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "'${role}'",
    "security_classification": "'${classification}'"
  }'