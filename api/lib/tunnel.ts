import { createGlobalProxyAgent } from 'global-agent'
import * as log4js from 'log4js'
import {config, configEnv} from './config'

export const globalProxyAgent = createGlobalProxyAgent()

const logger = log4js.getLogger('tunnel')
logger.level = config.logging

export function init(): void {
  if (config.proxy && configEnv === 'local') {
    logger.info('configuring global-agent: ', config.proxy)
    globalProxyAgent.HTTP_PROXY = `http://${config.proxy.host}:${config.proxy.port}`
    globalProxyAgent.NO_PROXY = 'localhost'
  }
}

export function end(): void {
  globalProxyAgent.HTTP_PROXY = ''
  globalProxyAgent.NO_PROXY = ''
}
