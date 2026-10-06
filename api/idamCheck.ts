import { Request } from 'express';
import { getConfigValue } from './configuration';
import { SERVICES_IDAM_API_PATH } from './configuration/references';
import { http } from './lib/http';
import * as log4jui from './lib/log4jui';

const logger = log4jui.getLogger('idam-check');

export const idamCheck = async (resolve, reject) => {
  try {
    const idamApiUrl = getConfigValue(SERVICES_IDAM_API_PATH);
    const axiosInstance = http({} as unknown as Request);
    const result = await axiosInstance.get(`${idamApiUrl}/o/.well-known/openid-configuration`);
    if (!result) {
      logger.error('IDAM API must be up to start', { url: idamApiUrl });
      process.exit(1);
    }
  } catch (err) {
    logger.error('IDAM API must be up to start', err);
    process.exit(1);
    reject(err);
  }
  resolve();
};
