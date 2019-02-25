import * as express from 'express'
import * as log4js from 'log4js';
import config from '../lib/config';
const logger = log4js.getLogger('auth')
logger.level = config.logging
export const router = express.Router({mergeParams: true})
import { http } from '../lib/http'
import {Payment, Payments} from './pba-transactions';
import {AxiosResponse} from 'axios';
router.get('/account/pbas/', handleAccountPbasRoute)
router.get('/account/:id', handleAccountRoute)
router.get('/account/:id/transactions', handleAccountPbaTransactionsRoute)

async function handleAccountPbasRoute(req, res) {
  try {
    const response = await http.get(`${config.services.rd_professional_api}/organisations/${req.session.auth.orgId}/pbas`)
    res.send(response.data)
  } catch (error) {
    const errReport = JSON.stringify({ apiError: error, apiStatusCode: error.statusCode, message: '3rd party service payment api return error'})
    res.status(500).send(errReport)
  }
}
async function handleAccountRoute(req, res) {
  try {
    const response = await http.get(`${config.services.payment_api}/accounts/${req.params.id}`)
    res.send(response.data)
  } catch (error) {
    const errReport = JSON.stringify({ apiError: error, apiStatusCode: error.statusCode, message: '3rd party service payment api return error'})
    res.status(500).send(errReport)
  }
}

async function handleAccountPbaTransactionsRoute(req, res){
  try {
    const response: AxiosResponse<any> = await http.get(`${config.services.payment_api}/pba-accounts/${req.params.id}/payments`)
    const dataObj: Payments = response.data.payments
    res.send(dataObj)
  } catch (error) {
    const errReport = JSON.stringify({ apiError: error, apiStatusCode: error.statusCode, message: '3rd party service payment api return error'})
    res.status(500).send(errReport)
  }
}


export default router
