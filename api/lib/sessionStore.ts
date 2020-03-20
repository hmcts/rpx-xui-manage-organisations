import * as connectRedis from 'connect-redis'
import * as session from 'express-session'
import * as redis from 'redis'
import * as sessionFileStore from 'session-file-store'
import {getConfigValue, showFeature} from '../configuration'
import {
  FEATURE_REDIS_ENABLED,
  NOW,
  REDIS_HOST, REDIS_KEY_PREFIX,
  REDIS_PASSWORD,
  REDIS_PORT,
  REDIS_SSL_ENABLED,
  REDIS_TTL
} from '../configuration/references'
import * as log4jui from './log4jui'

export const logger = log4jui.getLogger('sessionStore')

const RedisStore = connectRedis(session)
const FileStore = sessionFileStore(session)

let store: session.Store = null

export const getRedisStore = (): connectRedis.RedisStore => {
  logger.info('using RedisStore')

  const tlsOptions = {
    password: getConfigValue(REDIS_PASSWORD),
    prefix: getConfigValue(REDIS_KEY_PREFIX),
    tls: getConfigValue(REDIS_SSL_ENABLED),
  }

  const redisClient = redis.createClient(
    getConfigValue(REDIS_PORT),
    getConfigValue(REDIS_HOST),
    tlsOptions
  )

  redisClient.on('ready', () => {
    logger.info('redis client connected successfully')
  })

  redisClient.on('error', logger.error)

  return new RedisStore({
    client: redisClient,
    ttl: getConfigValue(REDIS_TTL),
  })
}

export const getFileStore = (): session.Store => {
  logger.info('using FileStore')
  return new FileStore({
    path: getConfigValue(NOW) ? '/tmp/sessions' : '.sessions',
  })
}

export const getStore = (): session.Store => {
  if (!store) {
    if (showFeature(FEATURE_REDIS_ENABLED)) {
      store = getRedisStore()
    } else {
      store = getFileStore()
    }
  }
  return store
}
