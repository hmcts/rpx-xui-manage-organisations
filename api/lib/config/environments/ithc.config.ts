export default {

  services: {
    ccdDataApi: 'https://ccd-data-store-api-demo.service.core-compute-demo.internal',
    ccdDefApi: 'https://ccd-definition-store-api-demo.service.core-compute-demo.internal',
    idamWeb: 'https://idam-web-public.ithc.platform.hmcts.net',
    idamApi: 'https://idam-api.ithc.platform.hmcts.net',
    s2s: 'http://rpe-service-auth-provider-ithc.service.core-compute-ithc.internal',
    rdProfessionalApi: 'https://rd-professional-api-ithc.service.core-compute-ithc.internal',
  },
  health: {
    ccdDataApi: 'https://ccd-data-store-api-demo.service.core-compute-demo.internal/health',
    ccdDefApi: 'https://ccd-definition-store-api-demo.service.core-compute-demo.internal/health',
    idamWeb: 'https://idam-web-public.ithc.platform.hmcts.net/health',
    idamApi: 'https://idam-api.ithc.platform.hmcts.net/health',
    s2s: 'http://rpe-service-auth-provider-ithc.service.core-compute-ithc.internal/health',
    rdProfessionalApi: 'https://rd-professional-api-ithc.service.core-compute-ithc.internal/health',
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
