import * as express from 'express'
import * as log4js from 'log4js'
import config from '../lib/config'
import {EnhancedRequest} from '../lib/models'
import {PaymentAccountDto} from '../lib/models/transactions'
import {asyncReturnOrError} from '../lib/util'
import {getAccount, getPayments} from '../services/payment'
import {getAccountsForOrganisation} from '../services/rdProfessionals'
import { mockReq, mockRes } from 'sinon-express-mock'
const logger = log4js.getLogger('auth')
logger.level = config.logging
export const router = express.Router({mergeParams: true})

export async function accountsForOrganisation(req: EnhancedRequest, res: express.Response): Promise<PaymentAccountDto[]> {
  return await asyncReturnOrError(
    getAccountsForOrganisation(req.session.auth.orgId),
    '3rd party service payment api return error - Cannot get accounts for organisation',
    res,
    logger
  )
}

export async function handleAccountPbasRoute(req: EnhancedRequest, res: express.Response) {

  const accounts: PaymentAccountDto[] = await this.accountsForOrganisation(req, res)

  if (accounts) {
    res.send(accounts)
  }

}

export async function validatePBANumberForOrganisation(req: EnhancedRequest, res: express.Response): Promise<boolean> {
  const accounts: PaymentAccountDto[] = await this.accountsForOrganisation(req, res)

  if (accounts && !accounts.some(account => account.pbaNumber === req.params.id)) {
    res.status(401).send('Unauthorised PBA number for organisation')
    return false
  }

  return !!accounts.length || false
}

export async function handleAccountRoute(req: EnhancedRequest, res: express.Response) {
  const isValidPBA = await this.validatePBANumberForOrganisation(req, res)

  if (isValidPBA) {

    const response = await asyncReturnOrError(
      getAccount(req.params.id),
      '3rd party service payment api return error - cannot get account',
      res,
      logger
    )

    if (response) {
      res.send(response.data)
    }
  }
}

export async function handleAccountPbaTransactionsRoute(req: EnhancedRequest, res: express.Response) {
  const isValidPBA = await this.validatePBANumberForOrganisation(req, res)

  if (isValidPBA) {

    const response = await asyncReturnOrError(
      getPayments(req.params.id),
      '3rd party service payment api return error - cannot get account payments',
      res,
      logger
    )

    if (response) {
      res.send(response.data)
    }
  }
}
// overview
router.get('/pbas', handleAccountPbasRoute)
// Single account
router.get('/:id', handleAccountRoute)
router.get('/:id/transactions', handleAccountPbaTransactionsRoute)

export default router
