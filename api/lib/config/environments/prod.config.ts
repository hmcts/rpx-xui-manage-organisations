export default {
    services: {
        ccdDataApi: 'https://ccd-data-store-api-prod.service.core-compute-prod.internal',
        ccdDefApi: 'https://ccd-definition-store-api-prod.service.core-compute-prod.internal',
        idamWeb: 'https://hmcts-access.service.gov.uk',
        idamApi: 'https://idam-api.platform.hmcts.net',
        s2s: 'https://rpe-service-auth-provider-prod.service.core-compute-prod.internal',
        rdProfessionalApi: 'https://rd-professional-prod.service.core-compute-prod.internal',
    },
    health: {
        ccdDataApi: 'https://ccd-data-store-api-prod.service.core-compute-prod.internal/health',
        ccdDefApi: 'https://ccd-definition-store-api-prod.service.core-compute-prod.internal/health',
        idamWeb: 'https://hmcts-access.service.gov.uk/health',
        idamApi: 'https://idam-api.platform.hmcts.net/health',
        s2s: 'https://rpe-service-auth-provider-prod.service.core-compute-prod.internal/health',
        rdProfessionalApi: 'https://rd-professional-prod.service.core-compute-prod.internal/health',
    },
    useProxy: false,
    secureCookie: true,
    sessionSecret: 'secretSauce',
}
