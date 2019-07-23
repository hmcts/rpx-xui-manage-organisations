export default {
    logging: 'debug',
    secureCookie: false,
    services: {
        ccdDataApi: 'https://ccd-data-store-api-aat.service.core-compute-aat.internal',
        ccdComponentApi: 'https://ccd-api-gateway-web-aat.service.core-compute-aat.internal',
        idamWeb: 'https://idam-web-public.ithc.platform.hmcts.net',
        idamApi: 'https://idam-api.aat.platform.hmcts.net',
        s2s: 'https://rpe-service-auth-provider-aat.service.core-compute-aat.internal',
    },
    sessionSecret: 'secretSauce',
    useProxy: false,
}
