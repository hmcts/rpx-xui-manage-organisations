/**
 * Common to both server.ts and local.ts files
 */
import * as bodyParser from 'body-parser'
import * as cookieParser from 'cookie-parser'
import * as express from 'express'
import * as session from 'express-session'
import * as passport from 'passport'
import * as sessionFileStore from 'session-file-store'
import * as auth from './auth'
import { appInsights } from './lib/appInsights'
import { config } from './lib/config'
import errorHandler from './lib/error.handler'
import { errorStack } from './lib/errorStack'
import openRoutes from './openRoutes'
import routes from './routes'

/**
 * Used Server side
 */
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
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())

app.use(passport.initialize())
app.use(passport.session())
app.use(async (req, res, next) => {
  await auth.configure(req, res, next)
})

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((id, done) => {
  done(null, id)
})

/**
 * Open Routes
 *
 * Any routes here do not have authentication attached and are therefore reachable.
 */
// @ts-ignore
const logger: JUILogger = log4jui.getLogger('Application')

app.get('/oauth2/callback', (req: any, res, next) => {
  passport.authenticate('oidc', (error, user, info) => {

    // TODO: give a more meaningful error to user rather than redirect back to idam
    // return next(error) would pass off to error.handler.ts to show users a proper error page etc
    if (error) {
      logger.error(error)
      // return next(error)
    }
    if (info) {
      logger.info(info)
      // return next(info)
    }
    if (!user) {
      return res.redirect('/auth/login')
    }
    req.logIn(user, err => {
      if (err) {
        return next(err)
      }
      return auth.authCallbackSuccess(req, res)
    })
  })(req, res, next)
})
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

app.use('/auth', auth.router)
app.use('/api', routes)
app.get('/api/logout', (req, res, next) => {
  auth.doLogout(req, res)
})

// custom error handlers need to be used last
app.use(errorHandler)

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
