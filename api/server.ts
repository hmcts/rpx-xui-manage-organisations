/**
 * Common to both server.ts and local.ts files
 */
import * as bodyParser from 'body-parser'
import * as cookieParser from 'cookie-parser'
import * as express from 'express'
import * as session from 'express-session'
import * as sessionFileStore from 'session-file-store'
import * as auth from './auth'
import { appInsights } from './lib/appInsights'
import { config } from './lib/config'
import { errorStack } from './lib/errorStack'
import openRoutes from './openRoutes'
import routes from './routes'

/**
 * Used Server side
 */
import serviceRouter from './services/serviceAuth'
import * as ejs from 'ejs'
import * as path from 'path'
import * as tunnel from './lib/tunnel'

const FileStore = sessionFileStore(session)

const app = express()

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

if (process.env.APPINSIGHTS_INSTRUMENTATIONKEY) {
    config.appInsightsInstrumentationKey = process.env.APPINSIGHTS_INSTRUMENTATIONKEY
}

app.listen(process.env.PORT || 3000)
