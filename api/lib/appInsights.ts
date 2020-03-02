import * as applicationinsights from 'applicationinsights'
import * as express from 'express'
import { getConfigValue } from '../configuration'
import { APP_INSIGHTS_KEY, FEATURE_APP_INSIGHTS_ENABLED } from '../configuration/references'

export let client

export function initialiseAppInsights() {
  applicationinsights
    .setup(getConfigValue(APP_INSIGHTS_KEY))
    .setAutoDependencyCorrelation(true)
    .setAutoCollectRequests(true)
    .setAutoCollectPerformance(true)
    .setAutoCollectExceptions(true)
    .setAutoCollectDependencies(true)
    .setAutoCollectConsole(true)
    .setSendLiveMetrics(true)
    .setUseDiskRetryCaching(true)
    .start()

  client = applicationinsights.defaultClient
  client.trackTrace({ message: 'App Insight Activated' })
}

if (FEATURE_APP_INSIGHTS_ENABLED) {
  console.log('App Insights Enabled.')
  initialiseAppInsights()
}

export function appInsights(req: express.Request, res: express.Response, next) {
    if (client) {
        client.trackNodeHttpRequest({ request: req, response: res })
    }

    next()
}
