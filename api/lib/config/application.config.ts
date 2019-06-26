export const application = {
    cookies: {
        token: '__auth__',
        userId: '__userid__',
    },
    exceptionOptions: {
      maxLines: 1,
    },
    idamClient: 'xuiwebapp',
    indexUrl: '/',
    logging: 'debug',
    maxLogLine: 80,
    microservice: 'jui_webapp',
    oauthCallbackUrl: '/oauth2/callback',
    protocol: 'https',
    secureCookie: false,
    sessionSecret: 'secretSauce',
}
