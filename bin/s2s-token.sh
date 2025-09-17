#!/bin/bash
# usage: s2s-token.sh [microservice]

S2S_HOST=${S2S_HOST:-http://rpe-service-auth-provider-aat.service.core-compute-aat.internal}
MICROSERVICE=${1:-ccd_gw}

curl --silent --location "${S2S_HOST}/testing-support/lease" \
--header 'Content-Type: application/json' \
--data "{ \"microservice\": \"${MICROSERVICE}\" }"