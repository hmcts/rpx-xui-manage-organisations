import * as applicationinsights from 'applicationinsights';
import { getConfigValue, hasConfigValue, showFeature } from '../configuration';
import { APP_INSIGHTS_CONNECTION_STRING, FEATURE_APP_INSIGHTS_ENABLED } from '../configuration/references';

export let client;

export function initialiseAppInsights() {
  // Check the APP_INSIGHTS_CONNECTION_STRING config value is present before trying to initialise the App Insights client
  if (hasConfigValue(APP_INSIGHTS_CONNECTION_STRING)) {
    applicationinsights
      .setup(getConfigValue(APP_INSIGHTS_CONNECTION_STRING))
      .setAutoDependencyCorrelation(true)
      .setAutoCollectRequests(true)
      .setAutoCollectPerformance(true)
      .setAutoCollectExceptions(true)
      .setAutoCollectDependencies(true)
      .setAutoCollectConsole(true)
      .setSendLiveMetrics(true)
      .setUseDiskRetryCaching(true)
      .start();

    client = applicationinsights.defaultClient;
    client.context.tags[client.context.keys.cloudRole] = 'xui-mo';
    client.trackTrace({ message: 'App Insights activated' });
  } else {
    console.error(`App Insights not activated: connection string "${APP_INSIGHTS_CONNECTION_STRING}" is not defined!`);
  }
}

if (showFeature(FEATURE_APP_INSIGHTS_ENABLED)) {
  console.log('App Insights enabled');
  initialiseAppInsights();
}

export function resetAppInsights() {
  if (client) {
    client = null;
  }
}
