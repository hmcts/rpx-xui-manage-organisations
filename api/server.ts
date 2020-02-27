/**
 * Common to both server.ts and local.ts files
 */
import * as propertiesVolume from '@hmcts/properties-volume'
import * as bodyParser from 'body-parser'
import * as config from 'config'
import * as cookieParser from 'cookie-parser'
import * as express from 'express'
import * as session from 'express-session'
import * as sessionFileStore from 'session-file-store'
import * as auth from './auth'
import {environmentCheckText, getConfigValue, getEnvironment, getIDamSecret, getS2sSecret} from './configuration'
import {ERROR_NODE_CONFIG_ENV} from './configuration/constants'
import {
  APP_INSIGHTS_KEY,
  COOKIE_TOKEN,
  COOKIES_USERID,
  IDAM_CLIENT,
  MAX_LINES,
  NOW,
  SECURE_COOKIE,
  SERVICES_IDAM_API_PATH,
  SESSION_SECRET
} from './configuration/references'
import { appInsights } from './lib/appInsights'
// import { config } from './lib/config'
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

const mountedSecrets = propertiesVolume.addTo({})

/**
 * Allows us to integrate the Azure key-vault flex volume, so that we are able to access Node configuration values.
 */
propertiesVolume.addTo(config)

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
console.log('s2sSecret', getS2sSecret(mountedSecrets))
console.log('idamsecret', getIDamSecret(mountedSecrets))

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

// TODO: Slightly confusing, need to ask why we're not setting a value on config through an interface. ie. config.setAppInsightKey()
// program to an interface over implementation
// TODO: Add back in once refactored
// if (getConfigValue(APP_INSIGHTS_KEY)) {
//     config.appInsightsInstrumentationKey = getConfigValue(APP_INSIGHTS_KEY)
// }

app.listen(process.env.PORT || 3000)
