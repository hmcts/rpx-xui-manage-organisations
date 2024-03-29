export default {
  services: {
    ccdDataApi: 'http://ccd-data-store-api-prod.service.core-compute-prod.internal',
    ccdDefApi: 'http://ccd-definition-store-api-prod.service.core-compute-prod.internal',
    idamWeb: 'https://hmcts-access.service.gov.uk',
    idamApi: 'https://idam-api.platform.hmcts.net',
    s2s: 'http://rpe-service-auth-provider-prod.service.core-compute-prod.internal',
    rdProfessionalApi: 'http://rd-professional-api-prod.service.core-compute-prod.internal',
    prd: {
      commondataApi: 'http://rd-commondata-api-prod.service.core-compute-prod.internal'
    }
  },
  health: {
    ccdDataApi: 'http://ccd-data-store-api-prod.service.core-compute-prod.internal/health',
    ccdDefApi: 'http://ccd-definition-store-api-prod.service.core-compute-prod.internal/health',
    idamWeb: 'https://hmcts-access.service.gov.uk/health',
    idamApi: 'https://idam-api.platform.hmcts.net/health',
    s2s: 'http://rpe-service-auth-provider-prod.service.core-compute-prod.internal/health',
    rdProfessionalApi: 'http://rd-professional-api-prod.service.core-compute-prod.internal/health',
    prd: {
      commondataApi: 'http://rd-commondata-api-prod.service.core-compute-prod.internal'
    }
  },
  useProxy: false,
  secureCookie: true,
  sessionSecret: 'secretSauce',
  logging: 'debug',
  jurisdictions: [
    { id: 'SSCS' },
    { id: 'AUTOTEST1' },
    { id: 'DIVORCE' },
    { id: 'PROBATE' },
    { id: 'PUBLICLAW' },
    { id: 'bulkscan' },
    { id: 'BULKSCAN' },
    { id: 'IA' },
    { id: 'EMPLOYMENT' },
    { id: 'CMC' }
  ]
};
