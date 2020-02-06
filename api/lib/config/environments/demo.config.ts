export default {
  services: {
    ccdDataApi: 'http://ccd-data-store-api-demo.service.core-compute-demo.internal',
    ccdDefApi: 'http://ccd-definition-store-api-demo.service.core-compute-demo.internal',
    idamWeb: 'https://idam-web-public.demo.platform.hmcts.net',
    idamApi: 'https://idam-api.demo.platform.hmcts.net',
    s2s: 'http://rpe-service-auth-provider-demo.service.core-compute-demo.internal',
    rdProfessionalApi: 'http://rd-professional-api-demo.service.core-compute-demo.internal',
    feeAndPayApi: 'http://payment-api-demo.service.core-compute-demo.internal',
  },
  health: {
    ccdDataApi: 'http://ccd-data-store-api-demo.service.core-compute-demo.internal/health',
    ccdDefApi: 'http://ccd-definition-store-api-demo.service.core-compute-demo.internal/health',
    idamWeb: 'https://idam-web-public.demo.platform.hmcts.net/health',
    idamApi: 'https://idam-api.demo.platform.hmcts.net/health',
    s2s: 'http://rpe-service-auth-provider-demo.service.core-compute-demo.internal/health',
    rdProfessionalApi: 'http://rd-professional-api-demo.service.core-compute-demo.internal/health',
    feeAndPayApi: 'http://payment-api-demo.service.core-compute-demo.internal/health',

  },
  useProxy: false,
  secureCookie: false,
  sessionSecret: 'secretSauce',
  logging: 'debug',
  jurisdictions: [
    {id: 'SSCS'},
    {id: 'AUTOTEST1'},
    {id: 'DIVORCE'},
    {id: 'PROBATE'},
    {id: 'PUBLICLAW'},
    {id: 'bulkscan'},
    {id: 'BULKSCAN'},
    {id: 'IA'},
    {id: 'EMPLOYMENT'},
    {id: 'CMC'}
      ],
}
