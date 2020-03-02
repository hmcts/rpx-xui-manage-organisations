import * as applicationinsights from 'applicationinsights'
import * as express from 'express'
import { getConfigValue } from '../configuration'
import { APP_INSIGHTS_KEY } from '../configuration/references'

export let client

/**
 * TODO: Write feature toggle around this.
 */
export function initialiseAppInsights() {
  console.log('app insights inside')
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

initialiseAppInsights()

export function appInsights(req: express.Request, res: express.Response, next) {
    if (client) {
        client.trackNodeHttpRequest({ request: req, response: res })
    }

    next()
}
