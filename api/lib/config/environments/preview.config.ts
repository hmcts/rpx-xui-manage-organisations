export default {
  services: {
    ccdDataApi: 'https://ccd-data-store-api-aat.service.core-compute-aat.internal',
    ccdDefApi: 'https://ccd-definition-store-api-aat.service.core-compute-aat.internal',
    idamWeb: 'https://idam-web-public-idam-aat.service.core-compute-idam-aat.internal',
    idamApi: 'https://idam-api-idam-aat.service.core-compute-idam-aat.internal',
    s2s: 'http://rpe-service-auth-provider-aat.service.core-compute-aat.internal',
    rdProfessionalApi: 'https://rd-professional-api-aat.service.core-compute-aat.internal',
  },
  health: {
    ccdDataApi: 'https://ccd-data-store-api-aat.service.core-compute-aat.internal/health',
    ccdDefApi: 'https://ccd-definition-store-api-aat.service.core-compute-aat.internal/health',
    idamWeb: 'https://idam-web-public-idam-aat.service.core-compute-idam-aat.internal/health',
    idamApi: 'https://idam-api-idam-aat.service.core-compute-idam-aat.internal/health',
    s2s: 'http://rpe-service-auth-provider-aat.service.core-compute-aat.internal/health',
    rdProfessionalApi: 'https://rd-professional-api-aat.service.core-compute-aat.internal/health',
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
