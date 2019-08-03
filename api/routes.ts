import * as express from 'express'
import accountsRouter from './accounts'
import * as auth from './auth'
import healthCheck from './healthCheck'
import inviteUser from './inviteUser'
import getJurisdictions from './jurisdictions'
import getappInsightsInstrumentationKey from './monitoring-tools'
import organisationRouter from './organisation'
import stateRouter from './states'
import userDetailsRouter from './user'
import getUserList from './userList'

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
const router = express.Router({ mergeParams: true })

router.use(auth.attach) // attach user-profile to all api routes
router.use('/decisions', stateRouter)
router.use('/organisation', organisationRouter)
router.use('/accounts', accountsRouter)
router.use('/user', userDetailsRouter)
router.use('/healthCheck', healthCheck)
router.use('/inviteUser', inviteUser)
router.use('/userList', getUserList)
router.use('/userDetails', getUserList)
router.use('/monitoring-tools', getappInsightsInstrumentationKey)
router.use('/jurisdictions', getJurisdictions)

export default router
