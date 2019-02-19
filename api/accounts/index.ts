import * as express from 'express'
import * as log4js from 'log4js';
import config from '../lib/config';
const logger = log4js.getLogger('auth')
logger.level = config.logging
export const router = express.Router({mergeParams: true})
import { http } from '../lib/http'

router.get('/account/:id', handleAccountRoute)
router.post('/payments', handleAccountPaymentRoute)
router.post('/payments/summary', handleAccountPaymentSummaryRoute)


async function handleAccountRoute(req, res){
  let id = req.params.id;
  let url = 'https://payment-api-aat.service.core-compute-aat.internal/accounts'
  logger.info('id::', id)
  //

  const d = await http.get(
    `${url}/${id}`
  )

  return {dasdas: 'asdasd'};
}
async function handleAccountPaymentRoute(req, res){
  console.log('req, res', req, res)
  return { asd: 'asdasd'}
}

async function handleAccountPaymentSummaryRoute(req, res){
  console.log('req, res', req, res)
  return { asd: 'asdasd'}
}



export default router
