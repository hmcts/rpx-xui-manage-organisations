import { createGlobalProxyAgent } from 'global-agent';
import * as log4js from 'log4js';

import { getConfigValue, showFeature } from '../configuration';
import { FEATURE_PROXY_ENABLED, LOGGING } from '../configuration/references';

export function init(): void {
  const logger = log4js.getLogger('tunnel');
  logger.level = getConfigValue(LOGGING);

  if (showFeature(FEATURE_PROXY_ENABLED)) {
    logger.info('Configuring global-agent proxy', {
      httpProxyConfigured: Boolean(process.env.MO_HTTP_PROXY),
      noProxy: process.env.MO_NO_PROXY
    });
    createGlobalProxyAgent({
      environmentVariableNamespace: 'MO_'
    });
  }
}

export function end() {
  process.env.MO_HTTP_PROXY = '';
  process.env.MO_NO_PROXY = '';
}
