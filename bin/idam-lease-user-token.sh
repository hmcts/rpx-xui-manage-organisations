#!/usr/bin/env bash

set -e

USERNAME=${1}
PASSWORD=${2}

IDAM_URI=${IDAM_API_BASE_URL:-http://localhost:5000}
REDIRECT_URI=http://localhost:3000/oauth2/redirect
CLIENT_ID="xuimowebapp"
CLIENT_SECRET=${CCD_API_GATEWAY_IDAM_CLIENT_SECRET:-ccd_gateway_secret}
SCOPE="openid%20profile%20roles"

curl -X 'POST' \
  "${IDAM_URI}/o/token" \
  -H 'accept: application/json' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d "client_secret=${IDAM_SECRET}&code_verifier=&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Foauth2%2Fredirect&code=&client_id=xuimowebapp&scope=openid%20profile%20roles&refresh_token=&username=${USERNAME}&password=${PASSWORD}&grant_type=password" | jq -r .access_token