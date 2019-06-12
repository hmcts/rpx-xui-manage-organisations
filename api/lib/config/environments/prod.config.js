module.exports = {
    services: {
        ccdDataApi: 'https://ccd-data-store-api-prod.service.core-compute-prod.internal',
        ccdDefApi: 'https://ccd-definition-store-api-prod.service.core-compute-prod.internal',
        idamWeb: 'https://hmcts-access.service.gov.uk',
        //idam_api: 'https://idam-api.platform.hmcts.net',
        s2s: 'https://rpe-service-auth-provider-prod.service.core-compute-prod.internal',
        draftStoreApi: 'https://draft-store-service-prod.service.core-compute-prod.internal',
        dmStoreApi: 'https://dm-store-prod.service.core-compute-prod.internal',
        emAnnoApi: 'https://em-anno-prod.service.core-compute-prod.internal',
        emNpaApi: 'https://em-npa-prod.service.core-compute-prod.internal',
    },
    useProxy: false,
    secureCookie: false,
    sessionSecret: 'secretSauce',
}
