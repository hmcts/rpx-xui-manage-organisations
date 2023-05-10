import axios from 'axios';
import * as jwtDecode from 'jwt-decode';

import { getConfigValue } from '../configuration';
import { MICROSERVICE } from '../configuration/references';
import { asyncReturnOrError } from '../lib/util';
import { postS2SLease } from '../services/serviceAuth';
import * as log4jui from './log4jui';

const logger = log4jui.getLogger('service-token');
const cache = {};
const microservice = getConfigValue(MICROSERVICE);

export function validateCache(): boolean {
  logger.info('validaing s2s cache');
  const currentTime = Math.floor(Date.now() / 1000);
  if (!cache[microservice]) {
    return false;
  }
  return currentTime < cache[microservice].expiresAt;
}

export function getToken(): any {
  return cache[microservice];
}

export async function generateToken(): Promise<any> {
  logger.info('Getting new s2s token');
  const token = await postS2SLease();

  const tokenData: any = jwtDecode(token);

  cache[microservice] = {
    expiresAt: tokenData.exp,
    token
  };

  return token;
}

export async function serviceTokenGenerator(): Promise<any> {
  if (validateCache()) {
    logger.info('Getting cached s2s token');
    const tokenData = getToken();
    return tokenData.token;
  }
  return await generateToken();
}

export default async (req, res, next) => {
  const token = await asyncReturnOrError(generateToken(), 'Error getting s2s token', res, logger);
  if (token) {
    logger.info('Adding s2s token to defaults');
    req.headers.ServiceAuthorization = `Bearer ${token}`;

    axios.defaults.headers.common.ServiceAuthorization = req.headers.ServiceAuthorization;

    next();
  }
};
