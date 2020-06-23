import * as applicationinsights from 'applicationinsights'
import { NextFunction, Request, Response } from 'express'
import {getConfigValue, showFeature} from '../configuration'
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
  client.context.tags[client.context.keys.cloudRole] = 'xui-mo'
  client.trackTrace({ message: 'App Insight Activated' })
}

if (showFeature(FEATURE_APP_INSIGHTS_ENABLED)) {
  console.log('App Insights Enabled.')
  initialiseAppInsights()
}

export function appInsights(req: Request, res: Response, next: NextFunction) {
    if (client) {
        client.trackNodeHttpRequest({ request: req, response: res })
    }

    next()
}

export function resetAppInsights() {
  if (client) {
    client = null
  }
}
