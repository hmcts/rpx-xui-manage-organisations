import * as express from 'express'
import * as restAPI from './index'

export const router = express.Router({ mergeParams: true })
router.get('/users', restAPI.getUsers)
router.get('/cases', restAPI.getCases)
router.post('/case-assignments', restAPI.assignCasesToUsers)
router.get('/case-assignments', restAPI.getCases)
