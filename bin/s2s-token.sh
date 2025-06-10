#!/usr/bin/env bash

set -eu

microservice=${1}

curl --insecure --fail --show-error --silent -X POST \
  ${S2S_URL_BASE:-http://rpe-service-auth-provider-aat.service.core-compute-aat.internal}/testing-support/lease \
  -H "Content-Type: application/json" \
  -d '{"microservice": "'${microservice}'"}'