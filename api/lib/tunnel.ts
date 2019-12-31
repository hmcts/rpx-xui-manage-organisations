import * as globalTunnel from 'global-tunnel-ng'
import * as log4js from 'log4js'
import { getConfigValue } from '../configuration'
import {LOGGING, PROXY_HOST, PROXY_PORT} from '../configuration/references'

export const tunnel = globalTunnel

const logger = log4js.getLogger('tunnel')
logger.level = getConfigValue(LOGGING)

export function init() {
  logger.info('initialising tunnel, host: ', PROXY_HOST)
  logger.info('initialising tunnel, port: ', PROXY_PORT)
  globalTunnel.initialize({
    host: getConfigValue(PROXY_HOST),
    port: getConfigValue(PROXY_PORT),
  })
}
