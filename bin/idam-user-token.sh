 #!/usr/bin/env bash

BASEDIR=$(realpath $(dirname ${0})/../../)

if [ -f $BASEDIR/.env ]
then
  export $(cat $BASEDIR/.env | sed 's/#.*//g' | xargs)
fi

set -e

username=${1}
password=${2}

IDAM_API_URL=${IDAM_API_URL_BASE}

clientSecret=${IDAM_SECRET}
redirectUri=http://localhost:3001/oauth2/callback

echo "username: ${username}"
echo "password: ${password}"
echo "IDAM_API_URL: ${IDAM_API_URL}"
echo "clientSecret: ${clientSecret}"

if [ -z "$IDAM_STUB_LOCALHOST" ]; then
  response=$(curl --insecure --fail --show-error --silent -X POST --user "${username}:${password}" "${IDAM_API_URL}/oauth2/authorize?redirect_uri=${redirectUri}&response_type=code&client_id=xuimowebapp" -d "")
  echo "authorize response: $response"
  code=$(echo "$response" | docker run --rm --interactive ghcr.io/jqlang/jq -r .code)
else
  code=stubbed-value
fi

echo "code: ${code}"

curl --insecure --fail --show-error --silent -X POST -H "Content-Type: application/x-www-form-urlencoded" --user "xuimowebapp:${clientSecret}" "${IDAM_API_URL}/oauth2/token?code=${code}&redirect_uri=${redirectUri}&grant_type=authorization_code" -d "" | docker run --rm --interactive ghcr.io/jqlang/jq -r .access_token