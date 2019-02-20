import * as express from 'express'
import * as log4js from 'log4js';
import config from '../lib/config';
const logger = log4js.getLogger('auth')
logger.level = config.logging
export const router = express.Router({mergeParams: true})
import { http } from '../lib/http'

router.get('/account/:id', handleAccountRoute)
router.get('/account/:id/transactions', handleAccountPbaTransactionsRoute)

async function handleAccountRoute(req, res){
  logger.info('id::', req.params.id)

  try {
    const response = await http.get(`${config.services.payment_api}/accounts/${req.params.id}`)
    logger.info('response::', response.data)
    res.send(response.data)
  } catch (error) {
    logger.info('error', error)
    const errReport = JSON.stringify({ apiError: error, apiStatusCode: error.statusCode, message: '3rd party service payment api return error'})
    res.status(500).send(errReport)
  }
}

async function handleAccountPbaTransactionsRoute(req, res){
  logger.info('handleAccountPbaTransactionsRoute id::', req.params.id)
  try {
    logger.info('HTTP CALL', `${config.services.payment_api}/pba-accounts/${req.params.id}/payments`)
    const response = await http.get(`${config.services.payment_api}/pba-accounts/${req.params.id}/payments`)
    logger.info('response::', response.data)
    res.send(response.data)
  } catch (error) {
    logger.info('error', error)
    const errReport = JSON.stringify({ apiError: error, apiStatusCode: error.statusCode, message: '3rd party service payment api return error'})
    res.status(500).send(errReport)
  }
}


export default router
