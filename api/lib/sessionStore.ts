import * as connectRedis from 'connect-redis';
import * as session from 'express-session';
import * as redis from 'redis';
import * as sessionFileStore from 'session-file-store';
import { createApp } from '../application';
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

const redisStore = connectRedis(session);
const fileStore = sessionFileStore(session);

let store: session.Store = null;

export const getRedisStore = async (): Promise<connectRedis.RedisStore> => {
  const app = await createApp();
  logger.info('using RedisStore');

  const tlsOptions = {
    prefix: getConfigValue(REDIS_KEY_PREFIX)
  };

  app.locals.redisClient = redis.createClient(
    getConfigValue(REDISCLOUD_URL),
    tlsOptions
  );

  app.locals.redisClient.on('ready', () => {
    logger.info('redis client connected successfully');
  });

  app.locals.redisClient.on('error', (error) => {
    logger.error(error);
  });

  return new redisStore({
    client: app.locals.redisClient,
    ttl: getConfigValue(REDIS_TTL)
  });
};

export const getFileStore = (): session.Store => {
  logger.info('using FileStore');
  return new fileStore({
    path: getConfigValue(NOW) ? '/tmp/sessions' : '.sessions'
  });
};

export const getStore = async (): Promise<session.Store> => {
  if (!store) {
    if (showFeature(FEATURE_REDIS_ENABLED)) {
      store = await getRedisStore();
    } else {
      store = getFileStore();
    }
  }
  return store;
};
