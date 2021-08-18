import { createGlobalProxyAgent } from 'global-agent'
import * as log4js from 'log4js'

import { getConfigValue, showFeature } from '../configuration'
import { FEATURE_PROXY_ENABLED, LOGGING } from '../configuration/references'

export function init(): void {
  const logger = log4js.getLogger('tunnel')
  logger.level = getConfigValue(LOGGING)

  if (showFeature(FEATURE_PROXY_ENABLED)) {
    console.log('THIS IS TEST for TUNNEL')
    logger.info('configuring global-agent: ', process.env.MO_HTTP_PROXY, ' no proxy: ', process.env.MO_NO_PROXY)
    createGlobalProxyAgent({
      environmentVariableNamespace: 'MO_',
    })
  }
}

export function end() {
  process.env.MO_HTTP_PROXY = ''
  process.env.MO_NO_PROXY = ''
}
