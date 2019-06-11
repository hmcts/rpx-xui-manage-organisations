export default {
    s2s: 'http://rpe-service-auth-provider-aat.service.core-compute-aat.internal',
    secureCookie: false,
    services: {
        idam: {
            idamApiUrl: 'https://idam-api.aat.platform.hmcts.net',
            idamClientID: 'juiwebapp',
            idamLoginUrl: 'https://idam-web-public.aat.platform.hmcts.net/login',
            indexUrl: '/',
            oauthCallbackUrl: '/oauth2/callback',
        },
        paymentApi: 'https://payment-api-aat.service.core-compute-aat.internal',
        rdProfessionalApi: 'https://rpa-rd-professional-aat.service.core-compute-aat.internal',
    },
    sessionSecret: 'secretSauce',
}
