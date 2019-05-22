export default {
  appInsightsInstrumentationKey: "AAAAAAAAAAAAAAAA",
  cookies: {
    token: '__auth__',
    userId: '__userid__',
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
      idamApiUrl: 'https://idam-api.aat.platform.hmcts.net/',
      idamClientID: 'juiwebapp',
      idamLoginUrl: 'https://idam-web-public.aat.platform.hmcts.net/login',
      indexUrl: '/',
      oauthCallbackUrl: '/oauth2/callback',
    },
    payment_api: 'https://payment-api-aat.service.core-compute-aat.internal',
    rdProfessionalApi: 'https://rpa-rd-professional-aat.service.core-compute-aat.internal',
  },
  sessionSecret: 'secretSauce',
}
