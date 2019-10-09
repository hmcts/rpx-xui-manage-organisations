export default {
  services: {
      ccdDataApi: 'http://ccd-data-store-api-perftest.service.core-compute-perftest.internal',
      ccdDefApi: 'http://ccd-definition-store-api-perftest.service.core-compute-perftest.internal',
      idamWeb: 'https://idam-web-public.perftest.platform.hmcts.net',
      idamApi: 'https://idam-api.perftest.platform.hmcts.net',
      s2s: 'http://rpe-service-auth-provider-perftest.service.core-compute-perftest.internal',
      rdProfessionalApi: 'http://rd-professional-api-perftest.service.core-compute-perftest.internal',
  },
  health: {
      ccdDataApi: 'http://ccd-data-store-api-perftest.service.core-compute-perftest.internal/health',
      ccdDefApi: 'http://ccd-definition-store-api-perftest.service.core-compute-perftest.internal/health',
      idamWeb: 'https://idam-web-public.perftest.platform.hmcts.net/health',
      idamApi: 'https://idam-api.perftest.platform.hmcts.net/health',
      s2s: 'http://rpe-service-auth-provider-perftest.service.core-compute-perftest.internal/health',
      rdProfessionalApi: 'http://rd-professional-api-perftest.service.core-compute-perftest.internal/health',
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
