export default {

  services: {
    ccdDataApi: 'http://ccd-data-store-api-ithc.service.core-compute-ithc.internal',
    ccdDefApi: 'http://ccd-definition-store-api-ithc.service.core-compute-ithc.internal',
    idamWeb: 'https://idam-web-public-aks.ithc.platform.hmcts.net',
    idamApi: 'http://idam-api-ithc.service.core-compute-ithc.internal',
    s2s: 'http://rpe-service-auth-provider-ithc.service.core-compute-ithc.internal',
    rdProfessionalApi: 'http://rd-professional-api-ithc.service.core-compute-ithc.internal',
    feeAndPayApi: 'http://payment-api-ithc.service.core-compute-ithc.internal',
  },
  health: {
    ccdDataApi: 'http://ccd-data-store-api-ithc.service.core-compute-ithc.internal/health',
    ccdDefApi: 'http://ccd-definition-store-api-ithc.service.core-compute-ithc.internal/health',
    idamWeb: 'https://idam-web-public-aks.ithc.platform.hmcts.net/health',
    idamApi: 'http://idam-api-ithc.service.core-compute-ithc.internal/health',
    s2s: 'http://rpe-service-auth-provider-ithc.service.core-compute-ithc.internal/health',
    rdProfessionalApi: 'http://rd-professional-api-ithc.service.core-compute-ithc.internal/health',
    feeAndPayApi: 'http://payment-api-ithc.service.core-compute-ithc.internal',
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
