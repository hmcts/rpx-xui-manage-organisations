import * as healthcheck from '@hmcts/nodejs-healthcheck'
import {getConfigValue, showFeature} from '../configuration'
import {
  FEATURE_REDIS_ENABLED,
  SERVICE_S2S_PATH,
} from '../configuration/references'
import {redisHealth} from './redis.health'

export const checkServiceHealth = service => healthcheck.web(`${service}/health`, {
  deadline: 6000,
  timeout: 12000,
})

/**
 * Health Checks
 *
 * Check each 3rd party endpoint to see if it's up and running.
 */
export const healthChecks = {
  checks: {
    s2s: checkServiceHealth(getConfigValue(SERVICE_S2S_PATH)),
  },
}

/*if (showFeature(FEATURE_TERMS_AND_CONDITIONS_ENABLED)) {
  healthChecks.checks = {...healthChecks.checks, ...{
  termsAndConditions: checkServiceHealth(getConfigValue(SERVICES_TERMS_AND_CONDITIONS_URL)),
    },
  }
}*/

if (showFeature(FEATURE_REDIS_ENABLED)) {
  healthChecks.checks = {...healthChecks.checks, ...{
      redis: healthcheck.raw(async () => {
        const status = await redisHealth()
        return status ? healthcheck.up() : healthcheck.down()
      }),
    }}
}

/**
 * Add Reform standard Health Checks for /health and /health/liveness
 * to the application.
 *
 * Note that these checks are hit in the Build pipelines.
 *
 * @param app
 */
export const addReformHealthCheck = app => {
  healthcheck.addTo(app, healthChecks)
}
