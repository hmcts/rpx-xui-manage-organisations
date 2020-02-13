
import { createGlobalProxyAgent } from 'global-agent'
import * as log4js from 'log4js'

import { getConfigValue } from '../configuration'
import {ENVIRONMENT, LOGGING, PROXY_HOST, PROXY_PORT} from '../configuration/references'

export const globalProxyAgent = createGlobalProxyAgent({})

const logger = log4js.getLogger('tunnel')
logger.level = getConfigValue(LOGGING)

export function init(): void {
  const proxyHost = getConfigValue(PROXY_HOST)
  const environment = getConfigValue(ENVIRONMENT)
  const proxyPort = getConfigValue(PROXY_PORT)
  logger.info('configuring global-agent: ', proxyHost)
  if (proxyHost && environment === 'DEFAULT ENVIRONMENT') {
    logger.info('initialising tunnel, host: ', PROXY_HOST)
    logger.info('initialising tunnel, port: ', PROXY_PORT)
    process.env.GLOBAL_AGENT_HTTP_PROXY = `http://${proxyHost}:${proxyPort}`
    process.env.GLOBAL_AGENT_NO_PROXY = 'localhost'
    createGlobalProxyAgent({})
  }
}
