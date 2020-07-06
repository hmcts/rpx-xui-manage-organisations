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
  FEATURE_SECURE_COOKIE_ENABLED,
  HELMET,
  SESSION_SECRET,
} from './configuration/references'
import {addReformHealthCheck} from './health'
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
    resave: false,
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

addReformHealthCheck(app)

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
app.get('/api/logout', async (req, res) => {
  await auth.doLogout(req, res)
})
