export default {
    logging: 'debug',
    secureCookie: false,
    services: {
        ccdDataApi: 'https://ccd-data-store-api-aat.service.core-compute-aat.internal',
        ccdComponentApi: 'https://ccd-api-gateway-web-aat.service.core-compute-aat.internal',
        idamWeb: 'https://idam-web-public.ithc.platform.hmcts.net',
        idamApi: 'https://idam-api.preview.platform.hmcts.net',
        s2s: 'https://rpe-service-auth-provider-aat.service.core-compute-aat.internal',
        rdProfessionalApi: 'https://rd-professional-api-preview.service.core-compute-preview.internal',
    },
    health: {
        ccdDataApi: 'https://ccd-data-store-api-aat.service.core-compute-aat.internal/health',
        ccdComponentApi: 'https://ccd-api-gateway-web-aat.service.core-compute-aat.internal/health',
        idamWeb: 'https://idam-web-public.preview.platform.hmcts.net/health',
        idamApi: 'https://idam-api.preview.platform.hmcts.net/health',
        s2s: 'https://rpe-service-auth-provider-aat.service.core-compute-aat.internal/health',
        rdProfessionalApi: 'https://rd-professional-api-preview.service.core-compute-preview.internal/health',
    },
    sessionSecret: 'secretSauce',
    useProxy: false,
}
