import { RedisStore } from 'connect-redis';
import session from 'express-session';
import { createClient, RedisClientType } from 'redis';
import sessionFileStore from 'session-file-store';
import { app } from '../application';
import { getConfigValue, showFeature } from '../configuration';
import {
  FEATURE_REDIS_ENABLED,
  NOW,
  REDIS_KEY_PREFIX,
  REDIS_TTL,
  REDISCLOUD_URL
} from '../configuration/references';
import * as log4jui from './log4jui';

export const logger = log4jui.getLogger('sessionStore');

const fileStore = sessionFileStore(session);

let store: session.Store = null;

export const getRedisStore = (): RedisStore => {
  logger.info('using RedisStore');

  const redisCloudUrl = getConfigValue<string>(REDISCLOUD_URL);

  app.locals.redisClient = createClient({
    url: redisCloudUrl
  }) as RedisClientType;

  app.locals.redisClient.on('ready', () => {
    logger.info('redis client connected successfully');
  });

  app.locals.redisClient.on('error', (error) => {
    logger.error(error);
  });

  app.locals.redisClient.connect().catch((error: Error) => {
    logger.error(error);
  });

  return new RedisStore({
    client: app.locals.redisClient,
    prefix: getConfigValue<string>(REDIS_KEY_PREFIX),
    ttl: getConfigValue(REDIS_TTL)
  });
};

export const getFileStore = (): session.Store => {
  logger.info('using FileStore');
  return new fileStore({
    path: getConfigValue(NOW) ? '/tmp/sessions' : '.sessions'
  });
};

export const getStore = (): session.Store => {
  if (!store) {
    if (showFeature(FEATURE_REDIS_ENABLED)) {
      store = getRedisStore();
    } else {
      store = getFileStore();
    }
  }
  return store;
};
