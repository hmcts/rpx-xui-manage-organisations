import * as express from 'express'
import * as log4jui from '../lib/log4jui';
import config from '../lib/config';
const logger = log4jui.getLogger('auth')
export const router = express.Router({mergeParams: true})
import { http } from '../lib/http'
import {UserMock} from './user.mock'
import {UserProfileModel} from './user';

router.get('/details', handleUserRoute)

async function handleUserRoute(req, res) {
  logger.info('orgId', req.session.auth.orgId )
  logger.info('userId', req.session.auth.userId )
  logger.info('email', req.session.auth.email)

  const mockUser: UserProfileModel = UserMock

  try {
    const response = await http.get(`${config.services.rdProfessionalApi}/search/users/henry_fr_harper@yahoo.com`)
    // const response = await http.get(`${config.services.rdProfessionalApi}/search/users/${req.session.auth.email}`)
    logger.info('Calling responser', response)
    res.send(mockUser)
  } catch (error) {
    logger.info(error)
    //const errReport = JSON.stringify({ apiError: error, apiStatusCode: error.statusCode, message: '3rd party service payment api return error'})
    res.status(500).send(error)
  }
}

export default router
