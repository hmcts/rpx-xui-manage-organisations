import * as express from 'express'

export const router = express.Router({mergeParams: true})

router.post('/payments', handleAccountPaymentRoute)
router.post('/payments/summary', handleAccountPaymentSummaryRoute)

async function handleAccountPaymentRoute(req, res){
  console.log('req, res', req, res)
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
