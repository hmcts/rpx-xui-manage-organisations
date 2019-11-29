import * as globalTunnel from 'global-tunnel-ng'
import {config} from './config'
import * as log4js from 'log4js'

export const tunnel = globalTunnel

const logger = log4js.getLogger('tunnel')
logger.level = config.logging

export function init() {
  logger.info('initialising tunnel: ', config.proxy)
  globalTunnel.initialize({
    host: config.proxy.host,
    port: config.proxy.port,
  })
}
