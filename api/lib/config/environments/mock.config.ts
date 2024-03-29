export default {
  services: {
    ccdDataApi: 'http://localhost:3004',
    ccdDefApi: 'https://ccd-definition-store-api-aat.service.core-compute-aat.internal',
    idamWeb: 'https://idam-web-public.aat.platform.hmcts.net',
    idamApi: 'https://idam-api.aat.platform.hmcts.net',
    s2s: 'http://rpe-service-auth-provider-aat.service.core-compute-aat.internal',
    draftStoreApi: 'https://draft-store-service-aat.service.core-compute-aat.internal',
    dmStoreApi: 'https://dm-store-aat.service.core-compute-aat.internal',
    emAnnoApi: 'https://em-anno-aat.service.core-compute-aat.internal',
    emNpaApi: 'https://em-npa-aat.service.core-compute-aat.internal',
    cohCorApi: 'https://coh-cor-aat.service.core-compute-aat.internal'
  },
  health: {
    ccdDataApi: 'http://localhost:3004/health',
    ccdDefApi: 'https://ccd-definition-store-api-aat.service.core-compute-aat.internal/health',
    idamWeb: 'https://idam-web-public.aat.platform.hmcts.net/health',
    idamApi: 'https://idam-api.aat.platform.hmcts.net/health',
    s2s: 'http://rpe-service-auth-provider-aat.service.core-compute-aat.internal/health',
    draftStoreApi: 'https://draft-store-service-aat.service.core-compute-aat.internal/health',
    dmStoreApi: 'https://dm-store-aat.service.core-compute-aat.internal/health',
    emAnnoApi: 'https://em-anno-aat.service.core-compute-aat.internal/health',
    emNpaApi: 'https://em-npa-aat.service.core-compute-aat.internal/health',
    cohCorApi: 'https://coh-cor-aat.service.core-compute-aat.internal/health'
  },
  useProxy: true,
  protocol: 'http',
  secureCookie: false,
  sessionSecret: 'secretSauce'
};
