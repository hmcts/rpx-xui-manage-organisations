export default {
    services: {
        ccdDataApi: 'https://ccd-data-store-api-sprod.service.core-compute-sprod.internal',
        ccdDefApi: 'https://ccd-definition-store-api-sprod.service.core-compute-sprod.internal',
        idamWeb: 'https://idam-test.dev.ccidam.reform.hmcts.net',
        idamApi: 'https://betaDevBccidamAppLB.reform.hmcts.net',
        s2s: 'https://rpe-service-auth-provider-sprod.service.core-compute-sprod.internal',
        draftStoreApi: 'https://draft-store-service-sprod.service.core-compute-sprod.internal',
        dmStoreApi: 'https://dm-store-sprod.service.core-compute-sprod.internal',
        emAnnoApi: 'https://em-anno-sprod.service.core-compute-sprod.internal',
        emNpaApi: 'https://em-npa-sprod.service.core-compute-sprod.internal',
    },
    useProxy: false,
    secureCookie: false,
    sessionSecret: 'secretSauce',
}
