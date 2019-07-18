export const application = {
    cookies: {
        token: '__auth__',
        userId: '__userid__',
    },
    microservice: 'prd',
    idamClient: 'rd-professional-api',
    oauthCallbackUrl: '/oauth2redirect',
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
