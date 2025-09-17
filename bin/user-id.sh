USER_TOKEN=${1}

curl --silent --show-error -X GET "${IDAM_API_BASE_URL}/details" -H "accept: application/json" -H "authorization: Bearer ${USER_TOKEN}" | jq -r .id