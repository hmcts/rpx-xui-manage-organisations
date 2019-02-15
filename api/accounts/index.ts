import * as express from 'express'
import * as log4js from 'log4js';
import config from '../lib/config';
const logger = log4js.getLogger('account')
logger.level = config.logging
export const router = express.Router({mergeParams: true})

router.post('/payments', handleAccountPaymentRoute)
router.post('/payments/summary', handleAccountPaymentSummaryRoute)

async function handleAccountPaymentRoute(req, res){
  console.log('req, res', req, res)
  logger.info('Yh')
  res.json({
    asd: 'asdasd'
  })
}

async function handleAccountPaymentSummaryRoute(req, res){
  console.log('req, res', req, res)
  res.json({
    asd: 'asdasd'
  })
}

export default router
