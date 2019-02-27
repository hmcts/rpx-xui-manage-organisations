import * as express from 'express'
import * as log4jui from '../lib/log4jui';
import config from '../lib/config';
const logger = log4jui.getLogger('auth')
export const router = express.Router({mergeParams: true})
import { http } from '../lib/http'
import {UserMock} from './user.mock';

router.get('/details', handleUserRoute)

async function handleUserRoute(req, res) {
  logger.info('orgId', req.session.auth.orgId )
  logger.info('userId', req.session.auth.userId )

  const mockUser = UserMock
  return res.json(mockUser)

  // try {
  //   const response = await http.get(`${config.services.rd_professional_api}/organisations/${req.session.auth.orgId}/users/${req.session.auth.userId}`)
  //   logger.info('Calling responser', response)
  //   res.send(response)
  // } catch (error) {
  //   logger.info(error)
  //   //const errReport = JSON.stringify({ apiError: error, apiStatusCode: error.statusCode, message: '3rd party service payment api return error'})
  //   res.status(500).send(error)
  // }
}

export default router
