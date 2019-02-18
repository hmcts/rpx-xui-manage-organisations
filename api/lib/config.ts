export default {
  appInsightsInstrumentationKey: "AAAAAAAAAAAAAAAA",
  cookies: {
    token: '__auth__',
    userId: '__userid__',
    webId: 'jui-webapp'
  },
  exceptionOptions: {
    maxLines: 1,
  },
  indexUrl: '/',
  logging: 'debug',
  maxLogLine: 80,
  microservice: 'jui_webapp',
  production: false,
  protocol: 'http',
  proxy: {
    host: '172.16.0.7',
    port: 8080,
  },
  s2s: 'http://rpe-service-auth-provider-aat.service.core-compute-aat.internal',
  secureCookie: false,
  services: {
    idam: {
      idamApiUrl: 'https://preprod-idamapi.reform.hmcts.net:3511',
      idamClientID: 'juiwebapp',
      idamLoginUrl: 'https://idam.preprod.ccidam.reform.hmcts.net/login',
      indexUrl: '/',
      oauthCallbackUrl: '/oauth2/callback',
    },
    rd_professional_api: 'https://rpa-rd-professional-aat.service.core-compute-aat.internal',
  },
  sessionSecret: 'secretSauce',
}
