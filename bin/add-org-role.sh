USERNAME=${1:-ccd-import@fake.hmcts.net}
PASSWORD=${2:-London01}
ROLE_CLASSIFICATION="${3:-PUBLIC}"
ROLE_NAME="${4:-"tribunal-caseworker"}"
ROLE_ATTRIBUTES="${5:-'{"jurisdiction":"CIVIL"}'}"
ROLE_CATEGORY="${6:-"LEGAL_OPERATIONS"}"
USER_ID=${7}

BASEDIR=$(dirname "$0")

USER_TOKEN=$($BASEDIR/idam-lease-user-token.sh $USERNAME $PASSWORD)
USER_ID=$($BASEDIR/user-id.sh $USER_TOKEN)
SERVICE_TOKEN=$($BASEDIR/s2s-token.sh xui_webapp \
                $(docker run --rm hmctspublic.azurecr.io/imported/toolbelt/oathtool --totp -b ${S2S_SECRET:-AABBCCDDEEFFGGHH}))

echo "\n\nCreating role assignment: \n User: ${USER_ID}\n Role name: ${ROLE_NAME}\n ROLE_CLASSIFICATION: ${ROLE_CLASSIFICATION}\n"
echo "\n\nROLE ASSIGNMENT URL: \n Url: ${ROLE_ASSIGNMENT_URL}\n"

# Log the data being sent in the curl request
REQUEST_DATA=$(cat <<EOF
{
  "roleRequest": {
    "assignerId": "${USER_ID}",
    "process": "staff-organisational-role-mapping",
    "reference": "${USER_ID}/${ROLE_NAME}",
    "replaceExisting": true,
    "byPassOrgDroolRule": true
  },
  "requestedRoles": [
    {
      "actorIdType": "IDAM",
      "actorId": "${USER_ID}",
      "roleType": "ORGANISATION",
      "roleName": "${ROLE_NAME}",
      "classification": "${ROLE_CLASSIFICATION}",
      "grantType": "STANDARD",
      "roleCategory": "${ROLE_CATEGORY}",
      "readOnly": false,
      "attributes": ${ROLE_ATTRIBUTES}
    }
  ]
}
EOF
)

echo "[DEBUG] Request Data: ${REQUEST_DATA}"

# Use the logged data in the curl request and log the status code
HTTP_RESPONSE=$(curl --silent --show-error --write-out "HTTPSTATUS:%{http_code}" -X POST "${ROLE_ASSIGNMENT_URL}/am/role-assignments" \
  -H "accept: application/vnd.uk.gov.hmcts.role-assignment-service.create-assignments+json;charset=UTF-8;version=1.0" \
  -H "Authorization: Bearer ${USER_TOKEN}" \
  -H "ServiceAuthorization: Bearer ${SERVICE_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "${REQUEST_DATA}")

# Extract the body and status code
HTTP_BODY=$(echo "${HTTP_RESPONSE}" | sed -e 's/HTTPSTATUS:.*//g')
HTTP_STATUS=$(echo "${HTTP_RESPONSE}" | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')

# Log the response body and status code
echo "[DEBUG] Response Body: ${HTTP_BODY}"
echo "[DEBUG] HTTP Status Code: ${HTTP_STATUS}"

# Optionally, handle non-2xx status codes
if [ "${HTTP_STATUS}" -ge 300 ]; then
  echo "[ERROR] Request failed with status code ${HTTP_STATUS}"
  exit 1
fi