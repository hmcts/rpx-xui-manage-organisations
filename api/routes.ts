import * as express from 'express'
import accountsRouter from './accounts'
import * as auth from './auth'
import getUserTermsAndConditions from './getUserTermsAndConditions'
import healthCheck from './healthCheck'
import inviteUser from './inviteUser'
import getJurisdictions from './jurisdictions'
import organisationRouter from './organisation'
import payments from './payments'
import postUserTermsAndConditions from './postUserTermsAndConditions'
import userDetailsRouter from './user'
import getUserList from './userList'

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '1'
const router = express.Router({ mergeParams: true })

router.use(auth.attach)
router.use('/organisation', organisationRouter)
router.use('/accounts', accountsRouter)
router.use('/user', userDetailsRouter)
router.use('/healthCheck', healthCheck)
router.use('/inviteUser', inviteUser)
router.use('/userList', getUserList)
router.use('/userDetails', getUserList)
router.use('/jurisdictions', getJurisdictions)
router.use('/payments/:account', payments)
router.use('/userTermsAndConditions/:userId', getUserTermsAndConditions)
router.use('/api/userTermsAndConditions', postUserTermsAndConditions)

export default router
