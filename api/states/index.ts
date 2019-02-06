import * as express from 'express'

import { process } from '../lib/stateEngine'
import { Store } from '../lib/store'

import mapping from './mapping'
import templates from './templates'

function payload(req, res,store) {
    console.log('payload')
}

async function handleStateRoute(req, res) {
    console.log('reached')
    process(req, res, mapping, payload, templates, new Store(req))
}

async function handleHealthRoute(req, res) {
    console.log('reached')
    res.send('health')
}

export  const router = express.Router({ mergeParams: true })

router.get('/states/:jurId/:caseTypeId/:caseId/:stateId', handleStateRoute)
router.get('/health', handleHealthRoute)
router.post('/states/:jurId/:caseTypeId/:caseId/:stateId', handleStateRoute)

export default router
