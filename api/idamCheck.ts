import { Request } from 'express';
import { getConfigValue } from './configuration';
import { SERVICES_IDAM_API_PATH } from './configuration/references';
import { http } from './lib/http';

export const idamCheck = async (resolve, reject) => {
  try {
    const idamApiUrl = getConfigValue(SERVICES_IDAM_API_PATH);
    const axiosInstance = http({} as unknown as Request);
    const result = await axiosInstance.get(`${idamApiUrl}/o/.well-known/openid-configuration`);
    if (!result) {
      console.log('idam api must be up to start');
      process.exit(1);
    }
  } catch (err) {
    console.log('idam api must be up to start');
    process.exit(1);
    reject(err);
  }
  resolve();
};
