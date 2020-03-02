/**
 * Common to both server.ts and local.ts files
 */
import * as bodyParser from 'body-parser'
import * as cookieParser from 'cookie-parser'
import * as express from 'express'
import * as session from 'express-session'
import * as log4js from 'log4js'
import * as sessionFileStore from 'session-file-store'
import * as auth from './auth'
import {environmentCheckText, getConfigValue, getEnvironment, initialiseSecrets} from './configuration'
import {ERROR_NODE_CONFIG_ENV} from './configuration/constants'
import {
  APP_INSIGHTS_KEY, APP_INSIGHTS_SECRET,
  COOKIE_TOKEN,
  COOKIES_USERID,
  IDAM_CLIENT, IDAM_SECRET,
  JURISDICTIONS,
  LOGGING,
  MAX_LINES, NOW,
  PROXY_HOST, S2S_SECRET,
  SECURE_COOKIE,
  SERVICES_IDAM_API_PATH,
  SESSION_SECRET,
} from './configuration/references'
import {appInsights} from './lib/appInsights'
import {errorStack} from './lib/errorStack'
import openRoutes from './openRoutes'
import routes from './routes'

/**
 * Only used Locally
 */
import * as tunnel from './lib/tunnel'

const FileStore = sessionFileStore(session)

const app = express()

/**
 * Allows us to integrate the Azure key-vault flex volume, so that we are able to access Node configuration values.
 */
initialiseSecrets()

/**
 * If there are no configuration properties found we highlight this to the person attempting to initialise
 * this application.
 */
if (!getEnvironment()) {
  console.log(ERROR_NODE_CONFIG_ENV)
}

/**
 * TODO: Implement a logger on the Node layer.
 */
console.log(environmentCheckText())

// TODO: Testing that we can get the environment variables on AAT from the .yaml file
console.log('COOKIE_TOKEN')
console.log(process.env.NODE_CONFIG_ENV)
console.log(getConfigValue(COOKIE_TOKEN))
console.log(getConfigValue(COOKIES_USERID))
console.log(getConfigValue(MAX_LINES))
console.log(getConfigValue(SERVICES_IDAM_API_PATH))
console.log(getConfigValue(SESSION_SECRET))
console.log(getConfigValue(IDAM_CLIENT))
console.log(getConfigValue(JURISDICTIONS))

console.log('process.env.ALLOW_CONFIG_MUTATIONS')
console.log(process.env.ALLOW_CONFIG_MUTATIONS)
console.log('S2S_SECRET')
console.log(getConfigValue(S2S_SECRET))
console.log('IDAM_SECRET')
console.log(getConfigValue(IDAM_SECRET))
console.log('APP_INSIGHTS_SECRET')
console.log(getConfigValue(APP_INSIGHTS_SECRET))

app.use(
  session({
    cookie: {
      httpOnly: true,
      maxAge: 1800000,
      secure: getConfigValue(SECURE_COOKIE) !== false,
    },
    name: 'jui-webapp',
    resave: true,
    saveUninitialized: true,
    secret: getConfigValue(SESSION_SECRET),
    store: new FileStore({
      path: getConfigValue(NOW) ? '/tmp/sessions' : '.sessions',
    }),
  })
)

/**
 * Used Client side
 */

tunnel.init()

/**
 * Common to both server.ts and local.ts files
 */
app.use(errorStack)
app.use(appInsights)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())

/**
 * Open Routes
 *
 * Any routes here do not have authentication attached and are therefore reachable.
 */
app.get('/oauth2/callback', auth.oauth)
app.get('/external/ping', (req, res) => {
  console.log('Pong')
  res.send('Pong')
})
app.use('/external', openRoutes)
app.get('/health', (req, res) => {
  console.log('Health endpoint hit')
  res.send('Healthy')
})

console.log('WE ARE USING local.ts on the box.')
/**
 * We are attaching authentication to all subsequent routes.
 */
// app.use(auth.attach) // its called in routes.ts - no need to call it here

/**
 * Secure Routes
 *
 * Used both local.ts and server.ts
 */
app.use('/api', routes)
app.get('/api/logout', (req, res, next) => {
  auth.doLogout(req, res)
})

const port = process.env.PORT || 3001
app.listen(port)

// TODO: Slightly confusing, need to ask why we're not setting a value on config through an interface. ie. config.setAppInsightKey()
// program to an interface over implementation
// TODO: Add back in once refactored
// if (getConfigValue(APP_INSIGHTS_KEY)) {
//   config.appInsightsInstrumentationKey = getConfigValue(APP_INSIGHTS_KEY)
// }

const logger = log4js.getLogger('server')
logger.level = getConfigValue(LOGGING) ? getConfigValue(LOGGING) : 'OFF'

logger.info(`Local server up at ${port}`)
