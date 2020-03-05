
import { createGlobalProxyAgent } from 'global-agent'
import * as log4js from 'log4js'

import { getConfigValue, showFeature } from '../configuration'
import { FEATURE_PROXY_ENABLED, LOGGING, PROXY_HOST, PROXY_PORT} from '../configuration/references'

export const globalProxyAgent = createGlobalProxyAgent({})

const logger = log4js.getLogger('tunnel')
logger.level = getConfigValue(LOGGING)

export function init(): void {
  const proxyHost = getConfigValue(PROXY_HOST)
  const proxyPort = getConfigValue(PROXY_PORT)
  if (showFeature(FEATURE_PROXY_ENABLED)) {
    logger.info('Initialise Tunnel.')
    logger.info('initialising tunnel, host: ', proxyHost)
    logger.info('initialising tunnel, port: ', proxyPort)
    process.env.GLOBAL_AGENT_HTTP_PROXY = `http://${proxyHost}:${proxyPort}`
    process.env.GLOBAL_AGENT_NO_PROXY = 'localhost'
    createGlobalProxyAgent({})
  }
}

export function end() {
  process.env.GLOBAL_AGENT_HTTP_PROXY = ''
  process.env.GLOBAL_AGENT_NO_PROXY = ''
}
