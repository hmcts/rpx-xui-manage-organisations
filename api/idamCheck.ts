import { Request } from 'express';
import { getConfigValue } from './configuration';
import { SERVICES_IDAM_WEB } from './configuration/references';
import { http } from './lib/http';
import * as log4jui from './lib/log4jui';

const logger = log4jui.getLogger('idam-check');

export const idamCheck = async (resolve, reject) => {
  try {
    const idamWebUrl = getConfigValue(SERVICES_IDAM_WEB);
    const axiosInstance = http({} as unknown as Request);
    const result = await axiosInstance.get(`${idamWebUrl}/o/.well-known/openid-configuration`);
    if (!result) {
      logger.error('IDAM OIDC discovery must be available to start', { url: idamWebUrl });
      process.exit(1);
    }
  } catch (err) {
    logger.error('IDAM OIDC discovery must be available to start', err);
    process.exit(1);
    reject(err);
  }
  resolve();
};
