export default {
    logging: 'debug',
    secureCookie: false,
    services: {
        ccdDataApi: 'https://ccd-data-store-api-aat.service.core-compute-aat.internal',
        ccdComponentApi: 'https://ccd-api-gateway-web-aat.service.core-compute-aat.internal',
        idamWeb: 'https://idam-web-public.aat.platform.hmcts.net',
        idamApi: 'https://idam-api.aat.platform.hmcts.net',
        s2s: 'https://rpe-service-auth-provider-aat.service.core-compute-aat.internal',
        rdProfessionalApi: 'https://rd-professional-api-preview.service.core-compute-preview.internal',
    },
    sessionSecret: 'secretSauce',
    useProxy: false,
}
