#!/usr/bin/env bash

set -eu

username=${1}
password=${2}
clientSecret=${CCD_API_GATEWAY_IDAM_CLIENT_SECRET:-ccd_gateway_secret}
redirectUri=${CCD_IDAM_REDIRECT_URL:-http://localhost:3451/oauth2redirect}
idamApiUrl=${IDAM_API_BASE_URL:-http://localhost:5000}

# Debug logs
echo "[DEBUG] Username: ${username}"
echo "[DEBUG] Redirect URI: ${redirectUri}"
echo "[DEBUG] IDAM API URL: ${idamApiUrl}"
echo "[DEBUG] Client Secret: ${clientSecret}"

# Request authorization code
echo "[INFO] Requesting authorization code..."
authResponse=$(curl --insecure --fail --show-error --silent -X POST --user "${username}:${password}" "${idamApiUrl}/oauth2/authorize?redirect_uri=${redirectUri}&response_type=code&client_id=ccd_gateway" -d "")
echo "[DEBUG] Authorization response: ${authResponse}"

code=$(echo "${authResponse}" | docker run --rm --interactive ghcr.io/jqlang/jq:latest -r .code)
echo "[INFO] Extracted authorization code: ${code}"

# Request access token
echo "[INFO] Requesting access token..."
tokenResponse=$(curl --insecure --fail --show-error --silent -X POST -H "Content-Type: application/x-www-form-urlencoded" --user "ccd_gateway:${clientSecret}" "${idamApiUrl}/oauth2/token?code=${code}&redirect_uri=${redirectUri}&grant_type=authorization_code" -d "")
echo "[DEBUG] Token response: ${tokenResponse}"

accessToken=$(echo "${tokenResponse}" | docker run --rm --interactive ghcr.io/jqlang/jq:latest -r .access_token)
echo "[INFO] Extracted access token: ${accessToken}"

# Output the access token
echo "${accessToken}"