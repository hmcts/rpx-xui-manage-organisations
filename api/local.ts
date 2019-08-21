/**
 * Common to both server.ts and local.ts files
 */

import * as bodyParser from 'body-parser'
import * as cookieParser from 'cookie-parser'
import * as express from 'express'
import * as session from 'express-session'
import * as sessionFileStore from 'session-file-store'
import * as auth from './auth'
import {appInsights} from './lib/appInsights'
import {config} from './lib/config'
import {errorStack} from './lib/errorStack'
import openRoutes from './openRoutes'
import routes from './routes'

/**
 * Only used Locally
 */
import * as tunnel from './lib/tunnel'
import * as log4js from 'log4js'
import * as fs from "fs";
import * as https from "https";
import * as http from "http";

const FileStore = sessionFileStore(session)

const app = express()
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

app.use(
  session({
    cookie: {
      httpOnly: true,
      maxAge: 1800000,
      secure: config.secureCookie !== false,
    },
    name: 'jui-webapp',
    resave: true,
    saveUninitialized: true,
    secret: config.sessionSecret,
    store: new FileStore({
      path: process.env.NOW ? '/tmp/sessions' : '.sessions',
    }),
  })
)

/**
 * Used Client side
 */
if (config.proxy) {
  tunnel.init()
}




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

/**
 * We can serve http content over any port. Hence I've left this as 3001.
 */
const httpPort = 3001
const httpsPort = 3001
// app.listen(port)

/**
 * This is being pulled in from the Key Vault on the server, on Azure.
 */
const getSslCredentials = () => {
  return {
    key: fs.readFileSync('../ssl/server.key'),
    cert: fs.readFileSync('../ssl/server.crt'),
  }
}
const httpServer = http.createServer(app)
const httpsServer = https.createServer(getSslCredentials(), app)

httpsServer.listen(httpsPort, () => {
  console.log(`Https Server started on port ${httpsPort}`)
})

if (process.env.APPINSIGHTS_INSTRUMENTATIONKEY) {
  config.appInsightsInstrumentationKey = process.env.APPINSIGHTS_INSTRUMENTATIONKEY
}

const logger = log4js.getLogger('server')
logger.level = config.logging ? config.logging : 'OFF'

logger.info(`Local server up at ${port}`)
