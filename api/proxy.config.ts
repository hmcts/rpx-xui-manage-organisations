import * as bodyParser from 'body-parser';
import { Express } from 'express';
import { getConfigValue } from './configuration';
import {
  SERVICES_CCD_COMPONENT_API_PATH,
  SERVICES_CCD_DATA_STORE_API_PATH
} from './configuration/references';
import { applyProxy } from './lib/middleware/proxy';

export const initProxy = (app: Express) => {
  applyProxy(app, {
    rewrite: true,
    rewriteUrl: '/activity',
    source: [
      '/activity'
    ],
    target: getConfigValue(SERVICES_CCD_COMPONENT_API_PATH)
  });

  applyProxy(app, {
    rewrite: true,
    rewriteUrl: '/addresses',
    source: '/api/addresses',
    target: getConfigValue(SERVICES_CCD_COMPONENT_API_PATH)
  });

  applyProxy(app, {
    rewrite: false,
    source: '/categoriesAndDocuments',
    target: getConfigValue(SERVICES_CCD_DATA_STORE_API_PATH)
  });

  applyProxy(app, {
    rewrite: false,
    source: '/documentData/caseref',
    target: getConfigValue(SERVICES_CCD_DATA_STORE_API_PATH)
  });

  applyProxy(app, {
    rewrite: false,
    source: '/getLinkedCases',
    target: getConfigValue(SERVICES_CCD_DATA_STORE_API_PATH)
  });
};
