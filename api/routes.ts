
import * as express from 'express'
import * as auth from './auth'

const router = express.Router({ mergeParams: true })

router.use('/logout', auth.logout)

export default router
