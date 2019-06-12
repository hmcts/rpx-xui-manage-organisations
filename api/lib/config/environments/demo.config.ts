export default {
    services: {
        ccdDataApi: 'https://ccd-data-store-api-demo.service.core-compute-demo.internal',
        ccdDefApi: 'https://ccd-definition-store-api-aat.service.core-compute-aat.internal',
        idamWeb: 'https://idam.preprod.ccidam.reform.hmcts.net',
        idamApi: 'https://preprod-idamapi.reform.hmcts.net:3511',
        s2s: 'https://rpe-service-auth-provider-demo.service.core-compute-demo.internal',
        draftStoreApi: 'https://draft-store-service-demo.service.core-compute-demo.internal',
        dmStoreApi: 'https://dm-store-demo.service.core-compute-demo.internal',
        emAnnoApi: 'https://em-anno-demo.service.core-compute-demo.internal',
        emNpaApi: 'https://em-npa-demo.service.core-compute-demo.internal',
        rd_professional_api: 'https://rpa-rd-professional-aat.service.core-compute-aat.internal',
    },
    useProxy: false,
    secureCookie: false,
    sessionSecret: 'secretSauce',
    logging: 'debug',
}
