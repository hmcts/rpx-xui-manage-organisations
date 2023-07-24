import { Request } from 'express';
import { getConfigValue } from './configuration';
import { SERVICES_IDAM_WEB } from './configuration/references';
import { http } from './lib/http';

export const idamCheck = async (resolve, reject) => {
  try {
    const idamWebUrl = getConfigValue(SERVICES_IDAM_WEB);
    const axiosInstance = http({} as unknown as Request);
    const result = await axiosInstance.get(`${idamWebUrl}/o/.well-known/openid-configuration`);
    if (!result) {
      console.log('idam must be up to start');
      process.exit(1);
    }
  } catch (err) {
    console.log('idam must be up to start');
    process.exit(1);
    reject(err);
  }
  resolve();
};
