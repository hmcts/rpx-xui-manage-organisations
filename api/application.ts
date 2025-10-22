import * as healthcheck from '@hmcts/nodejs-healthcheck';
import { getContentSecurityPolicy, SESSION, xuiNode } from '@hmcts/rpx-xui-node-lib';
import * as bodyParserModule from 'body-parser';
import * as cookieParserModule from 'cookie-parser';
import * as expressModule from 'express';
import * as helmetModule from 'helmet';

// Handle both CommonJS and ES module exports
const express = (expressModule as any).default || expressModule;
const helmet = (helmetModule as any).default || helmetModule;
const bodyParser = (bodyParserModule as any).default || bodyParserModule;
const cookieParser = (cookieParserModule as any).default || cookieParserModule;
import { attach, getXuiNodeMiddleware } from './auth';
import { environmentCheckText, getConfigValue, getEnvironment, showFeature } from './configuration';
import { ERROR_NODE_CONFIG_ENV } from './configuration/constants';
import {
  CASE_TYPES,
  FEATURE_HELMET_ENABLED,
  FEATURE_REDIS_ENABLED,
  FEATURE_TERMS_AND_CONDITIONS_ENABLED,
  HELMET, SERVICES_CCD_DATA_STORE_API_PATH,
  SERVICES_FEE_AND_PAY_API_PATH,
  SERVICES_MCA_PROXY_API_PATH,
  SERVICES_RD_PROFESSIONAL_API_PATH,
  SERVICES_TERMS_AND_CONDITIONS_API_PATH, SESSION_SECRET
} from './configuration/references';
import * as log4jui from './lib/log4jui';
import * as tunnel from './lib/tunnel';
import openRoutes from './openRoutes';
import routes from './routes';
import { idamCheck } from './idamCheck';
import { MO_CSP } from './interfaces/csp-config';

function loadIndexHtml(): string {
  // production build output
  let p = path.join(__dirname, '..', 'index.html');
  if (!existsSync(p)) {
    // running from sources - use the template inside src/
    p = path.join(__dirname, '..', 'src', 'index.html');
  }
  return readFileSync(p, 'utf8');
}
const indexHtmlRaw = loadIndexHtml();

function injectNonce(html: string, nonce: string): string {
  return html.replace(/{{cspNonce}}/g, nonce);
}

export const app = express();

export const logger = log4jui.getLogger('server');

/**
 * If there are no configuration properties found we highlight this to the person attempting to initialise
 * this application.
 */
if (!getEnvironment()) {
  logger.info(ERROR_NODE_CONFIG_ENV);
}

/**
 * TODO: Implement a logger on the Node layer.
 */
logger.info(environmentCheckText());

if (showFeature(FEATURE_HELMET_ENABLED)) {
  logger.info('Helmet enabled');
  const helmetConfig = getConfigValue(HELMET);
  if (helmetConfig && typeof helmetConfig === 'object') {
    app.use(helmet(helmetConfig)); // use the configured rules
  } else {
    app.use(helmet()); // fall back to Helmet defaults
  }
  app.use(
    csp({
      defaultCsp: SECURITY_POLICY,
      ...MO_CSP
    })
  );
  app.use(helmet.hidePoweredBy());
  app.disable('x-powered-by');
  app.disable('X-Powered-By');
}

app.use(cookieParser(getConfigValue(SESSION_SECRET)));

tunnel.init();
app.use(getXuiNodeMiddleware());

app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));

function healthcheckConfig(msUrl) {
  return healthcheck.web(`${msUrl}/health`, {
    timeout: 6000,
    deadline: 6000
  });
}

const healthChecks = {
  checks: {
    feeAndPayApi: healthcheckConfig(getConfigValue(SERVICES_FEE_AND_PAY_API_PATH)),
    rdProfessionalApi: healthcheckConfig(getConfigValue(SERVICES_RD_PROFESSIONAL_API_PATH))
  }
};

if (showFeature(FEATURE_TERMS_AND_CONDITIONS_ENABLED)) {
  healthChecks.checks = {
    ...healthChecks.checks,
    ...{
      termsAndConditions: healthcheckConfig(getConfigValue(SERVICES_TERMS_AND_CONDITIONS_API_PATH))
    }
  };
}

if (showFeature(FEATURE_REDIS_ENABLED)) {
  xuiNode.on(SESSION.EVENT.REDIS_CLIENT_READY, (redisClient: any) => {
    console.log('REDIS EVENT FIRED!!');
    app.locals.redisClient = redisClient;
    healthChecks.checks = {
      ...healthChecks.checks,
      ...{
        redis: healthcheck.raw(() => {
          return app.locals.redisClient.connected ? healthcheck.up() : healthcheck.down();
        })
      }
    };
  });
  xuiNode.on(SESSION.EVENT.REDIS_CLIENT_ERROR, (error: any) => {
    logger.error('redis Client error is', error);
  });
}

console.log('healthChecks', healthChecks);

console.log('ccdData', getConfigValue(SERVICES_CCD_DATA_STORE_API_PATH));

console.log('caseAssignmentApi', getConfigValue(SERVICES_MCA_PROXY_API_PATH));

console.log('caseTypes', getConfigValue(CASE_TYPES));

healthcheck.addTo(app, healthChecks);

app.use(attach);

/**
 * Open Routes
 *
 * Any routes here do not have authentication attached and are therefore reachable.
 */
app.use('/external', openRoutes);

/**
 * Secure Routes
 *
 */
app.use('/api', routes);

// Serve /index.html through the same nonce injector
// This is to ensure that <MC URL>/index.html works with CSP
app.get('/index.html', (req, res) => {
  const html = injectNonce(indexHtmlRaw, res.locals.cspNonce as string);
  res
    .type('html')
    .set('Cache-Control', 'no-store, max-age=0')
    .send(html);
});
const staticRoot = path.join(__dirname, '..');
// runs for every incoming request in the order middleware are declared
app.use(
  express.static(staticRoot, { index: false })
);
// Catch-all handler for every URL that the static middleware didn’t serve
app.use('/*', (req, res) => {
  const html = injectNonce(indexHtmlRaw, res.locals.cspNonce as string);
  res.type('html').set('Cache-Control', 'no-store, max-age=0').send(html);
});

new Promise(idamCheck).then(() => 'IDAM is up and running');
