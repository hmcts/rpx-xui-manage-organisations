import { Router } from 'express'
import accountsRouter from './accounts'
import * as auth from './auth'
import editUserPermissions from './editUserPermissions'
import getUserTermsAndConditions from './getUserTermsAndConditions'
import healthCheck from './healthCheck'
import inviteUser from './inviteUser'
import getJurisdictions from './jurisdictions'
import organisationRouter from './organisation'
import payments from './payments'
import postUserTermsAndConditions from './postUserTermsAndConditions'
import suspendUser from './suspendUser'
import getTermsAndConditions from './termsAndConditions'
import unnassignedCasesRouter from './unassignedCases'
import userDetailsRouter from './user'
import getUserList from './userList'

const router = Router({ mergeParams: true })

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
router.use('/userTermsAndConditions', postUserTermsAndConditions)
router.use('/termsAndConditions', getTermsAndConditions)
router.use('/user/:userId/suspend', suspendUser)
router.use('/editUserPermissions/users/:userId', editUserPermissions)
router.use('/unassignedCases', unnassignedCasesRouter)
export default router
