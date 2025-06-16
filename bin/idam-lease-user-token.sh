#!/usr/bin/env bash

set -e

USERNAME=${1}
PASSWORD=${2}

IDAM_URI=${IDAM_API_BASE_URL:-http://localhost:5000}
REDIRECT_URI=http://localhost:3451/oauth2redirect
CLIENT_ID="ccd_gateway"
CLIENT_SECRET=${CCD_API_GATEWAY_IDAM_CLIENT_SECRET:-ccd_gateway_secret}
SCOPE="openid%20profile%20roles"

curl --silent --show-error --fail \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -XPOST "${IDAM_URI}/o/token?grant_type=password&redirect_uri=${REDIRECT_URI}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&username=${USERNAME}&password=${PASSWORD}&scope=${SCOPE}" -d "" | jq -r .access_token