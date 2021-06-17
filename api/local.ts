import {app, logger} from './application'
import errorHandler from './lib/error.handler'

const port = process.env.PORT || 3001

console.log('WE ARE USING local.ts on the box.')
app.use(errorHandler)
app.listen(port, () => logger.info(`Local server up at ${port}`))
