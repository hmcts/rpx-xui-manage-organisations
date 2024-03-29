export default {
  services: {
    ccdDataApi: 'https://ccd-data-store-api-saat.service.core-compute-saat.internal',
    ccdDefApi: 'https://ccd-definition-store-api-saat.service.core-compute-saat.internal',
    idamWeb: 'https://idam-test.dev.ccidam.reform.hmcts.net',
    idamApi: 'https://betaDevBccidamAppLB.reform.hmcts.net',
    s2s: 'http://rpe-service-auth-provider-saat.service.core-compute-saat.internal',
    draftStoreApi: 'https://draft-store-service-saat.service.core-compute-saat.internal',
    dmStoreApi: 'https://dm-store-saat.service.core-compute-saat.internal',
    emAnnoApi: 'https://em-anno-saat.service.core-compute-saat.internal',
    emNpaApi: 'https://em-npa-saat.service.core-compute-saat.internal'
  },
  health: {
    ccdDataApi: 'https://ccd-data-store-api-saat.service.core-compute-saat.internal/health',
    ccdDefApi: 'https://ccd-definition-store-api-saat.service.core-compute-saat.internal/health',
    idamWeb: 'https://idam-test.dev.ccidam.reform.hmcts.net/health',
    idamApi: 'https://betaDevBccidamAppLB.reform.hmcts.net/health',
    s2s: 'http://rpe-service-auth-provider-saat.service.core-compute-saat.internal/health',
    draftStoreApi: 'https://draft-store-service-saat.service.core-compute-saat.internal/health',
    dmStoreApi: 'https://dm-store-saat.service.core-compute-saat.internal/health',
    emAnnoApi: 'https://em-anno-saat.service.core-compute-saat.internal/health',
    emNpaApi: 'https://em-npa-saat.service.core-compute-saat.internal/health'
  },
  useProxy: false,
  secureCookie: false,
  sessionSecret: 'secretSauce'
};
