import * as bodyParser from 'body-parser'
import * as cookieParser from 'cookie-parser'
import * as express from 'express'
import * as session from 'express-session'
import * as helmet from 'helmet'
import * as log4jui from './lib/log4jui'
import * as auth from './auth'
import {environmentCheckText, getConfigValue, getEnvironment, showFeature} from './configuration'
import {ERROR_NODE_CONFIG_ENV} from './configuration/constants'
import {
  APP_INSIGHTS_KEY,
  COOKIE_TOKEN,
  COOKIES_USERID,
  FEATURE_APP_INSIGHTS_ENABLED,
  FEATURE_HELMET_ENABLED,
  FEATURE_PROXY_ENABLED,
  FEATURE_SECURE_COOKIE_ENABLED,
  FEATURE_TERMS_AND_CONDITIONS_ENABLED,
  HELMET,
  IDAM_CLIENT,
  IDAM_SECRET,
  JURISDICTIONS,
  LOGGING,
  MAX_LINES,
  MAX_LOG_LINE,
  MICROSERVICE,
  NOW,
  OAUTH_CALLBACK_URL,
  PROTOCOL,
  S2S_SECRET,
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
import {getStore} from './lib/sessionStore'
import * as tunnel from './lib/tunnel'
import openRoutes from './openRoutes'
import routes from './routes'
import serviceRouter from './services/serviceAuth'

export const app = express()

export const logger = log4jui.getLogger('server')

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
console.log('ENV PRINT')
console.log(process.env.NODE_CONFIG_ENV)
console.log('process.env.ALLOW_CONFIG_MUTATIONS')
console.log(process.env.ALLOW_CONFIG_MUTATIONS)

// 1st set
console.log(getConfigValue(IDAM_CLIENT))
console.log(getConfigValue(MAX_LOG_LINE))
console.log(getConfigValue(MICROSERVICE))
console.log(getConfigValue(MAX_LINES))
console.log(getConfigValue(NOW))

// 2nd set
console.log(getConfigValue(COOKIE_TOKEN))
console.log(getConfigValue(COOKIES_USERID))

console.log(getConfigValue(OAUTH_CALLBACK_URL))
console.log(getConfigValue(PROTOCOL))

// 3rd set
console.log(getConfigValue(SERVICES_IDAM_API_PATH))
console.log(getConfigValue(SERVICES_IDAM_WEB))
console.log(getConfigValue(SERVICE_S2S_PATH))
console.log(getConfigValue(SERVICES_RD_PROFESSIONAL_API_PATH))
console.log(getConfigValue(SERVICES_FEE_AND_PAY_API_PATH))
console.log(getConfigValue(SERVICES_TERMS_AND_CONDITIONS_API_PATH))

// 4th set
console.log(getConfigValue(SESSION_SECRET))
console.log(getConfigValue(JURISDICTIONS))

console.log('S2S_SECRET:')
console.log(getConfigValue(S2S_SECRET))
console.log('IDAM_SECRET:')
console.log(getConfigValue(IDAM_SECRET))
console.log('APP_INSIGHTS_KEY:')
console.log(getConfigValue(APP_INSIGHTS_KEY))

console.log('Secure Cookie is:')
console.log(showFeature(FEATURE_SECURE_COOKIE_ENABLED))
console.log('App Insights enabled:')
console.log(showFeature(FEATURE_APP_INSIGHTS_ENABLED))
console.log('Proxy enabled:')
console.log(showFeature(FEATURE_PROXY_ENABLED))
console.log('Terms and Conditions enabled:')
console.log(showFeature(FEATURE_TERMS_AND_CONDITIONS_ENABLED))
console.log('Helmet enabled:')
console.log(showFeature(FEATURE_HELMET_ENABLED))

if (showFeature(FEATURE_HELMET_ENABLED)) {
  console.log('Helmet enabled')
  app.use(helmet(getConfigValue(HELMET)))
}

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
    store: getStore(),
  })
)

app.use(errorStack)
app.use(appInsights)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())

tunnel.init()
app.use(serviceRouter)

/**
 * Open Routes
 *
 * Any routes here do not have authentication attached and are therefore reachable.
 */
app.get('/oauth2/callback', auth.oauth)
app.get('/external/ping', (req, res) => {
  console.log('Pong')
  res.send({
    allowConfigMutations: process.env.ALLOW_CONFIG_MUTATIONS,
    nodeConfigEnv: process.env.NODE_CONFIG_ENV,
    // 1st set
    // tslint:disable-next-line:object-literal-sort-keys
    idamClient: getConfigValue(IDAM_CLIENT),
    maxLogLine: getConfigValue(MAX_LOG_LINE),
    microService: getConfigValue(MICROSERVICE),
    maxLines: getConfigValue(MAX_LINES),
    now: getConfigValue(NOW),
    // 2nd set
    cookieToken: getConfigValue(COOKIE_TOKEN),
    cookieUserId: getConfigValue(COOKIES_USERID),
    oauthCallBack: getConfigValue(OAUTH_CALLBACK_URL),
    protocol: getConfigValue(PROTOCOL),
    // 3rd set
    idamApiPath: getConfigValue(SERVICES_IDAM_API_PATH),
    idamWeb: getConfigValue(SERVICES_IDAM_WEB),
    s2sPath: getConfigValue(SERVICE_S2S_PATH),
    rdProfessionalApi: getConfigValue(SERVICES_RD_PROFESSIONAL_API_PATH),
    feeAndPayApi: getConfigValue(SERVICES_FEE_AND_PAY_API_PATH),
    termsAndConditionsApi: getConfigValue(SERVICES_TERMS_AND_CONDITIONS_API_PATH),
    // 4th set
    sessionSecret: getConfigValue(SESSION_SECRET),
    jurisdictions: getConfigValue(JURISDICTIONS),
    // 5th set
    featureSecureCookieEnabled: showFeature(FEATURE_SECURE_COOKIE_ENABLED),
    featureAppInsightEnabled: showFeature(FEATURE_APP_INSIGHTS_ENABLED),
    featureProxyEnabled: showFeature(FEATURE_PROXY_ENABLED),
    featureTermsAndConditionsEnabled: showFeature(FEATURE_TERMS_AND_CONDITIONS_ENABLED),
  })
})
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
