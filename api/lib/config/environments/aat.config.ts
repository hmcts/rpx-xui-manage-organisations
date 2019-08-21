export default {
    services: {
        ccdDataApi: 'https://ccd-data-store-api-aat.service.core-compute-aat.internal',
        ccdDefApi: 'https://ccd-definition-store-api-aat.service.core-compute-aat.internal',
        idamWeb: 'https://idam-web-public.aat.platform.hmcts.net',
        idamApi: 'https://idam-api.aat.platform.hmcts.net',
        s2s: 'http://rpe-service-auth-provider-demo.service.core-compute-demo.internal',
        rdProfessionalApi: 'https://rd-professional-api-aat.service.core-compute-aat.internal',
    },
    health: {
        ccdDataApi: 'https://ccd-data-store-api-aat.service.core-compute-aat.internal/health',
        ccdDefApi: 'https://ccd-definition-store-api-aat.service.core-compute-aat.internal/health',
        idamWeb: 'https://idam-web-public.aat.platform.hmcts.net/health',
        idamApi: 'https://idam-api.aat.platform.hmcts.net/health',
        s2s: 'http://rpe-service-auth-provider-demo.service.core-compute-demo.internal/health',
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
