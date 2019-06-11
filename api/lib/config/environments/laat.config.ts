export default {
    services: {
        ccdDataApi: 'https://ccd-data-store-api-aat.service.core-compute-aat.internal',
        ccdDefApi: 'https://ccd-definition-store-api-aat.service.core-compute-aat.internal',
        idamWeb: 'https://idam.preprod.ccidam.reform.hmcts.net',
        idamApi: 'https://preprod-idamapi.reform.hmcts.net:3511',
        s2s: 'https://rpe-service-auth-provider-aat.service.core-compute-aat.internal',
        draftStoreApi: 'https://draft-store-service-aat.service.core-compute-aat.internal',
        dmStoreApi: 'https://dm-store-aat.service.core-compute-aat.internal',
        emAnnoApi: 'https://em-anno-aat.service.core-compute-aat.internal',
        emNpaApi: 'https://em-npa-aat.service.core-compute-aat.internal',
        cohCorApi: 'https://coh-cor-aat.service.core-compute-aat.internal',
        rd_professional_api: 'https://rpa-rd-professional-aat.service.core-compute-aat.internal',
    },
    proxy: {
        host: '172.16.0.7',
        port: 8080,
    },
    protocol: 'http',
    secureCookie: false,
    sessionSecret: 'secretSauce',
    logging: 'debug',
}
