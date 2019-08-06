import * as bodyParser from 'body-parser'
import * as cookieParser from 'cookie-parser'
import * as express from 'express'
import * as session from 'express-session'

import * as log4js from 'log4js'
import * as sessionFileStore from 'session-file-store'
import * as auth from './auth'
import {appInsights} from './lib/appInsights'
import {config} from './lib/config'
import { http } from './lib/http'
import {errorStack} from './lib/errorStack'
import * as tunnel from './lib/tunnel'
import openRoutes from './openRoutes'
import routes from './routes'

const FileStore = sessionFileStore(session)

const app = express()
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

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

if (config.proxy) {
  tunnel.init()
}

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
app.get('/open/ping', (req, res) => {
  console.log('Pong')
  res.send('Pong')
})

// So over here the open routes will
// still need the s2s token
app.use('/open', openRoutes)

// so we can hit this
app.get('/open/prdTest', async (req, res) => {
  console.log('prdTest')

  const body = {
    'contactInformation': [{
      'addressLine1': 'Building and street',
      'addressLine2': null,
      'county': 'England',
      'postcode': 'E1734ER',
      'townCity': 'Town or city'
    }],
    'name': 'Awesome Digital2 Ltd',
    'superUser': {'email': 'phssdsdliasdp@test.com', 'firstName': 'asd', 'lastName': 'asd'},
    'sraId': 'asdasd',
    'paymentAccount': ['PBA8233512', 'PBA8733523']
  };

  const prdUrl = 'https://rd-professional-api-preview.service.core-compute-preview.internal'

  try {
    const response = await http.post(`${prdUrl}/refdata/internal/v1/organisations`, body)
    console.log(response)
    res.send(response.data)
  } catch (error) {
    const errReport = {
      apiError: error.data.errorMessage,
      apiErrorDescription: error.data.errorDescription,
      statusCode: error.status,
    }
    console.log('error')
    console.log(error)
    res.send(errReport).status(418)
  }
})

/**
 * We are attaching authentication to all subsequent routes.
 */
app.use(auth.attach)

/**
 * Secure Routes
 *
 * TODO: rename routes to secureApiRoutes
 */
app.use('/api', routes)
app.get('/api/logout', (req, res, next) => {
  auth.doLogout(req, res)
})

const port = process.env.PORT || 3001
app.listen(port)

if (process.env.APPINSIGHTS_INSTRUMENTATIONKEY) {
  config.appInsightsInstrumentationKey = process.env.APPINSIGHTS_INSTRUMENTATIONKEY
}

const logger = log4js.getLogger('server')
logger.level = config.logging ? config.logging : 'OFF'

logger.info(`Local server up at ${port}`)
