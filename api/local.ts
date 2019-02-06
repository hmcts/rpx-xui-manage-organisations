
import * as express from 'express'
import * as session from 'express-session'
import * as log4js from 'log4js'
import * as sessionFileStore from 'session-file-store'

import config from './lib/config'
import routes from './routes'

const FileStore = sessionFileStore(session);

const app = express()

app.use(
    session({
        cookie: {
            httpOnly: true,
            maxAge: 1800000,
            secure: config.secureCookie !== false
        },
        name: "jui-webapp",
        resave: true,
        saveUninitialized: true,
        secret: config.sessionSecret,
        store: new FileStore({
            path: process.env.NOW ? "/tmp/sessions" : ".sessions",
        })
    })
)

app.use('/api', routes)

const port = process.env.PORT || 3000
app.listen(port)

const logger = log4js.getLogger('server')
logger.level = config.logging ? config.logging : 'OFF'

logger.info(`Local server up at ${port}`)
