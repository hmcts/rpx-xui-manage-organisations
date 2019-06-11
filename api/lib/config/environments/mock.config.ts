export default {
    services: {
        ccdDataApi: 'http://localhost:3004',
        ccdDefApi: 'https://ccd-definition-store-api-aat.service.core-compute-aat.internal',
        idamWeb: 'https://idam.preprod.ccidam.reform.hmcts.net',
        idamApi: 'https://preprod-idamapi.reform.hmcts.net:3511',
        s2s: 'https://rpe-service-auth-provider-aat.service.core-compute-aat.internal',
        draftStoreApi: 'https://draft-store-service-aat.service.core-compute-aat.internal',
        dmStoreApi: 'https://dm-store-aat.service.core-compute-aat.internal',
        emAnnoApi: 'https://em-anno-aat.service.core-compute-aat.internal',
        emNpaApi: 'https://em-npa-aat.service.core-compute-aat.internal',
        cohCorApi: 'https://coh-cor-aat.service.core-compute-aat.internal',
    },
    useProxy: true,
    protocol: 'http',
    secureCookie: false,
    sessionSecret: 'secretSauce',
}
