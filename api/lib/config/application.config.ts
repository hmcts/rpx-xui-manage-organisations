export const application = {
    cookies: {
        token: '__auth__',
        userId: '__userid__'
    },
    microservice: 'jui_webapp',
    idam_client: 'juiwebapp',
    oauth_callback_url: 'oauth2/callback',
    protocol: 'https',
    appInsightsInstrumentationKey: process.env.APPINSIGHTS_INSTRUMENTATIONKEY || "AAAAAAAAAAAAAAAA",
    logging: 'debug',
    maxLogLine: 80,
    proxy: {
      host: '172.16.0.7',
      port: 8080,
    },
    exceptionOptions: {
      maxLines: 1,
    },
    indexUrl: '/',
    secureCookie: false,
    sessionSecret: 'secretSauce'
};
