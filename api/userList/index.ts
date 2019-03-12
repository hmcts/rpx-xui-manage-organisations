import {logger} from 'codelyzer/util/logger'
import * as express from 'express'
import config from '../lib/config'
import { http } from '../lib/http'

async function handleUserListRoute(req, res) {
  const orgId = req.session.auth.orgId
  try {
    const response = await http.get(`${config.services.rdProfessionalApi}/organisations/${orgId}/users`)
    logger.info('response::', response.data);
    res.send(response.data)

  } catch (error) {
    const errReport = JSON.stringify({ apiError: error, apiStatusCode: error.statusCode, message: 'List of users route error'})
    res.send(errReport).status(500)

  }
}

export const router = express.Router({ mergeParams: true })

router.get('/', handleUserListRoute)

export default router
