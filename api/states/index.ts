import * as express from 'express'
import * as log4jui from '../lib/log4jui'
import { process } from '../lib/stateEngine'
import { Store } from '../lib/store'
import { asyncReturnOrError } from '../lib/util'
import * as rdProfessional from '../services/rd-professional'
import mapping from './mapping'
import templates from './templates'

const logger = log4jui.getLogger('states')
const ERROR400 = 400

async function registerOrganisation(res, payloadData) {

  let domain

  if (payloadData.emailAddress) {
    domain = payloadData.emailAddress.split('@')
  }
  const data = {
    name: payloadData.orgName,
    url: "dfdfg",
    sraId: "dfhdfg",
    dxAddress: { dxNumber: payloadData.DXnumber, dxExchange: payloadData.DXexchange },
    superUser:
    {
      firstName: payloadData.firstName,
      lastName: payloadData.lastName,
      email: payloadData.emailAddress,
      pbaAccount: { pbaNumber: `${payloadData.PBAnumber1} ${payloadData.PBAnumber2}` },
      address: { address: `${payloadData.officeAddressOne}, ${payloadData.officeAddressOne}, ${payloadData.townOrCity}, ${payloadData.county}.` }
    },
    pbaAccounts: [{ pbaNumber: `${payloadData.PBAnumber1} ${payloadData.PBAnumber2}` }],
    domains: [
      {
        domain: domain[1],
      },
    ],
    address: {
      address: `${payloadData.officeAddressOne}, ${payloadData.officeAddressOne}, ${payloadData.townOrCity}, ${payloadData.county}.`
    }
  }

  logger.info('Payload assembled')
  logger.info(JSON.stringify(data))

  return await asyncReturnOrError(
    rdProfessional.postOrganisation(data),
    'Error registering organisation',
    res,
    logger,
    false
  )
}

async function payload(req, res, payloadData) {
  console.log(req.body)
  logger.info('Posting to Reference Data (Professional) service')
  const result = await registerOrganisation(res, payloadData)
  logger.info('Posted to Reference Data (Professional) service', result)

  if (result) {
    return 'registration-confirmation'
  }

  res.status(ERROR400).send('Error registering organisation')
  return null
}

async function handleStateRoute(req, res) {
  process(req, res, mapping, payload, templates, new Store(req))
}

export const router = express.Router({ mergeParams: true })

router.get('/states/:jurId/:caseTypeId/:caseId/:stateId', handleStateRoute)
router.post('/states/:jurId/:caseTypeId/:caseId/:stateId', handleStateRoute)

export default router
