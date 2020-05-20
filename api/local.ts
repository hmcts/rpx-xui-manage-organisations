import {app, logger} from './application'

const port = process.env.PORT || 3001

console.log('WE ARE USING local.ts on the box.')

app.listen(port, () => logger.info(`Local server up at ${port}`))
