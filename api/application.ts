import * as healthcheck from '@hmcts/nodejs-healthcheck'
import {SESSION, xuiNode} from '@hmcts/rpx-xui-node-lib'
import * as bodyParser from 'body-parser'
import * as cookieParser from 'cookie-parser'
import * as csrf from 'csurf'
import * as express from 'express'
import * as session from 'express-session'
import * as helmet from 'helmet'
import {attach, getXuiNodeMiddleware} from './auth'
import {environmentCheckText, getConfigValue, getEnvironment, showFeature} from './configuration'
import {ERROR_NODE_CONFIG_ENV} from './configuration/constants'
import {
  CASE_TYPES,
  FEATURE_HELMET_ENABLED,
  FEATURE_REDIS_ENABLED,
  FEATURE_TERMS_AND_CONDITIONS_ENABLED,
  HELMET,
  SERVICE_S2S_PATH,
  SERVICES_CCD_DATA_STORE_API_PATH,
  SERVICES_FEE_AND_PAY_API_PATH,
  SERVICES_MCA_PROXY_API_PATH,
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
  app.use(helmet.noSniff())
  app.use(helmet.frameguard({ action: 'deny' }))
  app.use(helmet.referrerPolicy({ policy: ['origin'] }))
  app.use(helmet.hidePoweredBy())
  app.use(helmet.hsts({ maxAge: 28800000 }))
  app.use(helmet.xssFilter())
  app.use((req, res, next) => {
    res.setHeader('X-Robots-Tag', 'noindex')
    res.setHeader('Cache-Control', 'no-cache, no-store, max-age=0, must-revalidate, proxy-revalidate')
    next()
  })
  app.get('/robots.txt', (req, res) => {
    res.type('text/plain')
    res.send('User-agent: *\nDisallow: /')
  })
  app.get('/sitemap.xml', (req, res) => {
    res.type('text/xml')
    res.send('User-agent: *\nDisallow: /')
  })
  app.disable('x-powered-by')
  app.disable('X-Powered-By')
  app.use(session({  
    secret: getConfigValue(SESSION_SECRET),
    cookie: {
      httpOnly: true,
      maxAge: 28800000,
      sameSite: 'strict',
      secure: true,
    }
  }))
  // app.use(helmet.contentSecurityPolicy({
  //   directives: {
  //     connectSrc: [
  //       '\'self\'',
  //       '*.gov.uk',
  //       'dc.services.visualstudio.com',
  //       '*.launchdarkly.com',
  //       'www.google-analytics.com',
  //     ],
  //     defaultSrc: [`'self'`],
  //     fontSrc: ['\'self\'', 'https://fonts.gstatic.com', 'data:'],
  //     formAction: [`'none'`],
  //     frameAncestors: [`'self'`],
  //     frameSrc: [`'self'`],
  //     imgSrc: [
  //       '\'self\'',
  //       'data:',
  //       'https://www.google-analytics.com',
  //       'https://www.googletagmanager.com',
  //       'https://raw.githubusercontent.com/hmcts/',
  //       'http://stats.g.doubleclick.net/',
  //       'http://ssl.gstatic.com/',
  //       'http://www.gstatic.com/',
  //       'https://fonts.gstatic.com',
  //     ],
  //     mediaSrc: ['\'self\''],
  //     scriptSrc: [
  //       '\'self\'',
  //       '\'unsafe-inline\'',
  //       '\'unsafe-eval\'',
  //       'www.google-analytics.com',
  //       'www.googletagmanager.com',
  //       'az416426.vo.msecnd.net',
  //     ],
  //     styleSrc: [
  //       '\'self\'',
  //       '\'unsafe-inline\'',
  //       'https://fonts.googleapis.com',
  //       'https://fonts.gstatic.com',
  //       'http://tagmanager.google.com/',
  //     ],
  //   },
  // }))
}

app.use(appInsights)
app.use(bodyParser.json({limit: '5mb'}))
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}))
app.use(cookieParser(getConfigValue(SESSION_SECRET)))
app.use(csrf({ cookie: { key: 'XSRF-TOKEN', httpOnly: true, secure: true, sameSite: 'strict' } }))
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

console.log('ccdData', getConfigValue(SERVICES_CCD_DATA_STORE_API_PATH))

console.log('caseAssignmentApi', getConfigValue(SERVICES_MCA_PROXY_API_PATH))

console.log('caseTypes', getConfigValue(CASE_TYPES))

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
