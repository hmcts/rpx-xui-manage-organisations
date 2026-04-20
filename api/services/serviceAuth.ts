import { AxiosResponse } from 'axios';
import { Request } from 'express';
import * as otp from 'otp';

import { getConfigValue } from '../configuration';
import {
  S2S_SECRET,
  SERVICE_S2S_PATH
} from '../configuration/references';
import { application } from '../lib/config/application.config';
import { http } from '../lib/http';
import * as log4jui from '../lib/log4jui';
import * as tunnel from '../lib/tunnel';

export async function postS2SLease() {
  const s2sSecret = getConfigValue(S2S_SECRET) || 'AAAAAAAAAAAAAAAA';
  const url = getConfigValue(SERVICE_S2S_PATH);
  const microservice = application.microservice;
  const logger = log4jui.getLogger('service user-profile');
  let request: AxiosResponse<any>;
  const axiosInstance = http({
    session: {
      auth: {
        token: ''
      }
    }
  } as unknown as Request);
  console.log('NODE_CONFIG_ENV is now:', process.env.NODE_CONFIG_ENV);
  console.log('postS2SLease url:', url);
  if (process.env.NODE_CONFIG_ENV !== 'ldocker') {
    const oneTimePassword = otp({ secret: s2sSecret }).totp();
    logger.info('Generating S2S token for microservice: ', microservice);
    request = await axiosInstance.post(`${url}/lease`, {
      microservice,
      oneTimePassword
    });
  } else {
    // this is only for local development against the RD docker image
    // end tunnel before posting to docker
    tunnel.end();
    request = await axiosInstance.get(`${url}`);
  }
  return request.data;
}
