export const application = {
    cookies: {
        token: '__auth__',
        userId: '__userid__',
    },
    microservice: 'jui_webapp',
    idamClient: 'xuiwebapp',
    oauthCallbackUrl: '/oauth2/callback',
    protocol: 'https',
    logging: 'debug',
    maxLogLine: 80,
    exceptionOptions: {
        maxLines: 1,
    },
    indexUrl: '/',
    secureCookie: false,
    sessionSecret: 'secretSauce',
}
