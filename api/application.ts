import * as healthcheck from '@hmcts/nodejs-healthcheck'
import {SESSION, xuiNode} from '@hmcts/rpx-xui-node-lib'
import * as bodyParser from 'body-parser'
import * as cookieParser from 'cookie-parser'
import * as express from 'express'
import * as helmet from 'helmet'
import {attach, getXuiNodeMiddleware} from './auth'
import {environmentCheckText, getConfigValue, getEnvironment, showFeature} from './configuration'
import {ERROR_NODE_CONFIG_ENV} from './configuration/constants'
import {
  FEATURE_HELMET_ENABLED,
  FEATURE_REDIS_ENABLED,
  FEATURE_TERMS_AND_CONDITIONS_ENABLED,
  HELMET,
  SERVICE_S2S_PATH,
  SERVICES_FEE_AND_PAY_API_PATH,
  SERVICES_IDAM_API_PATH,
  SERVICES_IDAM_WEB,
  SERVICES_RD_PROFESSIONAL_API_PATH,
  SERVICES_TERMS_AND_CONDITIONS_API_PATH, SESSION_SECRET,
} from './configuration/references'
import {appInsights} from './lib/appInsights'
import * as log4jui from './lib/log4jui'
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

app.use(appInsights)
app.use(bodyParser.json({limit: '5mb'}))
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}))
app.use(cookieParser(getConfigValue(SESSION_SECRET)))

app.use(getXuiNodeMiddleware())
tunnel.init()

function healthcheckConfig(msUrl) {
  return healthcheck.web(`${msUrl}/health`, {
    timeout: 6000,
    deadline: 6000
  });
}

const healthChecks = {
  checks: {
    feeAndPayApi: healthcheckConfig(getConfigValue(SERVICES_FEE_AND_PAY_API_PATH)),
    rdProfessionalApi: healthcheckConfig(getConfigValue(SERVICES_RD_PROFESSIONAL_API_PATH)),
  },
}

if (showFeature(FEATURE_TERMS_AND_CONDITIONS_ENABLED)) {
  healthChecks.checks = {...healthChecks.checks, ...{
    termsAndConditions: healthcheckConfig(getConfigValue(SERVICES_TERMS_AND_CONDITIONS_API_PATH))
  }}
}

if (showFeature(FEATURE_REDIS_ENABLED)) {
  xuiNode.on(SESSION.EVENT.REDIS_CLIENT_READY, (redisClient: any) => {
    console.log('REDIS EVENT FIRED!!')
    app.locals.redisClient = redisClient
    healthChecks.checks = {
      ...healthChecks.checks, ...{
        redis: healthcheck.raw(() => {
          return app.locals.redisClient.connected ? healthcheck.up() : healthcheck.down()
        }),
      },
    }
  })
  xuiNode.on(SESSION.EVENT.REDIS_CLIENT_ERROR, (error: any) => {
    logger.error('redis Client error is', error)
  })
}


console.log('healthChecks', healthChecks)

healthcheck.addTo(app, healthChecks)

app.use(attach)

/**
 * Open Routes
 *
 * Any routes here do not have authentication attached and are therefore reachable.
 */
app.use('/external', openRoutes)

/**
 * Secure Routes
 *
 */
app.use('/api', routes)
