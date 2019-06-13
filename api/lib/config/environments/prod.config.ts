export default {
    services: {
        ccdDataApi: 'https://ccd-data-store-api-prod.service.core-compute-prod.internal',
        ccdDefApi: 'https://ccd-definition-store-api-prod.service.core-compute-prod.internal',
        idamWeb: 'https://idam-web-public-idam-prod.service.core-compute-prod.internal',
        idamApi: 'https://idam-api-idam-prod.service.core-compute-prod.internal',
        s2s: 'https://rpe-service-auth-provider-prod.service.core-compute-prod.internal',
        draftStoreApi: 'https://draft-store-service-prod.service.core-compute-prod.internal',
        dmStoreApi: 'https://dm-store-prod.service.core-compute-prod.internal',
        emAnnoApi: 'https://em-anno-prod.service.core-compute-prod.internal',
        emNpaApi: 'https://em-npa-prod.service.core-compute-prod.internal',
        rdProfessionalApi: 'https://rpa-rd-professional-aat.service.core-compute-aat.internal',
    },
    useProxy: false,
    secureCookie: true,
    sessionSecret: 'secretSauce',
}
