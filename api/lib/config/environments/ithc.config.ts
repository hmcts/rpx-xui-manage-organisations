export default {

  services: {
    ccdDataApi: 'http://ccd-data-store-api-ithc.service.core-compute-ithc.internal',
    ccdDefApi: 'http://ccd-definition-store-api-ithc.service.core-compute-ithc.internal',
    idamWeb: 'https://idam-web-public.ithc.platform.hmcts.net',
    idamApi: 'https://idam-api.ithc.platform.hmcts.net',
    s2s: 'http://rpe-service-auth-provider-ithc.service.core-compute-ithc.internal',
    rdProfessionalApi: 'http://rd-professional-api-ithc.service.core-compute-ithc.internal',
  },
  health: {
    ccdDataApi: 'http://ccd-data-store-api-ithc.service.core-compute-ithc.internal/health',
    ccdDefApi: 'http://ccd-definition-store-api-ithc.service.core-compute-ithc.internal/health',
    idamWeb: 'https://idam-web-public.ithc.platform.hmcts.net/health',
    idamApi: 'https://idam-api.ithc.platform.hmcts.net/health',
    s2s: 'http://rpe-service-auth-provider-ithc.service.core-compute-ithc.internal/health',
    rdProfessionalApi: 'http://rd-professional-api-ithc.service.core-compute-ithc.internal/health',
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
