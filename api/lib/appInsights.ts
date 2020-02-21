import * as applicationinsights from 'applicationinsights'
import * as express from 'express'
import { getConfigValue } from '../configuration'
import { APP_INSIGHTS_KEY } from '../configuration/references'

export let client

// shouldnt do this check here but this is a high level dep
const environment = process.env.PUI_ENV || 'local'

//TODO: Change the direct reference to the config.appInsightsInstrumentationKey as config will be removed.
if (environment !== 'local') {
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
} else {
    client = null
}

export function appInsights(req: express.Request, res: express.Response, next) {
    if (client) {
        client.trackNodeHttpRequest({ request: req, response: res })
    }

    next()
}
