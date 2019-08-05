export default {
  services: {
    ccdDataApi: 'https://ccd-data-store-api-demo.service.core-compute-demo.internal',
    ccdDefApi: 'https://ccd-definition-store-api-demo.service.core-compute-demo.internal',
    idamWeb: 'https://idam-web-public.demo.platform.hmcts.net',
    idamApi: 'https://idam-api.demo.platform.hmcts.net',
    s2s: 'https://rpe-service-auth-provider-aat.service.core-compute-aat.internal',
    rdProfessionalApi: 'https://rd-professional-api-demo.service.core-compute-preview.demo',
  },
  health: {
    ccdDataApi: 'https://ccd-data-store-api-demo.service.core-compute-demo.internal/health',
    ccdDefApi: 'https://ccd-definition-store-api-demo.service.core-compute-demo.internal/health',
    idamWeb: 'https://idam-web-public.demo.platform.hmcts.net/health',
    idamApi: 'https://idam-api.demo.platform.hmcts.net/health',
    s2s: 'https://rpe-service-auth-provider-aat.service.core-compute-aat.internal/health',
    rdProfessionalApi: 'https://rd-professional-api-demo.service.core-compute-demo.internal/health',
  },
  useProxy: false,
  secureCookie: false,
  sessionSecret: 'secretSauce',
  logging: 'debug',
}
