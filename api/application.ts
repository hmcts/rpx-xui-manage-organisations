import * as healthcheck from '@hmcts/nodejs-healthcheck'
import * as bodyParser from 'body-parser'
import * as cookieParser from 'cookie-parser'
import * as express from 'express'
import * as session from 'express-session'
import * as helmet from 'helmet'
import * as auth from './auth'
import {environmentCheckText, getConfigValue, getEnvironment, showFeature} from './configuration'
import {ERROR_NODE_CONFIG_ENV} from './configuration/constants'
import {
  FEATURE_HELMET_ENABLED,
  FEATURE_REDIS_ENABLED,
  FEATURE_SECURE_COOKIE_ENABLED,
  HELMET,
  SERVICE_S2S_PATH,
  SERVICES_FEE_AND_PAY_API_PATH,
  SERVICES_IDAM_API_PATH,
  SERVICES_IDAM_WEB,
  SERVICES_RD_PROFESSIONAL_API_PATH,
  SERVICES_TERMS_AND_CONDITIONS_API_PATH,
  SESSION_SECRET,
} from './configuration/references'
import {appInsights} from './lib/appInsights'
import {errorStack} from './lib/errorStack'
import * as log4jui from './lib/log4jui'
import {getStore} from './lib/sessionStore'
import * as tunnel from './lib/tunnel'
import openRoutes from './openRoutes'
import routes from './routes'

export const app = express()

export const logger = log4jui.getLogger('server')

/**
 * If there are no configuration properties found we highlight this to the person attempting to initialise
 * this application.
 */
if (!getEnvironment()) {
  logger.info(ERROR_NODE_CONFIG_ENV)
}

/**
 * TODO: Implement a logger on the Node layer.
 */
logger.info(environmentCheckText())

if (showFeature(FEATURE_HELMET_ENABLED)) {
  logger.info('Helmet enabled')
  app.use(helmet(getConfigValue(HELMET)))
}

app.use(
  session({
    cookie: {
      httpOnly: true,
      maxAge: 28800000,
      secure: showFeature(FEATURE_SECURE_COOKIE_ENABLED),
    },
    name: 'jui-webapp',
    resave: true,
    saveUninitialized: true,
    secret: getConfigValue(SESSION_SECRET),
    store: getStore(),
  })
)

app.use(errorStack)
app.use(appInsights)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())

tunnel.init()

function healthcheckConfig(msUrl) {
  return healthcheck.web(`${msUrl}/health`, {
    timeout: 6000,
    deadline: 6000
  });
}

const healthChecks = {
  checks: {
    idamApi: healthcheckConfig(getConfigValue(SERVICES_IDAM_API_PATH)),
    idamWeb: healthcheckConfig(getConfigValue(SERVICES_IDAM_WEB)),
    rdProfessionalApi: healthcheckConfig(getConfigValue(SERVICES_RD_PROFESSIONAL_API_PATH)),
    s2s: healthcheckConfig(getConfigValue(SERVICE_S2S_PATH)),
    feeAndPayApi: healthcheckConfig(getConfigValue(SERVICES_FEE_AND_PAY_API_PATH)),
    termsAndConditions: healthcheckConfig(getConfigValue(SERVICES_TERMS_AND_CONDITIONS_API_PATH))
  }
}

if (showFeature(FEATURE_REDIS_ENABLED)) {
  healthChecks.checks = {...healthChecks.checks, ...{
    redis: healthcheck.raw(() => {
      return app.locals.redisClient.connected ? healthcheck.up() : healthcheck.down()
    })
  }}
}

healthcheck.addTo(app, healthChecks);

/**
 * Open Routes
 *
 * Any routes here do not have authentication attached and are therefore reachable.
 */
app.get('/oauth2/callback', auth.oauth)
app.use('/external', openRoutes)

/**
 * We are attaching authentication to all subsequent routes.
 */
// app.use(auth.attach) // its called in routes.ts - no need to call it here

/**
 * Secure Routes
 *
 */
app.use('/api', routes)
app.get('/api/logout', (req, res) => {
  auth.doLogout(req, res)
})
