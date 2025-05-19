import { getConfigValue } from 'configuration';
import { IDAM_CLIENT } from 'configuration/references';

export const application = {
  cookies: {
    token: '__auth__',
    userId: '__userid__'
  },
  microservice: 'xui_webapp',
  idamClient: getConfigValue(IDAM_CLIENT),
  oauthCallbackUrl: '/oauth2/callback',
  protocol: 'https',
  logging: 'debug',
  maxLogLine: 80,
  exceptionOptions: {
    maxLines: 1
  },
  indexUrl: '/',
  secureCookie: false,
  sessionSecret: 'secretSauce'
};
