/**
 * Common to both server.ts and local.ts files
 */
import * as bodyParser from 'body-parser'
import * as cookieParser from 'cookie-parser'
import * as express from 'express'
import * as session from 'express-session'
import * as sessionFileStore from 'session-file-store'
import * as auth from './auth'
import {environmentCheckText, getConfigValue, getEnvironment, initialiseSecrets, showFeature} from './configuration'
import {ERROR_NODE_CONFIG_ENV} from './configuration/constants'
import {
  APP_INSIGHTS_KEY,
  COOKIE_TOKEN,
  COOKIES_USERID,
  FEATURE_APP_INSIGHTS_ENABLED,
  FEATURE_SECURE_COOKIE_ENABLED,
  IDAM_CLIENT,
  IDAM_SECRET,
  MAX_LINES,
  NOW,
  S2S_SECRET,
  SERVICES_IDAM_API_PATH,
  SESSION_SECRET
} from './configuration/references'
import { appInsights } from './lib/appInsights'
import { errorStack } from './lib/errorStack'
import openRoutes from './openRoutes'
import routes from './routes'

/**
 * Used Server side
 */
import * as ejs from 'ejs'
import * as path from 'path'
import * as tunnel from './lib/tunnel'
import serviceRouter from './services/serviceAuth'

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
console.log('NODE_CONFIG_ENV')
console.log(process.env.NODE_CONFIG_ENV)
console.log(getConfigValue(COOKIE_TOKEN))
console.log(getConfigValue(COOKIES_USERID))
console.log(getConfigValue(MAX_LINES))
console.log(getConfigValue(SERVICES_IDAM_API_PATH))
console.log(getConfigValue(SESSION_SECRET))
console.log(getConfigValue(IDAM_CLIENT))

console.log('Secure Cookie is:')
console.log(showFeature(FEATURE_SECURE_COOKIE_ENABLED))
console.log(showFeature(FEATURE_APP_INSIGHTS_ENABLED))

console.log('process.env.ALLOW_CONFIG_MUTATIONS')
console.log(process.env.ALLOW_CONFIG_MUTATIONS)
console.log('S2S_SECRET')
console.log(getConfigValue(S2S_SECRET))
console.log('IDAM_SECRET')
console.log(getConfigValue(IDAM_SECRET))
console.log('APP_INSIGHTS_KEY')
console.log(getConfigValue(APP_INSIGHTS_KEY))

app.use(
    session({
        cookie: {
            httpOnly: true,
            maxAge: 1800000,
            secure: showFeature(FEATURE_SECURE_COOKIE_ENABLED),
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
 * Used Server side
 */
app.engine('html', ejs.renderFile)
app.set('view engine', 'html')
app.set('views', __dirname)

app.use(express.static(path.join(__dirname, '..', 'assets'), { index: false }))
app.use(express.static(path.join(__dirname, '..'), { index: false }))

/**
 * Common to both server.ts and local.ts files
 */
app.use(errorStack)
app.use(appInsights)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

/**
 * Used Server Side only
 *
 * TODO: Are we are attaching authentication to all subsequent routes?
 * no probably not with this file, but then what is this doing here, and why don't we
 * do auth.attach?
 */
app.use(serviceRouter)

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

console.log('WE ARE USING server.ts on the box.')

/**
 * Secure Routes
 *
 * Used both local.ts and server.ts
 */
app.use('/api', routes)
app.get('/api/logout', (req, res, next) => {
    auth.doLogout(req, res)
})

/**
 * Used on server.ts only but should be fine to lift and shift to local.ts
 */
app.use('/*', (req, res) => {
    console.time(`GET: ${req.originalUrl}`)
    res.render('../index', {
        providers: [{ provide: 'REQUEST', useValue: req }, { provide: 'RESPONSE', useValue: res }],
        req,
        res,
    })
    console.timeEnd(`GET: ${req.originalUrl}`)
})

app.listen(process.env.PORT || 3000)
